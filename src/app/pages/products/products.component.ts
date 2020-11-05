import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from 'src/app/interfaces/products';
import { getResponse } from 'src/app/utils/utility-functions';
import productsJson from './../../db_mock/products.json';
import { GlobalConstants } from '../../utils/global-constants';
import { InputsConfig } from '../../interfaces/inputs-config';
import * as _ from 'lodash';

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
      const formattedProducts: Product[] = [];
      products.map((product) => {
        const currentProduct = _.cloneDeep(product);
        const productName = currentProduct && currentProduct.name;
        const productId = productName.toLocaleLowerCase().replace(/ /g, '');
        currentProduct.productId = productId;
        formattedProducts.push(currentProduct);
      });
      this.products = _.sortBy(formattedProducts, ['rank']);
      console.log(this.products);
    });
  }

  scroll(product: Product): void {
    const elementToScrollTo = document.getElementById(product.productId);
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView();
    }
  }

  ngOnInit(): void {
  }
}
