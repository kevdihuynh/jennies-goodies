import { Injectable } from '@angular/core';
import { Order } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private ordersSubscriber = new BehaviorSubject<Order[]>([]);
  private orderStore: Order[] = [];
  public orders: Observable<Array<Order>>  = this.ordersSubscriber.asObservable();

  constructor() { }

  addToCart(order: Order): void {
    this.orderStore.push(order);
    this.ordersSubscriber.next(this.orderStore);
  }

  removeFromCart(index: number): void {
    const newOrders = this.orderStore;
    newOrders.splice(index, 1);
    this.ordersSubscriber.next(newOrders);
  }

  clearCart(): void {
    this.ordersSubscriber.next([]);
  }
}
