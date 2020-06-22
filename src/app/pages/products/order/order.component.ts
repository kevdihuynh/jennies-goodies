import { Component, OnInit } from '@angular/core';
import { OrderForm } from 'src/app/interfaces/order-form';
import { CartItem } from 'src/app/interfaces/cart-item';
import { CartService } from 'src/app/services/cart/cart.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderForm: OrderForm = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '206-123-4567',
    isDelivery: true,
    address: '1234 Main St Seattle, WA 98125',
    notes: 'I might be late 15 minutes...',
    date: { year: moment().add(2, 'day').year(), month: moment().add(2, 'day').month() + 1, day: moment().add(2, 'day').date() },
    time: { hour: 9, minute: 0, second: 0 },
  };
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

  isDisabled(): boolean {
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

    // Validate if date is unset
    if (_.isEmpty(_.get(this.orderForm, 'date'))) {
      return true;
    };

    // Validate if date is unset
    if (_.isEmpty(_.get(this.orderForm, 'time'))) {
      return true;
    };

    // All form validations passed. The Order Form is validated
    return false;
  };

  submit(): void {
    // Extra check to prevent submitting when form validations are invalid
    if (this.isDisabled()) {
      return;
    }

    // removes undefined or null values
    const finalForm = _.omitBy(this.orderForm, _.isNil);
    console.log(finalForm);
  };
}
