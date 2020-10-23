import { Injectable } from '@angular/core';
import { Order, OrderForm } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GlobalConstants } from '../../utils/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orderFormSubject = new BehaviorSubject<OrderForm>(
    {
      name: '', // 'John Doe',
      email: '', // 'johndoe@example.com',
      phoneNumber: '', // '2067650458',
      isDelivery: false,
      address: GlobalConstants.company.address,
      addressComponent: null,
      notes: '', // 'John Doe will pick it up for me',
      date: { year: moment().add(2, 'day').year(), month: moment().add(2, 'day').month() + 1, day: moment().add(2, 'day').date() },
      // time: { hour: 17, minute: 0, second: 0 }, // TODO: Remove ngb time picker references as we are no longer using it
      orders: [],
      totalOrdersQuantity: 0,
      deliveryDistance: 0,
      deliveryFee: 0,
      total: 0,
      grandTotal: 0,
      selectedDateTime: null,
      confirmedAddress: null,
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

  getGrandTotal(orders: Order[], deliveryFee: number): number {
    return this.getTotal(orders) + deliveryFee;
  }

  updateOrderFormByFields(updatedFields: object): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrderForm = _.assign(currentOrderForm, updatedFields);
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

  displayFriendlyItemText(order: Order): string {
    const selectedFlavors: string[] = _.get(order, ['selectedFlavors'], []);
    const isSelectedFlavorsEmpty: boolean = _.isEmpty(selectedFlavors);
    const totalPieces: number = order.batchSize * order.quantity;
    let text: string = `${_.isNil(_.get(order, ['quantity'])) ? 0 : _.get(order, ['quantity'],0 )} x ${_.get(order, ['name'], 'N/A')} (${_.get(order, ['batchSize'], 0)} For $${_.get(order, ['price'], 0)}) `;
    text += `= ${totalPieces} Total Pieces`;
    if (!isSelectedFlavorsEmpty) {
        const selectedFlavorsDict: object = {};
        _.forEach(selectedFlavors, (selectedFlavor: string) => {
          _.set(selectedFlavorsDict, selectedFlavor, _.get(selectedFlavorsDict, [selectedFlavor], 0) + 1);
        });
        const selectedFlavorsFlatten: string[] = _.map(selectedFlavorsDict, (value: number, key: string) => {
          const numPieces: number = order.allowMultiple ? (value * order.quantity) : (totalPieces / selectedFlavors.length);
          return `${numPieces} ${key}`;
        });
        const displaySelectedFlavors: string = _.join(selectedFlavorsFlatten, ', ');
        text += ` (${displaySelectedFlavors})`;
    }
    return text;
  }

}