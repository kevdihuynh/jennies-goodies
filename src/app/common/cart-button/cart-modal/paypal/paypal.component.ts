import { Component, OnInit, Input } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem, IUnitAmount } from 'ngx-paypal';
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
            console.log(this.orderForm);
        });
    }

    private initConfig(): void {
        const currency = 'USD';
        let item_total = _.reduce(this.orderForm.orders, (sum: number, order: Order): number => {
            return sum + (order.quantity * order.price);
        }, 0);
        // Add delivery fee to item_total
        item_total += (this.orderForm.deliveryFee || 0);


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
            if (this.orderForm.deliveryFee) {
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

        this.payPalConfig = {
            currency: _.toUpper(currency),
            clientId: this.environment.paypal.clientId,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: getAmount(),
                    items: getItems()
                }],
                payer: {
                    name: {
                        given_name: this.orderForm.name,
                        surname: "Customer"
                      },
                      address: {
                        address_line_1: this.orderForm.address,
                        address_line_2: 'Apt 2',
                        admin_area_2: 'San Jose',
                        admin_area_1: 'CA',
                        postal_code: '95121',
                        country_code: 'US'
                      },
                      email_address: this.orderForm.email,
                      phone: {
                        phone_type: "MOBILE",
                        phone_number: {
                          national_number: this.orderForm.phoneNumber
                        }
                      }
                }
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
