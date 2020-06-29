import { Component, OnInit, Input } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem, IUnitAmount, IPayer } from 'ngx-paypal';
import { environment } from '../../../../../environments/environment';
import { OrderForm, Order } from '../../../../interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { GlobalConstants } from '../../../../utils/global-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';

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
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        public cartService: CartService,
        public activeModal: NgbActiveModal,
        private afs: AngularFirestore
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
            const payerObj = {
                name: {
                    given_name: _.get(orderFormName, [0], ''),
                    surname: _.get(orderFormName, [1], '')
                },
                address: {
                    address_line_1: _.trim(`${_.get(this.orderForm, 'addressComponent.street_number', '')} ${_.get(this.orderForm, 'addressComponent.route', '')}`),
                    address_line_2: _.get(this.orderForm, '', ''),
                    admin_area_2: _.get(this.orderForm, 'addressComponent.locality', ''),
                    admin_area_1: _.get(this.orderForm, 'addressComponent.administrative_area_level_1', ''),
                    postal_code: _.get(this.orderForm, 'addressComponent.postal_code', ''),
                    country_code: _.get(this.orderForm, 'addressComponent.country', '')
                },
                email_address: this.orderForm.email,
                phone: {
                    phone_type: "MOBILE",
                    phone_number: {
                        national_number: this.orderForm.phoneNumber
                    }
                }
            };

            const getObjectsWithEmpty = (obj) => {
                return _(obj)
                  .pickBy(_.isObject) // get only objects
                  .mapValues(getObjectsWithEmpty) // call only for values as objects
                  .assign(_.omitBy(obj, _.isObject)) // save back result that is not object
                  .omitBy(_.isEmpty) // remove null and undefined from object
                  .value(); // get value
            };

            return getObjectsWithEmpty(payerObj);
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
                // This triggers when user's credit card gets approved
                // const data = {
                //     billingtoken: null,
                //     facilitatorAccessToken: "A21AAEm-E7FkbqKWadgERJdTRbIV8vplaFKcJfrjF3m9I13YbxQqGOOGfNNqIK4haJfqE03GcYngqm-Zhejv2_PQOf4mhM0Jg",
                //     orderID: "0GU08901S4582814A",
                //     payerID: "FBH3PT3KJBY5W"
                // }
                this.toastr.info(`We are now waiting for the transaction to complete...`, `Your Payment Form Has Been Approved!`,  {
                    positionClass: 'toast-bottom-left',
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: 5000
                });
            },
            onClientAuthorization: async (data: any) => {
                this.toastr.success(`We have received your order. You will receive an email confirmation soon. Thank you!`, `Transaction Completed!`,  {
                    positionClass: 'toast-bottom-left',
                    progressBar: true,
                    disableTimeOut: true
                });
                // This triggers after transaction completes. Can't put toaster message here some reason
                try {
                    const transactionId: string = data.purchase_units[0].payments.captures[0].id;
                    await this.afs.collection('orders').doc(transactionId).set({paypal: data, orderForm: this.orderForm});
                    this.cartService.clearCart();
                    this.activeModal.close('transaction-completed');
                } catch (error) {
                    console.log(error);
                }
            },
            onCancel: (data, actions) => {
                this.toastr.info('You have closed the Payment Form', 'Payment Form Cancelled', {
                    positionClass: 'toast-bottom-left',
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: 3000
                });
            },
            onError: err => {
                this.toastr.error('An error has occured in the Payment Form', 'Payment Form Error', {
                    positionClass: 'toast-bottom-left',
                    progressBar: true,
                    disableTimeOut: false
                });
            },
            onClick: async (data, actions) => {
                console.log(this.orderForm);
                this.toastr.info('You have opened the Payment Form', 'Last Step To Complete Your Order!', {
                    positionClass: 'toast-bottom-left',
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: 3000
                });
            },
        };
    };
}
