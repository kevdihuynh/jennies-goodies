import { Component, OnInit, Input } from '@angular/core';
import { Option } from 'src/app/interfaces/products';
import { CartItem } from 'src/app/interfaces/cart-item';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() options: Option[];
  selectedOptionIndex = 0;
  selectedOption: any;
  cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  ngOnInit(): void {
    console.log(this.options);
    this.selectedOption = this.options[this.selectedOptionIndex];
  }

  updateSelectedOption(index: number): void {
    this.selectedOptionIndex = index;
    this.selectedOption = this.options[this.selectedOptionIndex];
  }

  addToCart(option: Option) {
    const cartItem: CartItem = {
      imageUrl: option.imageUrl,
      desc: option.desc,
      qty: option.qty,
      flavors: option.flavors,
      maxFlavors: option.maxFlavors,
      price: option.price,
      name: option.name,
      number: 1
    };

    this.cartService.addToCart(cartItem);
  }
}
