import { Injectable } from '@angular/core';
import { Order } from 'src/app/interfaces/orders';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubscriber = new BehaviorSubject<Order[]>([]);
  private orderStore: Order[] = [];
  public orders: Observable<Array<Order>>  = this.ordersSubscriber.asObservable();

  constructor() { }

  addToOrders(order: Order): void {
    this.orderStore.push(order);
    this.ordersSubscriber.next(this.orderStore);
  }

  removeFromOrders(index: number): void {
    const newOrders = this.orderStore;
    newOrders.splice(index, 1);
    this.ordersSubscriber.next(newOrders);
  }
}
