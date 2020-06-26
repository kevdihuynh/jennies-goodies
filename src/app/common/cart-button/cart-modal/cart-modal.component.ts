import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderForm, Order } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../../utils/global-constants';
import { FormControl } from 'src/app/interfaces/formControl';
import { GooglePlacesService } from 'src/app/services/google-places/google-places.service';
import { v4 as uuidv4 } from 'uuid';
import calendarResponse from './../../../db_mock/calendar_response.json';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit {
  _ = _;
  globalConstants = GlobalConstants;
  DEFAULT_PICKUP_ADDRESS: string = this.globalConstants.company.address;
  formControls: FormControl = {
    dateTimePicker: {},
    deliveryForm: {}
  };
  isDeliveryInvalid = true;
  orderForm: OrderForm;
  orders: Order[] = [];
  grandTotal: number;
  currentSessionToken: string | undefined = undefined;
  timeStart: number | undefined = undefined;
  keyword = 'name';
  predictedAddresses = [
    //  {
    //    id: 1,
    //    name: 'Usa'
    //  },
    //  {
    //    id: 2,
    //    name: 'England'
    //  }
  ];
  dateTimeOptions: any = calendarResponse;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    public cartService: CartService,
    public googleMapsService: GoogleMapsService,
    public googlePlacesService: GooglePlacesService) {
    // If weekend, set default start time to 9am
    if (this.isClosedDays()) {
      this.orderForm.time = { hour: 9, minute: 0, second: 0 };
    }
  }

  ngOnInit(): void {
    this.isDeliveryInvalid = true;
    this.cartService.orderForm.subscribe((orderForm: OrderForm) => {
      this.orderForm = orderForm;
      this.grandTotal = _.reduce(this.orderForm.orders, (sum: number, order: Order): number => {
        return sum + (order.quantity * order.price);
      }, 0);
      // Add delivery fee to item_total
      this.grandTotal += (this.orderForm.deliveryFee || 0);
    });
  }

  async selectEvent(item) {
    // do something with selected item
    this.generateNewSessionToken();
    // reset when place is selected
    this.currentSessionToken = undefined;
    this.timeStart = undefined;
    console.log('selectEvent: ', item.name);
    this.orderForm.address = item.name;
    const deliveryFee = await this.calculateDeliveryFee();
    this.isDeliveryInvalid = this.isDeliveryFormInvalid();
    this.orderForm.deliveryFee = deliveryFee;
  }

  async onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log('onChangeSearch: ', val);
    // generate the session token to allow for proper billing
    this.orderForm.address = val;
    this.generateNewSessionToken();
    const predictedAddresses = await this.googlePlacesService.predictAddresses(val, this.currentSessionToken);
    this.predictedAddresses = [];
    if (predictedAddresses) {
      predictedAddresses.map((address, index) => {
        this.predictedAddresses.push({
          id: index,
          name: address.description
        });
      });
    }
  }

  onFocused(e){
    // do something when input is focused
    console.log('onFocused: ', e);
  }

  generateNewSessionToken() {
    if (this.timeStart === undefined) {
      this.timeStart = performance.now();
    }
    const timeElapsed = this.timeElapsed();
    if ((timeElapsed >= 5 && this.currentSessionToken) || this.currentSessionToken === undefined) {
      // generate new session token if more than 5 seconds elapsed
      // or session token not set yet
      this.currentSessionToken = uuidv4();
    }
    this.timeStart = performance.now();
  }

  timeElapsed() {
    const endTime = performance.now();
    let  timeDiff = endTime - this.timeStart; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    const seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
    return seconds;
  }

  closeCartModal(reason?: any): void {
    this.activeModal.close(reason);
  }

  dismissCartModal(reason?: string): void {
    this.activeModal.dismiss(reason);
  }

  updateFromCart(order: Order, index: number): void {
    this.cartService.updateFromCart(order, index);
  }

  removeFromCart(order: Order, index: number): void {
    this.toastr.info(`${order.quantity} ${order.name} (${_.join(order.selectedFlavors, ', ')}) - ${order.batchSize} for $${order.price}`, 'Removed from Cart', {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false,
      timeOut: 2000
    });
    this.cartService.removeFromCart(index);
  }

  isClosedDays() {
    if (!_.get(this.orderForm, 'date')) {
      return false;
    }
    const dateTime = this.getMomentDate();
    const isClosedDays = _.includes(['Friday', 'Saturday', 'Sunday'], dateTime.format('dddd'));
    return isClosedDays;
  }

  getMomentDate() {
    if (_.isNil(_.get(this.orderForm, 'date'))) {
      return null;
    }
    const date = this.orderForm.date;
    return moment(`${date.year}-${date.month}-${date.day}`);
  }

  getMomentDateTime() {
    if (_.isNil(_.get(this.orderForm, 'date')) || _.isNil(_.get(this.orderForm, 'time'))) {
      return null;
    }
    const date = this.orderForm.date;
    const time = this.orderForm.time;
    return moment(`${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:${time.second}`);
  }

  getDateTimeText() {
    if (_.isNil(_.get(this.orderForm, 'date')) || _.isNil(_.get(this.orderForm, 'time'))) {
      return 'Date & Time';
    }
    return this.getMomentDate().format('LLL');
  }

  isDateTimePickerInValid(): boolean {
    const date = _.get(this.orderForm, 'date');
    const time = _.get(this.orderForm, 'time');
    this.formControls.dateTimePicker = {};
    if (!_.isObject(date) || !_.isObject(time)) {
      return true;
    };

    let minTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
    let maxTime: NgbTimeStruct = { hour: 21, minute: 0, second: 0 };

    if (!this.isClosedDays()) {
      minTime = { hour: 17, minute: 0, second: 0 };
    }

    if (time.hour < minTime.hour) {
      this.formControls.dateTimePicker.tooEarly = true;
      return true;
    }

    if ((time.hour > maxTime.hour) || (_.isEqual(time.hour, maxTime.hour) && (time.minute > maxTime.minute))) {
      this.formControls.dateTimePicker.tooLate = true;
      return true;
    }

    return false;
  }

  isDeliveryFormInvalid(): boolean {
    return (
      this.formControls.deliveryForm.addressError ||
      this.formControls.deliveryForm.calcDistanceError ||
      this.formControls.deliveryForm.tooFarError
    );
  }

  isDeliveryAndDateInvalid(): boolean {
    // Validate if date and time are invalid
    if (this.isDateTimePickerInValid()) {
      return true;
    }

    // Validate if delivery is valid
    if (this.isDeliveryFormInvalid()) {
      return true;
    }

    return false;
  }

  isOrderFormDisabled(): boolean {
    // Validate if name is unset
    if (_.isEmpty(_.get(this.orderForm, 'name'))) {
      return true;
    };

    // Validate if email is unset
    if (_.isEmpty(_.get(this.orderForm, 'email'))) {
      return true;
    };

    // Validate if phoneNumber is unset
    if (_.isEmpty(_.get(this.orderForm, 'phoneNumber'))) {
      return true;
    };

    // Validate if isDelivery is unset
    if (_.isNil(_.get(this.orderForm, 'isDelivery'))) {
      return true;
    };

    // Validate if date is non-object
    if (!_.isObject(_.get(this.orderForm, 'date'))) {
      return true;
    }

    // Validate if Address is unset only if isDelivery is set
    if (_.isEmpty(_.get(this.orderForm, 'address')) && !_.isNil(_.get(this.orderForm, 'isDelivery')) && _.get(this.orderForm, 'isDelivery')) {
      return true;
    };

    // Validate if there is at least one item in order
    if (this.orderForm.orders.length < 1) {
      return true;
    }

    // All form validations passed. The Order Form is validated
    return false;
  };

  async calculateDeliveryFee(): Promise<number>  {
    let deliveryFee = 0;
    this.formControls.deliveryForm = {};
    if (this.orderForm.address) {
      // confirm user address is valid and retrieve lat and lon coordinates
      const geoCode = await this.googleMapsService.getGeoCode(this.orderForm.address);
      this.orderForm.addressComponent = this.googleMapsService.getFormattedAddressComponent(_.get(geoCode, ['address_components'], []));
      const lat = _.get(geoCode, 'geometry.location.lat');
      const lon = _.get(geoCode, 'geometry.location.lng');
      if (lat !== undefined && lon !== undefined) {
        // calculate the distance
        const milesToDestination = await this.googleMapsService.getDistance(lat, lon);
        console.log('miles to destination: ', milesToDestination);
        if (milesToDestination !== undefined) {
          if (milesToDestination > 10 && milesToDestination <= 15) {
            deliveryFee = 5;
          } else {
            this.formControls.deliveryForm.tooFarError = true;
            this.toastr.error(GlobalConstants.errors.deliveryErrors.tooFarError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
              positionClass: 'toast-bottom-left',
              progressBar: true,
              disableTimeOut: false
            });
          }
        } else {
          this.formControls.deliveryForm.calcDistanceError = true;
          this.toastr.error(GlobalConstants.errors.deliveryErrors.calcDistanceError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
            positionClass: 'toast-bottom-left',
            progressBar: true,
            disableTimeOut: false
          });
        }
      } else {
        this.formControls.deliveryForm.addressError = true;
        this.toastr.error(GlobalConstants.errors.deliveryErrors.addressError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
          positionClass: 'toast-bottom-left',
          progressBar: true,
          disableTimeOut: false
        });
      }
    }
    return deliveryFee;
  }

  showDateTimePickerErrorOnSubmit(finalDateTime, errorMsg, errorTitle) {
    console.log('finalDateTime is not valid', finalDateTime);
    this.toastr.error(errorMsg, errorTitle,  {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false
    });
    this.spinner.hide();
  }

  async submit(): Promise<void> {
    // Extra check to prevent submitting when form validations are invalid
    if (this.isOrderFormDisabled()) {
      return;
    }
    console.log('finalForm', this.orderForm);

    const isDateTimeInvalid = this.isDateTimePickerInValid();
    const finalDateTime = this.getMomentDateTime();
    console.log('finalDateTime', finalDateTime);

    if (isDateTimeInvalid) {
      this.showDateTimePickerErrorOnSubmit(finalDateTime, GlobalConstants.errors.dateTimeErrors.incorrectDateTimeError, GlobalConstants.errors.dateTimeErrors.incorrectDateTimeTitle);
      return;
    }

    // TODO: Perform final call check to Google Calendar API to validate if the date & time selected does not conflict
    this.spinner.show();
    try {
      // maybe add this if we want to show another final message (but dont need to as we already output toaster on calculate transport function)
      // if (isDeliveryInvalid) {
      //   this.toastr.error(GlobalConstants.errors.deliveryErrors.submitError, `Delivery Error`,  {
      //     positionClass: 'toast-bottom-left',
      //     progressBar: true,
      //     disableTimeOut: false
      //   });
      //   this.spinner.hide();
      //   return;
      // }

      const isDateTimeConflicting = false; // TODO: make api call
      if (isDateTimeConflicting) {
        this.showDateTimePickerErrorOnSubmit(finalDateTime, GlobalConstants.errors.dateTimeErrors.conflictError, GlobalConstants.errors.dateTimeErrors.conflictTitle);
        return;
      }

      const isDateTimeValid = !isDateTimeInvalid && !isDateTimeConflicting;

      if (isDateTimeValid && !this.isDeliveryInvalid) {
        // removes undefined or null values
        console.log('finalDateTime is valid', finalDateTime);
        console.log('finalForm', this.orderForm);
        this.closeCartModal('payment-success');
        this.toastr.success(`We have received your order. You will receive an email confirmation soon. Thank you!`, `Order Success!`,  {
          positionClass: 'toast-bottom-left',
          progressBar: true,
          disableTimeOut: true
        });
        this.cartService.clearCart();
      } else if (this.isDeliveryInvalid) {
        this.toastr.error('', GlobalConstants.errors.deliveryErrors.submitError, {
          positionClass: 'toast-bottom-left',
          progressBar: true,
          disableTimeOut: false
        });
      }
      this.spinner.hide();
    } catch {
      this.toastr.error('', GlobalConstants.errors.commonErrors.unknownError, {
        positionClass: 'toast-bottom-left',
        progressBar: true,
        disableTimeOut: false
      });
      this.spinner.hide();
    }
  }

}
