import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { NgbDateStruct, NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  minDaysFromToday: number = 2;
  maxDaysFromToday: number = 90;
  minDateFromToday = moment().add(this.minDaysFromToday, 'day');
  maxDateFromToday = _.cloneDeep(this.minDateFromToday).add(this.maxDaysFromToday, 'day');

  datePickerModel: NgbDateStruct = { year: this.minDateFromToday.year(), month: this.minDateFromToday.month() + 1, day: this.minDateFromToday.date() };
  datePickerMinDate: NgbDateStruct = { year: this.minDateFromToday.year(), month: this.minDateFromToday.month() + 1, day: this.minDateFromToday.date() };
  datePickerMaxDate: NgbDateStruct = { year: this.maxDateFromToday.year(), month: this.maxDateFromToday.month() + 1, day: this.maxDateFromToday.date() };

  minTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  maxTime: NgbTimeStruct = { hour: 21, minute: 0, second: 0 };
  timePickerModel: NgbTimeStruct = _.cloneDeep(this.minTime);
  timePickerMeridian: boolean = true;
  timePickerSeconds: boolean = false;
  timePickerHourStep: number = 1;
  timePickerMinuteStep: number = 15;
  timePickerSecondStep: number = 0;

  timePickerFormControl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < this.minTime.hour) {
      return { tooEarly: true };
    }
    if ((value.hour > this.maxTime.hour) || ((value.hour === this.maxTime.hour) && (value.minute > this.maxTime.minute))) {
      return { tooLate: true };
    }

    return null;
  });



  cart: CartItem[] = [];
  cartService: CartService;
  totalPrice: number;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe((res) => {
      this.cart = res;
      this.totalPrice = this.calcTotal(this.cart);
    });
  }

  calcTotal(cart: CartItem[]): number {
    let total = 0;
    cart.map((cartItem: CartItem) => {
      total += cartItem.price;
    });
    return total;
  }
}
