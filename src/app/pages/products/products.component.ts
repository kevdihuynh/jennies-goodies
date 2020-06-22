import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Products } from 'src/app/interfaces/products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
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

  constructor(firestore: AngularFirestore) {
    firestore.collection('products').valueChanges().subscribe((res) => {
      const products: Products[] = res as Products[];
      this.products = products;
    });
  }

  ngOnInit(): void {
  }
}
