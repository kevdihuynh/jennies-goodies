import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderForm, Order } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { CartModalComponent } from './cart-modal/cart-modal.component';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss']
})
export class CartButtonComponent implements OnInit {
  _ = _;
  orderForm: OrderForm;

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    public cartService: CartService
  ) {
    this.config.backdrop = 'static';
    this.config.keyboard = false;
    this.config.windowClass = 'modal-100';
  }

  ngOnInit(): void {
    this.cartService.orderForm.subscribe((orderForm: OrderForm) => {
      this.orderForm = orderForm;
      console.log(this.orderForm);
    });
  }

  openCartModal(): void {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'modal-100'
    }
    const modalRef = this.modalService.open(CartModalComponent, modalOptions);
    modalRef.result.then((closeReason?: string) => {
      switch (closeReason) {
        case 'payment-success':
          console.log('payment-success');
      }
    }, (dismissReason?) => {});
  }
}
