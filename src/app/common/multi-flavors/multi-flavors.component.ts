import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option, Product } from 'src/app/interfaces/products';
import * as _ from 'lodash';

@Component({
  selector: 'app-multi-flavors',
  templateUrl: './multi-flavors.component.html',
  styleUrls: ['./multi-flavors.component.scss']
})
export class MultiFlavorsComponent implements OnInit {

  @Input() product: Product;
  @Output() modifySelectedFlavors: EventEmitter<any> = new EventEmitter();
  @Input() inputEvents: EventEmitter<{ type: string, data: string }> = new EventEmitter();
  currentSelectedFlavors: Array<string> = [];
  selectedFillings: Array<string> = [];
  _ = _;
  selectedOptionIndex = 0;
  selectedOption: Option;
  objectKeys = Object.keys;

  constructor() {
  }

  ngOnInit(): void {
    this.selectedOption = _.get(this.product.variations, [this.selectedOptionIndex], undefined);
    this.inputEvents.subscribe((e: any) => {
      if (e && e.data === 'clear') {
        this.selectedFillings = [];
        this.currentSelectedFlavors = [];
      }
    });
    // const firstFlavor = _.get(this.objectKeys(this.product.multiFlavors), '[0]');
    // const firstFilling = _.get(this.product.multiFlavors, `[${firstFlavor}]`).values().next().value;
    // if (firstFlavor && firstFilling) {
    //   this.currentSelectedFlavors.push(firstFlavor);
    //   this.selectedFillings.push(firstFilling);
    //   this.modifySelectedFlavors.emit(this.currentSelectedFlavors[0] + ' with ' + this.selectedFillings[0]);
    // }
  }

  isActiveFlavor(flavor: string): boolean {
    return _.includes(this.currentSelectedFlavors, flavor);
  }

  toggleFlavor(flavor: string): void {
    this.selectedFillings = [];
    this.modifySelectedFlavors.emit(undefined);
    if (this.isActiveFlavor(flavor) && !this.product.allowMultiple) {
      _.remove(this.currentSelectedFlavors, (currentFlavor: string) => _.isEqual(currentFlavor, flavor));
      return;
    }
    if (this.isZeroRemainingFlavorsCount() && !this.product.allowMultiple) {
      this.currentSelectedFlavors.shift();
    }

    if ((this.product.allowMultiple && this.getRemainingSelectedCount() > 0) || !this.product.allowMultiple) {
      this.currentSelectedFlavors.push(flavor);
      // const filling = _.get(this.product.multiFlavors, `[${flavor}]`).values().next().value;
      // this.selectedFillings.push(filling);
      // this.modifySelectedFlavors.emit(this.currentSelectedFlavors[0] + ' with ' + this.selectedFillings[0]);
    }
  }

  isActiveFilling(filling: string): boolean {
    return _.includes(this.selectedFillings, filling);
  }

  toggleFilling(filling: string): void {
    if (this.isActiveFilling(filling) && !this.product.allowMultiple) {
      _.remove(this.selectedFillings, (currentFilling: string) => _.isEqual(currentFilling, filling));
      this.modifySelectedFlavors.emit(undefined);
      return;
    }
    if (this.isZeroRemainingFlavorsCount() && !this.product.allowMultiple) {
      this.selectedFillings.shift();
      this.modifySelectedFlavors.emit(undefined);
    }

    if (!this.product.allowMultiple) {
      this.selectedFillings.push(filling);
      const currentSelectedFlavor = _.get(this.currentSelectedFlavors, '[0]', undefined);
      const currentSelectedFilling = _.get(this.selectedFillings, '[0]', undefined);
      const currentSelectedOption = `${currentSelectedFlavor} with ${currentSelectedFilling}`;
      let chosenOption;
      this.product.flavors.map((flavor: string) => {
        const flavorNoSpace = flavor.replace(/\s/g,'').toLowerCase();
        const currentSelectedOptionNoSpace = currentSelectedOption.replace(/\s/g,'').toLowerCase();
        if (flavorNoSpace === currentSelectedOptionNoSpace) {
          chosenOption = flavor;
        }
      });
      this.modifySelectedFlavors.emit(chosenOption);
    }
  }

  isZeroRemainingFlavorsCount(): boolean {
    return _.isEqual(this.getRemainingFlavorsCount(), 0);
  }

  getRemainingFlavorsCount(): number {
    return _.get(this.selectedOption, 'maxFlavors', 0) - this.currentSelectedFlavors.length;
  }

  getRemainingSelectedCount(): number {
    return _.get(this.selectedOption, 'batchSize', 0) - this.currentSelectedFlavors.length;
  }

}
