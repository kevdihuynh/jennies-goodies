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
      totalOrdersQuantity: 0,
      deliveryFee: undefined,
      total: 0,
      grandTotal: 0
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

  getOrdersQuantity(orders: Order[]): number {
    return _.reduce(orders, (sum: number, order: Order): number => {
      return sum + order.quantity
    }, 0);
  }

  getTotal(orders: Order[]): number {
    return _.reduce(orders, (sum: number, order: Order): number => {
      return sum + (order.quantity * order.price);
    }, 0);
  };

  getGrandTotal(orders: Order[], deliveryFee?: number | undefined): number {
    return this.getTotal(orders) + (deliveryFee || 0);
  }

  updateOrderFormByFields(updatedFields: object): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrderForm = _.assign(currentOrderForm, updatedFields);
    console.log(updatedOrderForm);
    this.orderFormSubject.next(updatedOrderForm);
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
    this.updateOrderFormByFields({
      orders: updatedOrders,
      totalOrdersQuantity: this.getOrdersQuantity(updatedOrders),
      total: this.getTotal(updatedOrders),
      grandTotal: this.getGrandTotal(updatedOrders, currentOrderForm.deliveryFee)
    });
  }

  removeFromCart(index: number): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    updatedOrders.splice(index, 1);
    this.updateOrderFormByFields({
      orders: updatedOrders,
      totalOrdersQuantity: this.getOrdersQuantity(updatedOrders),
      total: this.getTotal(updatedOrders),
      grandTotal: this.getGrandTotal(updatedOrders, currentOrderForm.deliveryFee)
    });
  }

  updateFromCart(order: Order, index: number): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    updatedOrders.splice(index, 1, order);
    this.updateOrderFormByFields({
      orders: updatedOrders,
      totalOrdersQuantity: this.getOrdersQuantity(updatedOrders),
      total: this.getTotal(updatedOrders),
      grandTotal: this.getGrandTotal(updatedOrders, currentOrderForm.deliveryFee)
    });
  }

  clearCart(): void {
    this.updateOrderFormByFields({
      orders: [],
      totalOrdersQuantity: 0,
      total: 0,
      grandTotal: 0
    });
  }
}