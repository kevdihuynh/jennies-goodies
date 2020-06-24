import { Injectable } from '@angular/core';
import { Order } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public orders = new BehaviorSubject<Order[]>([]);

  constructor() { }

  addToCart(order: Order): void {
    console.log(this.orders.getValue());
    console.log(order);
    this.orders.next([...this.orders.getValue(), order]);
  }

  removeFromCart(index: number): void {
    const updatedOrders: Order[] = this.orders.getValue();
    updatedOrders.splice(index, 1);
    this.orders.next([...updatedOrders]);
  }

  clearCart(): void {
    this.orders.next([]);
  }
}
