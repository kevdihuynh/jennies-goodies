import { Injectable } from '@angular/core';
import { CartItem } from 'src/app/interfaces/cart';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cart = new BehaviorSubject<CartItem[]>([]);
  private cartStore: CartItem[] = [];
  public cart: Observable<Array<CartItem>>  = this._cart.asObservable();

  constructor() { }

  addToCart(order: CartItem): void {
    this.cartStore.push(order);
    this._cart.next(this.cartStore);
  }
}
