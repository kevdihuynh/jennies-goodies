import { Component, OnInit, Input } from '@angular/core';
import { Option } from 'src/app/interfaces/products';
import { Order } from 'src/app/interfaces/orders';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() options: Option[];
  selectedOptionIndex = 0;
  selectedOption: any;
  orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  ngOnInit(): void {
    console.log(this.options);
    this.selectedOption = this.options[this.selectedOptionIndex];
  }

  updateSelectedOption(index: number): void {
    this.selectedOptionIndex = index;
    this.selectedOption = this.options[this.selectedOptionIndex];
  }

  addToOrders(option: Option) {
    const order: Order = {
      imageUrl: option.imageUrl,
      desc: option.desc,
      qty: option.qty,
      flavors: option.flavors,
      maxFlavors: option.maxFlavors,
      price: option.price,
      name: option.name,
      number: 1
    };

    this.orderService.addToOrders(order);
  }
}
