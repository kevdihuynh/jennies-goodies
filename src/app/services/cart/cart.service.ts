import { Injectable } from '@angular/core';
import { Order, OrderForm } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GlobalConstants } from '../../utils/global-constants';
import { AngularFirestore } from '@angular/fire/firestore';

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
      date: { year: moment().add(1, 'day').year(), month: moment().add(1, 'day').month() + 1, day: moment().add(1, 'day').date() }, // 1 day ahead
      // time: { hour: 17, minute: 0, second: 0 }, // TODO: Remove ngb time picker references as we are no longer using it
      orders: [],
      totalOrdersQuantity: 0,
      deliveryDistance: 0,
      deliveryFee: 0,
      total: 0,
      grandTotal: 0,
      selectedDateTime: null,
      confirmedAddress: null,
      discount: null
    }
  );
  public orderForm: Observable<OrderForm>  = this.orderFormSubject.asObservable();
  private discounts: any;

  constructor(
    private firestore: AngularFirestore) {
    firestore.collection('settings').doc('discounts').valueChanges().subscribe((discounts: object) => {
      const discountDict: object = {};
      _.forEach(discounts, (value: object, key: string) => {
        discountDict[key] = _.assign(value, {code: key});
      });
      this.discounts = discountDict;
    });
  };

  isProductFoundForDiscount(orderName: string, discount: any = undefined): boolean {
    const isAllDiscount: boolean = _.isEqual(_.toUpper(_.get(discount, ['type'])), 'EVERYTHING');
    return _.isEqual(_.toLower(orderName), _.toLower(_.get(discount, ['type']))) || isAllDiscount;
  };

  validateDiscount(inputDiscount: string): any {
    const discount = _.find(this.discounts, (value: object) => {
      return _.isEqual(_.get(value, ['code']), _.toUpper(inputDiscount));
    });
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    this.updateOrderFormByFields({
      discount,
      total: this.getTotal(updatedOrders, discount),
      grandTotal: this.getGrandTotal(updatedOrders, discount, currentOrderForm.deliveryFee)
    });
  };

  getSavings(): number {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    return _.round(this.getGrandTotal(currentOrderForm.orders) - currentOrderForm.grandTotal, 2);
  };

  getOrdersQuantity(orders: Order[]): number {
    return _.reduce(orders, (sum: number, order: Order): number => {
      return sum + order.quantity
    }, 0);
  }

  getItemTotal(orderName: string, orderPrice: number, discount: any = undefined): number {
    let price: number = orderPrice;
    if (this.isProductFoundForDiscount(orderName, discount)) {
      price -= (price * (_.get(discount, ['percent'], 0) / 100));
    }
    return _.round(price, 2);
  }

  getItemsTotal(orderName: string, orderPrice: number, orderQuantity: number, discount: any = undefined): number {
    let total: number = (orderPrice * orderQuantity);
    if (this.isProductFoundForDiscount(orderName, discount)) {
      total -= (total * (_.get(discount, ['percent'], 0) / 100));
    }
    return _.round(total, 2);
  };

  getTotal(orders: Order[], discount: any = undefined): number {
    return _.round(_.reduce(orders, (sum: number, order: Order): number => {
      return sum + this.getItemsTotal(_.get(order, ['name']), _.get(order, ['price'], 0), _.get(order, ['quantity'], 0), discount);
    }, 0), 2);
  };

  getGrandTotal(orders: Order[], discount: any = undefined, deliveryFee: number = 0): number {
    return _.round(this.getTotal(orders, discount) + deliveryFee, 2);
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
      total: this.getTotal(updatedOrders, _.get(currentOrderForm, ['discount'])),
      grandTotal: this.getGrandTotal(updatedOrders, _.get(currentOrderForm, ['discount']), currentOrderForm.deliveryFee)
    });
  }

  removeFromCart(index: number): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    updatedOrders.splice(index, 1);
    this.updateOrderFormByFields({
      orders: updatedOrders,
      totalOrdersQuantity: this.getOrdersQuantity(updatedOrders),
      total: this.getTotal(updatedOrders, _.get(currentOrderForm, ['discount'])),
      grandTotal: this.getGrandTotal(updatedOrders, _.get(currentOrderForm, ['discount']), currentOrderForm.deliveryFee)
    });
  }

  updateFromCart(order: Order, index: number): void {
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    const updatedOrders = _.cloneDeep(currentOrderForm.orders);
    updatedOrders.splice(index, 1, order);
    this.updateOrderFormByFields({
      orders: updatedOrders,
      totalOrdersQuantity: this.getOrdersQuantity(updatedOrders),
      total: this.getTotal(updatedOrders, _.get(currentOrderForm, ['discount'])),
      grandTotal: this.getGrandTotal(updatedOrders, _.get(currentOrderForm, ['discount']), currentOrderForm.deliveryFee)
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
    const currentOrderForm = _.cloneDeep(this.orderFormSubject.getValue());
    let text: string = `${_.isNil(_.get(order, ['quantity'])) ? 0 : _.get(order, ['quantity'],0 )} x ${_.get(order, ['name'], 'N/A')} (${_.get(order, ['batchSize'], 0)} For $${this.getItemTotal(_.get(order, ['name']), _.get(order, ['price'], 0), _.get(currentOrderForm, ['discount']))}) `;
    text += `= ${totalPieces} Total Piece${totalPieces > 1 ? 's' : ''}`;
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