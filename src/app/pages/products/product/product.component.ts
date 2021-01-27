import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';
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
  toggleCalEvent: EventEmitter<{ type: string, data: string }> = new EventEmitter();

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
    const hasFilling = _.get(this.product, 'allowMultiFlavor', false) && this.hasFilling(this.product.flavors);
    this.product.hasFilling = hasFilling;
    if (this.product.hasFilling) {
      this.product.multiFlavors = this.transformToFillings(this.product.flavors);
    }
    this.selectedOption = _.get(this.product.variations, [this.selectedOptionIndex], undefined);
    if (_.get(this.product, 'imageUrls', []).length > 1) {
      this.showNavigationArrows = true;
      this.showNavigationIndicators = true;
    }
  }

  openCal() {
    this.toggleCalEvent.next({ type: 'action', data: 'clear' });
  }

  modifySelectedFlavors(selected: string){
    if (selected) {
      this.selectedFlavors.push(selected);
    } else {
      this.selectedFlavors.shift();
    }
  }

  transformToFillings(options) {
    const transformMap = {};
    function trimSides(x) {
      return x.replace(/^\s+|\s+$/gm,'');
    }
    options.map((option) => {
      const splitOption = option.split('with');
      const flavor = trimSides(splitOption[0]);
      const filling = trimSides(splitOption[1]);
      if (!transformMap[flavor]) {
        transformMap[flavor] = new Set([filling]);
      } else {
        transformMap[flavor].add(filling);
      }
    });
    return transformMap;
  }

  hasFilling(flavors) {
    let hasFilling = false;
    flavors.map((flavor) => {
      if (flavor.toLowerCase().indexOf('with') >= 0) {
        hasFilling = true;
      }
    });
    return hasFilling;
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
    this.openCal();
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
    this.toastr.info(
      _.sample([
        `Perfect choice!`,
        `A great snack!`,
        `Great for your tummy`,
        `Your taste buds will thank you!`,
        `Your stomach will love you!`,
        `Yummy in my tummy!`,
        `You will fall in love!`,
        `You are the best!`,
        `You are the chosen one!`,
        `Made with perfection!`,
        `Made just for you!`,
        `Made with love!`,
        `Made with passion!`,
        `We are so glad!`,
        `You make us happy!`,
        `Satisfaction guaranteed!`,
        `Tasty goodness!`,
        `Homemade just for you!`,
        `You will be grateful!`,
        `A fan favorite!`,
        `Well chosen!`,
        `Excellent choice!`,
        `Nice choice!`,
        `Great pick!`,
        `Good decision!`,
        `Good choice!`,
        `Well chosen!`,
        `Fabulous choice!`,
        `Wonderful decision!`,
        `Awesome choice!`,
        `Great selection!`,
        `You were born for this!`,
        `A popular choice!`,
        `You will like it!`,
        `A match made in heaven!`,
        `You were born to try it!`,
        `One of our favorites!`,
        `You are going to love it!`,
        `You have good taste!`,
        `Can't go wrong with that!`,
        `You won't regret it!`,
        `You will be satisfied!`,
        `It's delicious!`,
        `You know what's good!`,
        `It's tasty!`,
        `It's yummy!`,
        `It's delish!`,
        `There you go!`,
        `Share with others!`,
        `It's mouth-watering!`,
        `You made the right move!`,
        `You already know it!`,
        `Are you ready for this!`,
        `We're excited for you!`,
        `You make us happy!`,
        `We'll do our best!`,
        `This means a lot to us!`,
        `Thanks for your support!`,
        `Can't wait for you to try!`,
        `Love at first bite!`,
        `Mmm... Yummy!`,
        `You got them goodies!`,
        `They're great!`,
        `You got it!`,
        `Got them goodies!`,
        `Oh yum!`,
        `Oh yeah!`,
        `Yessir!`,
        `Can't thank you enough!`
      ]),
      `${order.name} added to cart`, {
      positionClass: 'toast-top-left',
      progressBar: true,
      disableTimeOut: false,
      timeOut: 2000
    });
    this.selectedFlavors = [];
    product.quantity = 1;
    this.openCal();
  }
}
