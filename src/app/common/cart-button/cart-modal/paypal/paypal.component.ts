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
import { DatePipe } from '@angular/common';
import { GoogleCalendarService } from 'src/app/services/google-calendar/google-calendar.service';
@Component({
    selector: 'app-paypal',
    templateUrl: './paypal.component.html',
    styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
    public _ = _;
    public globalConstants: any = GlobalConstants;
    public payPalConfig?: IPayPalConfig;
    public environment = environment;
    public orderForm: OrderForm;

    constructor(
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        public cartService: CartService,
        public activeModal: NgbActiveModal,
        private afs: AngularFirestore,
        private datePipe: DatePipe,
        public googleCalendarService: GoogleCalendarService
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

        const getDescription = (): string => {
            return `${_.get(this.orderForm, ['isDelivery']) ? 'Delivery' : 'Pickup'} at ${_.get(this.orderForm, ['address'])}  on ${this.datePipe.transform(this.orderForm.selectedDateTime.end.dateTime, 'fullDate')} between ${this.datePipe.transform(this.orderForm.selectedDateTime.start.dateTime, 'shortTime')} and ${this.datePipe.transform(this.orderForm.selectedDateTime.end.dateTime, 'shortTime')}`;
        }

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
                    name: this.cartService.displayFriendlyItemText(order),
                    quantity: order.quantity,
                    category: 'PHYSICAL_GOODS',
                    unit_amount: {
                        currency_code: _.toUpper(currency),
                        value: _.toString(this.cartService.getItemTotal(order.name, order.price, _.get(this.orderForm, ['discount'])))
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
                    items: getItems(),
                    description: getDescription()
                }],
                payer: getPayer(),
                application_context: {
                    shipping_preference: 'NO_SHIPPING'
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
                // This triggers when user's credit card gets approved
                // const data = {
                //     billingtoken: null,
                //     facilitatorAccessToken: "A21AAEm-E7FkbqKWadgERJdTRbIV8vplaFKcJfrjF3m9I13YbxQqGOOGfNNqIK4haJfqE03GcYngqm-Zhejv2_PQOf4mhM0Jg",
                //     orderID: "0GU08901S4582814A",
                //     payerID: "FBH3PT3KJBY5W"
                // }
                this.toastr.info(`We are now waiting for the transaction to complete...`, `Your Payment Form Has Been Approved!`,  {
                    positionClass: 'toast-top-left',
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: 5000
                });
            },
            onClientAuthorization: async (data: any) => {
                // Spinner has to turn off early due to inconsistent forever spinning
                this.spinner.hide();
                this.toastr.info('You will receive an email confirmation soon. Thank you!', 'Payment Received!', {
                    positionClass: 'toast-top-left',
                    progressBar: true,
                    disableTimeOut: true
                });
                try {
                    // Make a copy of the orderForm before it gets cleared
                    const finalOrderForm: OrderForm = _.cloneDeep(this.orderForm);
                    const transactionId: string = data.purchase_units[0].payments.captures[0].id;
                    this.afs.collection('transactions').doc(transactionId).set({paypal: data, orderForm: finalOrderForm});
                    await this.googleCalendarService.bookCalendar(finalOrderForm, transactionId);
                    this.cartService.clearCart();
                    this.activeModal.close('transaction-completed');
                    this.toastr.success(`Check your email to add this to your calendar!`, `Google Invite Sent!`,  {
                        positionClass: 'toast-top-left',
                        progressBar: true,
                        disableTimeOut: true
                    });
                } catch (error) {
                    console.log(error);
                    this.spinner.hide();
                    this.toastr.error(`Please contact us for confirmation: ${this.globalConstants.company.phoneNumber}`, `Calendar Invite Failed`,  {
                        positionClass: 'toast-top-left',
                        progressBar: true,
                        disableTimeOut: true
                    });
                }
            },
            onCancel: (data, actions) => {
                this.spinner.hide();
                this.toastr.info('You have closed the Payment Form', 'Payment Form Cancelled', {
                    positionClass: 'toast-top-left',
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: 3000
                });
            },
            onError: err => {
                console.log(err);
                this.spinner.hide();
                this.toastr.error('An error has occured in the Payment Form', 'Payment Form Error', {
                    positionClass: 'toast-top-left',
                    progressBar: true,
                    disableTimeOut: false
                });
            },
            onClick: async (data, actions) => {
                // console.log(this.orderForm);
                this.spinner.show();
                // if (
                //     data &&
                //     data.fundingSource &&
                //     data.fundingSource === 'card'
                // ) {
                //     // close the spinner since paypal widget not opens the card form
                //     // in app instead of as new tab
                //     setTimeout(() => {
                //         this.spinner.hide();
                //     }, 1000);
                // }
                this.toastr.info('You have opened the Payment Form', 'Last Step To Complete Your Order!', {
                    positionClass: 'toast-top-left',
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: 3000
                });
            },
        };
    };
}
