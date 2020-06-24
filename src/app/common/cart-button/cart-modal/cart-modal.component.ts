import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderForm, Order } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit {
  _ = _;
  DEFAULT_PICKUP_ADDRESS: string = '1234 Main St Seattle, WA 98125';
  dateTimePickerFormControl: any = {};
  orderForm: OrderForm = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '206-123-4567',
    isDelivery: true,
    address: '13515 27th ave NE, Seattle, WA 98125',
    notes: 'I might be late 15 minutes...',
    date: { year: moment().add(2, 'day').year(), month: moment().add(2, 'day').month() + 1, day: moment().add(2, 'day').date() },
    time: { hour: 17, minute: 0, second: 0 },
    orders: []
  };
  orders: Order[] = [];
  totalPrice: number;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    public cartService: CartService,
    public googleMapsService: GoogleMapsService) {
    // If weekend, set default start time to 9am
    if (this.isClosedDays()) {
      this.orderForm.time = { hour: 9, minute: 0, second: 0 };
    }
  }

  ngOnInit(): void {
    this.cartService.orders.subscribe((orders: Order[]) => {
      this.orderForm.orders = orders;
      this.totalPrice = this.getTotalPrice(this.orderForm.orders);
    });
    this.googleMapsService.getGeocode('13515 27th ave NE, Seattle, WA 98125');
    this.googleMapsService.getDistance(47.456950, -122.289290);
  }

  closeCartModal(reason?: any): void {
    this.activeModal.close(reason);
  }

  dismissCartModal(reason?: string): void {
    this.activeModal.dismiss(reason);
  }

  removeFromCart(order: Order, index: number): void {
    this.toastr.error('', `${order.batchSize} pieces of ${order.name} (${_.toString(order.selectedFlavors)}) removed`, {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false
    });
    this.cartService.removeFromCart(index);
  }

  getTotalPrice(orders: Order[]): number {
    let total = 0;
    orders.map((order: Order) => {
      total += order.price;
    });
    return total;
  }

  isClosedDays() {
    if (!this.orderForm.date) {
      return false;
    }
    const dateTime = this.getMomentDate();
    const isClosedDays = _.includes(['Friday', 'Saturday', 'Sunday'], dateTime.format('dddd'));
    return isClosedDays;
  }

  getMomentDate() {
    if (_.isNil(this.orderForm.date)) {
      return null;
    }
    const date = this.orderForm.date;
    return moment(`${date.year}-${date.month}-${date.day}`);
  }

  getMomentDateTime() {
    if (_.isNil(this.orderForm.date) || _.isNil(this.orderForm.time)) {
      return null;
    }
    const date = this.orderForm.date;
    const time = this.orderForm.time;
    return moment(`${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:${time.second}`);
  }

  getDateTimeText() {
    if (_.isNil(this.orderForm.time) || _.isNil(this.orderForm.time)) {
      return 'Date & Time';
    }
    return this.getMomentDate().format('LLL');
  }

  isDateTimePickerInValid(): boolean {
    const date = this.orderForm.date;
    const time = this.orderForm.time;
    this.dateTimePickerFormControl = {};
    if (!_.isObject(date) || !_.isObject(time)) {
      return true;
    };

    let minTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
    let maxTime: NgbTimeStruct = { hour: 21, minute: 0, second: 0 };

    if (!this.isClosedDays()) {
      minTime = { hour: 17, minute: 0, second: 0 };
    }

    if (this.orderForm.time.hour < minTime.hour) {
      this.dateTimePickerFormControl.tooEarly = true;
      return true;
    }

    if ((time.hour > maxTime.hour) || (_.isEqual(time.hour, maxTime.hour) && (time.minute > maxTime.minute))) {
      this.dateTimePickerFormControl.tooLate = true;
      return true;
    }
    this.dateTimePickerFormControl.isValid = true;

    return false;
  }

  isOrderFormDisabled(): boolean {
    // Validate if name is unset
    if (_.isEmpty(_.get(this.orderForm, 'name'))) {
      return true;
    };

    // Validate if email is unset
    if (_.isEmpty(_.get(this.orderForm, 'email'))) {
      return true;
    };

    // Validate if phoneNumber is unset
    if (_.isEmpty(_.get(this.orderForm, 'phoneNumber'))) {
      return true;
    };

    // Validate if isDelivery is unset
    if (_.isNil(_.get(this.orderForm, 'isDelivery'))) {
      return true;
    };

    // Validate if Address is unset only if isDelivery is set
    if (_.isEmpty(_.get(this.orderForm, 'address')) && !_.isNil(_.get(this.orderForm, 'isDelivery')) && _.get(this.orderForm, 'isDelivery')) {
      return true;
    };

    // Validate if date and time are invalid
    if (this.isDateTimePickerInValid()) {
      return true;
    };

    // Validate if there is at least one item in order
    if (this.orderForm.orders.length < 1) {
      return true;
    }

    // All form validations passed. The Order Form is validated
    return false;
  };

  submit(): void {
    // Extra check to prevent submitting when form validations are invalid
    if (this.isOrderFormDisabled()) {
      return;
    }
    // TODO: Perform final call check to Google Calendar API to validate if the date & time selected does not conflict
    this.spinner.show();
    const finalDateTime = this.getMomentDateTime();
    console.log('finalDateTime', finalDateTime);
    const isDateTimeValid = true;
    if (isDateTimeValid) {
      // removes undefined or null values
      const finalForm = _.omitBy(this.orderForm, _.isNil);
      console.log('finalDateTime is valid', finalDateTime);
      console.log('finalForm', finalForm);
      this.closeCartModal('payment-success');
      this.toastr.success(`We have received your order. You will receive an email confirmation soon. Thank you!`, `Order Success!`,  {
        positionClass: 'toast-bottom-left',
        progressBar: true,
        disableTimeOut: true
      });
      this.cartService.clearCart();
      this.spinner.hide();
    } else {
      console.log('finalDateTime is not valid', finalDateTime);
      this.toastr.error(`Sorry! It looks like somebody has filled this timeslot. Please choose another available time`, `Schedule Conflict!`,  {
        positionClass: 'toast-bottom-left',
        progressBar: true,
        disableTimeOut: false
      });
      this.spinner.hide();
    }
  };

}
