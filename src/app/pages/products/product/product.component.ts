import { Component, OnInit, Input } from '@angular/core';
import { Option, Product } from 'src/app/interfaces/products';
import { Order } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  _ = _;
  selectedOptionIndex = 0;
  selectedOption: Option;
  selectedFlavors: Array<string> = [];

  constructor(
    public cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.product);
    this.selectedOption = this.product.variations[this.selectedOptionIndex];
  }

  updateSelectedOption(index: number): void {
    this.selectedFlavors = [];
    this.selectedOptionIndex = index;
    this.selectedOption = this.product.variations[this.selectedOptionIndex];
  }

  getRemainingFlavorsCount(): number {
    return this.selectedOption.maxFlavors - this.selectedFlavors.length;
  }

  isActiveFlavor(flavor: string): boolean {
    return _.includes(this.selectedFlavors, flavor);
  }

  toggleFlavor(flavor: string): void {
    if (this.isActiveFlavor(flavor)) {
      return;
    }
    if (this.getRemainingFlavorsCount() === 0) {
      this.selectedFlavors.shift();
    }
    this.selectedFlavors.push(flavor);
  }

  addToCart(product: Product) {
    const order: Order = {
      imageUrls: product.imageUrls,
      description: product.description,
      batchSize: this.selectedOption.batchSize,
      selectedFlavors: this.selectedFlavors,
      price: this.selectedOption.price,
      name: product.name,
      quantity: 1
    };
    this.cartService.addToCart(order);
    this.toastr.info('', `${order.batchSize} pieces of ${order.name} (${_.toString(this.selectedFlavors)}) added`, {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false
    });
  }
}
