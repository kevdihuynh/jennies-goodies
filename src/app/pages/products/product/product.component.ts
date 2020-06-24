import { Component, OnInit, Input } from '@angular/core';
import { Option, Product } from 'src/app/interfaces/products';
import { Order } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'q';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  selectedOptionIndex = 0;
  selectedOption: any;

  constructor(
    public cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.product);
    this.selectedOption = this.product.variations[this.selectedOptionIndex];
  }

  updateSelectedOption(index: number): void {
    this.selectedOptionIndex = index;
    this.selectedOption = this.product.variations[this.selectedOptionIndex];
  }

  addToCart(product: Product) {
    const order: Order = {
      imageUrls: product.imageUrls,
      description: product.description,
      batchSize: this.selectedOption.batchSize,
      flavors: product.flavors,
      maxFlavors: this.selectedOption.maxFlavors,
      price: this.selectedOption.price,
      name: product.name,
      quantity: 1
    };
    this.cartService.addToCart(order);
    this.toastr.info('', `${order.batchSize} pieces of ${order.name} added`, {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false
    });
  }
}
