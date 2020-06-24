import { Injectable } from '@angular/core';
import { Order } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders: Observable<Array<Order>>  = this.ordersSubject.asObservable();

  constructor() { }

  addToCart(order: Order): void {
    this.ordersSubject.next([...this.ordersSubject.getValue(), order]);
  }

  removeFromCart(index: number): void {
    const currentOrders = this.ordersSubject.getValue();
    currentOrders.splice(index, 1);
    this.ordersSubject.next(currentOrders);
  }

  updateFromCart(order: Order, index: number): void {
    const currentOrders = this.ordersSubject.getValue();
    currentOrders.splice(index, 1, order);
    this.ordersSubject.next(currentOrders);
  }

  clearCart(): void {
    this.ordersSubject.next([]);
  }
}