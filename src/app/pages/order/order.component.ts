import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Products } from 'src/app/interfaces/products';
import { CartItem } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  products: Products[] = [];

  items: any[] = [
    {
      id: 1,
      name: 'Ube Cookies',
      desc: 'vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
      price: 10,
      qty: 10,
      priceText: 'for 10',
      url: '../../assets/images/ube_cookies.jpg',
    },
    {
      id: 2,
      name: 'Ube Cupcakes',
      desc: 'vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
      price: 10,
      qty: 10,
      priceText: 'for 10',
      url: '../../assets/images/cupcakes_ube.jpg',
    },
    {
      id: 3,
      name: 'Pandesal (Pandan)',
      desc: 'vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
      price: 10,
      qty: 10,
      priceText: 'for 10',
      url: '../../assets/images/pandesal_pandan.jpg',
    },
    {
      id: 4,
      name: 'Pandesal (Ube)',
      desc: 'vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
      price: 10,
      qty: 10,
      priceText: 'for 10',
      url: '../../assets/images/pandesal_ube.jpg',
    }
  ];

  cart: CartItem[] = [];
  cartService: CartService;
  totalPrice: number;

  constructor(firestore: AngularFirestore, cartService: CartService) {
    firestore.collection('products').valueChanges().subscribe((res) => {
      const products: Products[] = res as Products[];
      this.products = products;
    });
    this.cartService = cartService;
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe((res) => {
      this.cart = res;
      this.totalPrice = this.calcTotal(this.cart);
    });
  }

  calcTotal(cart: CartItem[]): number {
    let total = 0;
    cart.map((cartItem: CartItem) => {
      total += cartItem.price;
    });
    return total;
  }
}
