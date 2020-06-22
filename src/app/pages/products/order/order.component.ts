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
}
