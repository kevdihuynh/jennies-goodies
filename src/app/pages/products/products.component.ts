import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from 'src/app/interfaces/products';
import { getResponse } from 'src/app/utils/utility-functions';
import productsJson from './../../db_mock/products.json';
import { GlobalConstants } from '../../utils/global-constants';
import { InputsConfig } from '../../interfaces/inputs-config';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  collection = 'products';
  public inputsConfig: InputsConfig = {
    string: ['slug', 'name'],
    number: [],
    url: [],
    quill: ['description'],
    date: [],
    boolean: ['publish'],
    disabled: ['slug']
  };
  products: Product[] = [];
  globalConstants = GlobalConstants;

  constructor(firestore: AngularFirestore) {
    const callback = () => firestore.collection('products').valueChanges();

    getResponse(callback, productsJson).subscribe((res) => {
      const products: Product[] = res as Product[];
      this.products = products;
      console.log(this.products);
    });
  }

  ngOnInit(): void {
  }
}
