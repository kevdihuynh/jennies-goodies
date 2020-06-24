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
    // custom adding quantity
    this.product.quantity = 1;

    this.selectedOption = this.product.variations[this.selectedOptionIndex];
  }

  updateSelectedOption(index: number): void {
    this.product.quantity = 1;
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

  isZeroRemainingFlavorsCount(): boolean {
    return _.isEqual(this.getRemainingFlavorsCount(), 0);
  }

  isSelectedFlavorsValid(): boolean {
    return this.selectedFlavors.length > 0;
  }

  toggleFlavor(flavor: string): void {
    if (this.isActiveFlavor(flavor)) {
      _.remove(this.selectedFlavors, (currentFlavor: string) => _.isEqual(currentFlavor, flavor));
      return;
    }
    if (this.isZeroRemainingFlavorsCount()) {
      this.selectedFlavors.shift();
    }
    this.selectedFlavors.push(flavor);
  }

  addToCart(product: Product): void {
    // Prevents updating all references
    const copySelectedOptions = _.cloneDeep(this.selectedOption);
    const copySelectedFlavors = _.cloneDeep(this.selectedFlavors);

    const order: Order = {
      imageUrls: product.imageUrls,
      description: product.description,
      batchSize: copySelectedOptions.batchSize,
      selectedFlavors: copySelectedFlavors,
      price: copySelectedOptions.price,
      name: product.name,
      quantity: product.quantity
    };
    this.cartService.addToCart(order);
    this.toastr.info(`${order.quantity} ${order.name} (${_.toString(order.selectedFlavors)})`, 'Added to Cart', {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false,
      timeOut: 2000
    });
  }
}
