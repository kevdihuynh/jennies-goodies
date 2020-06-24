import { Component, OnInit, Input } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../../../environments/environment';
import { OrderForm } from '../../../../interfaces/cart';
import * as _ from 'lodash';

@Component({
    selector: 'app-paypal',
    templateUrl: './paypal.component.html',
    styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
    @Input() OrderForm: OrderForm;
    public _ = _;
    public payPalConfig?: IPayPalConfig;
    public environment = environment;

    constructor() { }

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        const currency = 'USD';
        const amount = 15;
        const category = 'donation';

        this.payPalConfig = {
            currency: _.toUpper(currency),
            clientId: this.environment.paypal.clientId,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: _.toUpper(currency),
                        value: _.toString(amount),
                        breakdown: {
                            item_total: {
                                currency_code: _.toUpper(currency),
                                value: _.toString(amount)
                            }
                        }
                    },
                    items: [{
                        name: `${_.capitalize(category)}`,
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: _.toUpper(currency),
                            value: _.toString(amount),
                        },
                    }]
                }],
                payer: {
                    name: {
                        given_name: "PayPal",
                        surname: "Customer"
                      },
                      address: {
                        address_line_1: '123 ABC Street',
                        address_line_2: 'Apt 2',
                        admin_area_2: 'San Jose',
                        admin_area_1: 'CA',
                        postal_code: '95121',
                        country_code: 'US'
                      },
                      email_address: "customer@domain.com",
                      phone: {
                        phone_type: "MOBILE",
                        phone_number: {
                          national_number: "14082508100"
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
