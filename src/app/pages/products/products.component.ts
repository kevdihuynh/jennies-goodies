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
  public collection = 'products';
  public inputsConfig: InputsConfig = {
    string: ['slug', 'name'],
    number: [],
    url: [],
    quill: ['description'],
    date: [],
    boolean: ['publish'],
    disabled: ['slug']
  };
  public products: Product[] = [];
  public globalConstants = GlobalConstants;
  public banner: string;
  public _ = _;

  constructor(firestore: AngularFirestore) {
    firestore.collection('settings').doc('banner').valueChanges().subscribe((banner) => {
      this.banner = _.get(banner, ['message']);
    });

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
      this.products = _.filter(_.sortBy(formattedProducts, ['rank']), ['visible', true]);
    });
  }

  scroll(product: Product): void {
    const elementToScrollTo = document.getElementById(product.productId);
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ngOnInit(): void {
  }
}
