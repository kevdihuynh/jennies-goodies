import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Option, Product } from 'src/app/interfaces/products';
import { Order, OrderForm } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { InputsConfig } from '../../../interfaces/inputs-config';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ NgbCarouselConfig ]
})
export class ProductComponent implements OnInit {
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  interval = 0;
  showNavigationArrows = false;
  showNavigationIndicators = false;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

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
  orderForm: OrderForm;

  constructor(
    public cartService: CartService,
    private toastr: ToastrService
  ) {
    this.cartService.orderForm.subscribe((orderForm: OrderForm) => {
      this.orderForm = orderForm;
    });
  }

  ngOnInit(): void {
    // custom adding quantity
    this.product.quantity = 1;

    this.selectedOption = _.get(this.product.variations, [this.selectedOptionIndex], undefined);
    if (_.get(this.product, 'imageUrls', []).length > 1) {
      this.showNavigationArrows = true;
      this.showNavigationIndicators = true;
    }
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
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

  getRemainingSelectedCount(): number {
    return _.get(this.selectedOption, 'batchSize', 0) - this.selectedFlavors.length;
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
    return ((this.product.allowMultiple && this.getRemainingSelectedCount() === 0) || (!this.product.allowMultiple && (this.isZeroRemainingFlavorsCount() || this.isSelectedFlavorsValid()) && (this.product.quantity > 0))) || _.isEmpty(this.product.flavors);
  }

  toggleFlavor(flavor: string): void {
    if (this.isActiveFlavor(flavor) && !this.product.allowMultiple) {
      _.remove(this.selectedFlavors, (currentFlavor: string) => _.isEqual(currentFlavor, flavor));
      return;
    }
    if (this.isZeroRemainingFlavorsCount() && !this.product.allowMultiple) {
      this.selectedFlavors.shift();
    }

    if ((this.product.allowMultiple && this.getRemainingSelectedCount() > 0) || !this.product.allowMultiple) {
      this.selectedFlavors.push(flavor);
    }
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
      quantity: product.quantity,
      allowMultiple: product.allowMultiple,
      rank: product.rank
    };
    this.cartService.addToCart(order);
    this.toastr.info(`${order.quantity} x ${order.name}`, 'Added to Cart', {
      positionClass: 'toast-top-left',
      progressBar: true,
      disableTimeOut: false,
      timeOut: 2000
    });
    this.selectedFlavors = [];
    product.quantity = 1;
  }
}
