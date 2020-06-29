import { Component, OnInit, Input } from '@angular/core';
import { Option, Product } from 'src/app/interfaces/products';
import { Order } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { InputsConfig } from '../../../interfaces/inputs-config';

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
  public inputsConfig: InputsConfig = {
    string: ['slug', 'name'],
    number: [],
    url: [],
    quill: ['description'],
    date: [],
    boolean: ['publish'],
    disabled: ['slug']
  };

  constructor(
    public cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // custom adding quantity
    this.product.quantity = 1;

    this.selectedOption = _.get(this.product.variations, [this.selectedOptionIndex], undefined);
  }

  updateSelectedOption(index: number): void {
    this.product.quantity = 1;
    this.selectedFlavors = [];
    this.selectedOptionIndex = index;
    this.selectedOption = this.product.variations[this.selectedOptionIndex];
  }

  getRemainingFlavorsCount(): number {
    return _.get(this.selectedOption, 'maxFlavors', 0) - this.selectedFlavors.length;
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

  isCartValid(): boolean {
    return (this.isZeroRemainingFlavorsCount() || this.isSelectedFlavorsValid()) && (this.product.quantity > 0);
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
    const copySelectedFlavors = _.cloneDeep(_.sortBy(this.selectedFlavors));

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
    this.toastr.info(`${order.quantity} ${order.name} (${_.join(order.selectedFlavors, ', ')}) - ${order.batchSize} for $${order.price}`, 'Added to Cart', {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false,
      timeOut: 2000
    });
  }
}
