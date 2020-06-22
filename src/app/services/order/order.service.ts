import { Injectable } from '@angular/core';
import { Order } from 'src/app/interfaces/orders';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _orders = new BehaviorSubject<Order[]>([]);
  private orderStore: Order[] = [];
  public orders: Observable<Array<Order>>  = this._orders.asObservable();

  constructor() { }

  addToOrders(order: Order): void {
    this.orderStore.push(order);
    this._orders.next(this.orderStore);
  }
}
