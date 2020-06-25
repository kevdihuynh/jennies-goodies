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
      deliveryFee: undefined

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
      // deliveryFee: undefined,
    }
  );
  public orderForm: Observable<OrderForm>  = this.orderFormSubject.asObservable();

  constructor() {}

  updateOrderFormByField(key: string, value: any): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    _.set(currentOrderForm, key, value);
    this.orderFormSubject.next(currentOrderForm);
  }

  addToCart(order: Order): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const currentOrders = _.cloneDeep(currentOrderForm.orders);
    // Logic to group all the similar orders into one if there is any
    const exactOrdersExcludingQuantity = _.filter(_.cloneDeep(currentOrders), (currentOrder: Order) => {
      const omitFields = ['quantity'];
      return _.isEqual(_.omit(currentOrder, ['quantity']), _.omit(order, ['quantity']));
    });
    const totalExactOrderQuantity: number = _.reduce(exactOrdersExcludingQuantity, (sum: number, order: Order): number => {
      return sum + order.quantity;
    }, order.quantity);
    const newOrder = _.assign(_.cloneDeep(order), { quantity: totalExactOrderQuantity });
    const nonExactOrdersExcludingQuantity = _.filter(_.cloneDeep(currentOrders), (currentOrder: Order) => {
      const omitFields = ['quantity'];
      return !_.isEqual(_.omit(currentOrder, ['quantity']), _.omit(order, ['quantity']));
    });
    const updatedOrders = [...nonExactOrdersExcludingQuantity, newOrder];
    this.updateOrderFormByField('orders', updatedOrders);
  }

  removeFromCart(index: number): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    updatedOrders.splice(index, 1);
    this.updateOrderFormByField('orders', updatedOrders);
  }

  updateFromCart(order: Order, index: number): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    updatedOrders.splice(index, 1, order);
    this.updateOrderFormByField('orders', updatedOrders);
  }

  clearCart(): void {
    const updatedOrders = [];
    this.updateOrderFormByField('orders', updatedOrders);
  }
}