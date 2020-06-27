import { Component, OnInit, Input } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem, IUnitAmount, IPayer } from 'ngx-paypal';
import { environment } from '../../../../../environments/environment';
import { OrderForm, Order } from '../../../../interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-paypal',
    templateUrl: './paypal.component.html',
    styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
    public _ = _;
    public payPalConfig?: IPayPalConfig;
    public environment = environment;
    public orderForm: OrderForm;

    constructor(
        public cartService: CartService
    ) { }

    ngOnInit(): void {
        this.cartService.orderForm.subscribe((orderForm: OrderForm) => {
            this.orderForm = orderForm;
            this.initConfig();
        });
    }

    private initConfig(): void {
        const currency = 'USD';
        let item_total = this.orderForm.grandTotal;

        const getAmount = (): IUnitAmount => {
            const amountObj: IUnitAmount = {
                currency_code: _.toUpper(currency),
                value: _.toString(item_total),
                breakdown: {
                    item_total: {
                        currency_code: _.toUpper(currency),
                        value: _.toString(item_total)
                    }
                }
            }
            return amountObj;
        }

        const getItems = (): ITransactionItem[] => {
            const items = _.map(this.orderForm.orders, (order: Order): any => {
                return {
                    name: `${order.quantity} x ${order.name}  (${_.join(order.selectedFlavors, ', ')})`,
                    quantity: order.quantity,
                    category: 'PHYSICAL_GOODS',
                    unit_amount: {
                        currency_code: _.toUpper(currency),
                        value: _.toString(order.price),
                    }
                };
            });
            // Add delivery fee to breakdown
            if (this.orderForm.deliveryFee > 0) {
                items.push({
                    name: `Delivery Fee`,
                    quantity: 1,
                    category: 'PHYSICAL_GOODS',
                    unit_amount: {
                        currency_code: _.toUpper(currency),
                        value: _.toString(this.orderForm.deliveryFee),
                    }
                });
            }

            return items;
        }

        // added any since ngx-paypal doesnt have 'phone' interface
        const getPayer = (): IPayer | any => {
            // {street_number: "13515", route: "27th Avenue Northeast", neighborhood: "Olympic Hills", political: "United States", locality: "Seattle", …}
            // administrative_area_level_1: "WA"
            // administrative_area_level_2: "King County"
            // country: "US"
            // locality: "Seattle"
            // neighborhood: "Olympic Hills"
            // political: "United States"
            // postal_code: "98125"
            // postal_code_suffix: "3424"
            // route: "27th Avenue Northeast"
            // street_number: "13515"

            const orderFormName = _.split(this.orderForm.name, ' ');
            return {
                name: {
                    given_name: _.get(orderFormName, [0], this.orderForm.name),
                    surname: _.get(orderFormName, [1], undefined)
                },
                address: {
                    address_line_1: _.trim(`${_.get(this.orderForm, 'addressComponent.street_number', undefined)} ${_.get(this.orderForm, 'addressComponent.route', undefined)}`),
                    // address_line_2: _.get(this.orderForm, '', undefined),
                    admin_area_2: _.get(this.orderForm, 'addressComponent.locality', undefined),
                    admin_area_1: _.get(this.orderForm, 'addressComponent.administrative_area_level_1', undefined),
                    postal_code: _.get(this.orderForm, 'addressComponent.postal_code', undefined),
                    country_code: _.get(this.orderForm, 'addressComponent.country', undefined)
                },
                email_address: this.orderForm.email,
                phone: {
                    phone_type: "MOBILE",
                    phone_number: {
                        national_number: this.orderForm.phoneNumber
                    }
                }
            }
        }

        this.payPalConfig = {
            currency: _.toUpper(currency),
            clientId: this.environment.paypal.clientId,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: getAmount(),
                    items: getItems()
                }],
                payer: getPayer()
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                actions.order.get().then(details => { });
            },
            onClientAuthorization: (data) => {
                // this.toastrService.success('Transaction completed!');
            },
            onCancel: (data, actions) => {
            },
            onError: err => {
                // this.toastrService.warning(err);
            },
            onClick: (data, actions) => {
            },
        };
    };
}
