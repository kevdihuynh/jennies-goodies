import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

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

  cart: any[] = [];

  total = 0;

  constructor() { }

  ngOnInit(): void {
  }

  addToCart(id: number, name: string, price: number, qty: number): void {
    const index = _.findIndex(this.cart, {id});
    if (index >= 0) {
      this.cart[index].qty += qty;
    } else {
      this.cart.push({
        id,
        name,
        qty,
        price,
      });
    }
    this.total += price;
    console.log(this.cart);
  }
}
