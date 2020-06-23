import { Component, OnInit } from '@angular/core';
import { OrderForm, Order } from 'src/app/interfaces/orders';
import { OrderService } from 'src/app/services/order/order.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  dateTimePickerFormControl: any;
  orderForm: OrderForm = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '206-123-4567',
    isDelivery: true,
    address: '1234 Main St Seattle, WA 98125',
    notes: 'I might be late 15 minutes...',
    date: { year: moment().add(2, 'day').year(), month: moment().add(2, 'day').month() + 1, day: moment().add(2, 'day').date() },
    time: { hour: 17, minute: 0, second: 0 },
    orders: []
  };
  orders: Order[] = [];
  totalPrice: number;

  constructor(public orderService: OrderService, public googleMapsService: GoogleMapsService) {
    this.orderService = orderService;
    this.googleMapsService = googleMapsService;
  }

  ngOnInit(): void {
    this.orderService.orders.subscribe((orders: Order[]) => {
      this.orderForm.orders = orders;
      this.totalPrice = this.calcTotal(this.orderForm.orders);
    });
    this.googleMapsService.getGeocode('13515 27th ave NE, Seattle, WA 98125');
    this.googleMapsService.getDistance(47.456950, -122.289290);
  }

  calcTotal(orders: Order[]): number {
    let total = 0;
    orders.map((order: Order) => {
      total += order.price;
    });
    return total;
  }

  getDateTimeText() {
    if (_.isNil(this.orderForm.time) || _.isNil(this.orderForm.time)) {
      return 'Date & Time';
    }
    return moment(`${this.orderForm.date.year}-${this.orderForm.date.month}-${this.orderForm.date.day} ${this.orderForm.time.hour}:${this.orderForm.time.minute}:${this.orderForm.time.second}`).format('LLL');
  }

  isDateTimePickerInValid() {
    const date = this.orderForm.date;
    const time = this.orderForm.time;
    this.dateTimePickerFormControl = {};
    if (!_.isObject(date) || !_.isObject(time)) {
      return true;
    };

    const dateTime = moment(`${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:${time.second}`);
    const isWeekend = _.includes(['Saturday', 'Sunday'], dateTime.format('dddd'));

    let minTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
    let maxTime: NgbTimeStruct = { hour: 21, minute: 0, second: 0 };

    if (!isWeekend) {
      minTime = { hour: 17, minute: 0, second: 0 };
    }

    if (this.orderForm.time.hour < minTime.hour) {
      this.dateTimePickerFormControl.tooEarly = true;
      return true;
    }

    if ((this.orderForm.time.hour > maxTime.hour) || (_.isEqual(this.orderForm.time.hour, maxTime.hour) && (this.orderForm.time.minute > maxTime.minute))) {
      this.dateTimePickerFormControl.tooLate = true;
      return true;
    }

    return false;
  }

  validateDateTimePicker(): void {
    if (this.isDateTimePickerInValid()) {
      return;
    }
    console.log(this.orderForm.date, this.orderForm.time);
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

    // All form validations passed. The Order Form is validated
    return false;
  };

  submit(): void {
    // Extra check to prevent submitting when form validations are invalid
    if (this.isOrderFormDisabled()) {
      return;
    }

    // removes undefined or null values
    const finalForm = _.omitBy(this.orderForm, _.isNil);
    console.log(finalForm);
  };
}
