import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { NgbDateStruct, NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
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
