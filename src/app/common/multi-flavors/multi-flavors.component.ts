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
  currentSelectedFlavors: Array<string> = [];
  selectedFillings: Array<string> = [];
  _ = _;
  selectedOptionIndex = 0;
  selectedOption: Option;
  objectKeys = Object.keys;

  constructor() { }

  ngOnInit(): void {
    console.log('multi::', this.product.multiFlavors);
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
    }
    console.log('toggle::', flavor);
  }

  isActiveFilling(flavor: string): boolean {
    return _.includes(this.selectedFillings, flavor);
  }

  toggleFilling(flavor: string): void {
    if (this.isActiveFilling(flavor) && !this.product.allowMultiple) {
      _.remove(this.selectedFillings, (currentFlavor: string) => _.isEqual(currentFlavor, flavor));
      this.modifySelectedFlavors.emit(undefined);
      return;
    }
    if (this.isZeroRemainingFlavorsCount() && !this.product.allowMultiple) {
      this.selectedFillings.shift();
      this.modifySelectedFlavors.emit(undefined);
    }

    if (!this.product.allowMultiple) {
      this.selectedFillings.push(flavor);
      this.modifySelectedFlavors.emit(this.currentSelectedFlavors[0] + ' with ' + this.selectedFillings[0]);
    }
    console.log('toggle::', flavor);
  }

  isZeroRemainingFlavorsCount(): boolean {
    return _.isEqual(this.getRemainingFlavorsCount(), 0);
  }

  getRemainingFlavorsCount(): number {
    return 0; // _.get(this.selectedOption, 'maxFlavors', 0) - this.currentSelectedFlavors.length;
  }

  getRemainingSelectedCount(): number {
    return _.get(this.selectedOption, 'batchSize', 0) - this.currentSelectedFlavors.length;
  }

}
