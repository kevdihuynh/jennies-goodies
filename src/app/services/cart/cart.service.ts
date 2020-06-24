import { Injectable } from '@angular/core';
import { Order, OrderForm } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orderFormSubject = new BehaviorSubject<OrderForm>(
    {
      name: undefined,
      email: undefined,
      phoneNumber: undefined,
      isDelivery: true,
      address: undefined,
      notes: undefined,
      date: { year: moment().add(2, 'day').year(), month: moment().add(2, 'day').month() + 1, day: moment().add(2, 'day').date() },
      time: { hour: 17, minute: 0, second: 0 },
      orders: [],
      transporationFee: undefined,

      /* Switch between empty or mock data */

      // name: 'John Doe',
      // email: 'johndoe@example.com',
      // phoneNumber: '206-123-4567',
      // isDelivery: true,
      // address: '13515 27th ave NE, Seattle, WA 98125',
      // notes: 'I might be late 15 minutes...',
      // date: { year: moment().add(2, 'day').year(), month: moment().add(2, 'day').month() + 1, day: moment().add(2, 'day').date() },
      // time: { hour: 17, minute: 0, second: 0 },
      // orders: [],
      // transporationFee: undefined,
    }
  );
  public orderForm: Observable<OrderForm>  = this.orderFormSubject.asObservable();

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders: Observable<Array<Order>>  = this.ordersSubject.asObservable();

  constructor() {}

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