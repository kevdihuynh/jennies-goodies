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
import { GoogleCalendarService } from 'src/app/services/google-calendar/google-calendar.service';
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
  delivery = {
    minTotal: 20,
    minDistance: 10,
    maxDistance: 15,
    fee: 5
  }
  formControls: FormControl = {
    dateTimePicker: {},
    deliveryForm: {}
  };
  isDeliveryInvalid = true;
  orderForm: OrderForm;
  orders: Order[] = [];
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
  availableSlots: any[] = [];
  dateTimeOptions: any = [];
  /*
  dateTimeOptions: any = [
    {
      "kind": "calendar#event",
      "etag": "\"3186369343340000\"",
      "id": "5nkra92dtuet5btr6vbvl9tevn",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=NW5rcmE5MmR0dWV0NWJ0cjZ2YnZsOXRldm4gamVubmllc2dvb2RpZXMxOTk0QG0",
      "created": "2020-06-26T15:17:51.000Z",
      "updated": "2020-06-26T15:17:51.670Z",
      "summary": "first",
      "creator": {
        "email": "jenniesgoodies1994@gmail.com",
        "self": true
      },
      "organizer": {
        "email": "jenniesgoodies1994@gmail.com",
        "self": true
      },
      "start": {
        "dateTime": "2020-06-29T10:00:00-07:00"
      },
      "end": {
        "dateTime": "2020-06-29T11:00:00-07:00"
      },
      "iCalUID": "5nkra92dtuet5btr6vbvl9tevn@google.com",
      "sequence": 0,
      "reminders": {
        "useDefault": true
      }
    },
    {
      "kind": "calendar#event",
      "etag": "\"3186369359516000\"",
      "id": "06l93kq1100ehctfep5s6u7s1r",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=MDZsOTNrcTExMDBlaGN0ZmVwNXM2dTdzMXIgamVubmllc2dvb2RpZXMxOTk0QG0",
      "created": "2020-06-26T15:17:59.000Z",
      "updated": "2020-06-26T15:17:59.758Z",
      "summary": "asdlasklda",
      "creator": {
        "email": "jenniesgoodies1994@gmail.com",
        "self": true
      },
      "organizer": {
        "email": "jenniesgoodies1994@gmail.com",
        "self": true
      },
      "start": {
        "dateTime": "2020-06-29T18:00:00-07:00"
      },
      "end": {
        "dateTime": "2020-06-29T19:00:00-07:00"
      },
      "iCalUID": "06l93kq1100ehctfep5s6u7s1r@google.com",
      "sequence": 0,
      "reminders": {
        "useDefault": true
      }
    }
  ];
  */

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    public cartService: CartService,
    public googleMapsService: GoogleMapsService,
    public googlePlacesService: GooglePlacesService,
    public googleCalendarService: GoogleCalendarService) {
    // TODO: Remove ngb time picker references as we are no longer using it
    // If weekend, set default start time to 9am
    // if (this.isClosedDays()) {
    //   this.orderForm.time = { hour: 9, minute: 0, second: 0 };
    // }
  }

  ngOnInit(): void {
    this.isDeliveryInvalid = true;
    this.cartService.orderForm.subscribe((orderForm: OrderForm) => {
      this.orderForm = orderForm;
    });

    /**** Disabled Delivery Feature ****/
    // if (this.orderForm.total < this.delivery.minTotal) {
    //   this.formControls.deliveryForm.tooPoor = true;
    //   // this.toastr.error(GlobalConstants.errors.deliveryErrors.tooPoorError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
    //   //   positionClass: 'toast-bottom-left',
    //   //   progressBar: true,
    //   //   disableTimeOut: false
    //   // });
    //   // this.isDeliveryFormInvalid();
    // }
    // if (this.formControls.deliveryForm && this.formControls.deliveryForm.tooPoor) {
    //   this.orderForm.isDelivery = false;
    //   this.orderForm.address = GlobalConstants.company.address;
    // }
    this.getEvents();
  }

  /**** Disabled Delivery Feature ****/
  // selectEvent(item) {

  //     // do something with selected item
  //     this.generateNewSessionToken();
  //     // reset when place is selected
  //     this.currentSessionToken = undefined;
  //     this.timeStart = undefined;
  //     console.log('selectEvent: ', item.name);
  //     this.orderForm.address = item.name;
  // }

  /**** Disabled Delivery Feature ****/
  // resetDeliveryFee(): void {
  //   this.formControls.deliveryForm = {};
  //   this.orderForm.deliveryFee = 0;
  //   if (this.orderForm.total < this.delivery.minTotal) {
  //     this.formControls.deliveryForm.tooPoor = true;
  //     // this.toastr.error(GlobalConstants.errors.deliveryErrors.tooPoorError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
  //     //   positionClass: 'toast-bottom-left',
  //     //   progressBar: true,
  //     //   disableTimeOut: false
  //     // });
  //     this.isDeliveryFormInvalid();
  //   }
  // }

  /**** Disabled Delivery Feature ****/
  // async confirmAddress(): Promise<void> {
  //   this.spinner.show();
  //   try {
  //     if (_.isEmpty(this.orderForm.address)) {
  //       return;
  //     }

  //     // get GeoCode for lat & lon
  //     const geoCode = await this.googleMapsService.getGeoCode(this.orderForm.address);
  //     this.orderForm.addressComponent = this.googleMapsService.getFormattedAddressComponent(_.get(geoCode, ['address_components'], []));
  //     const lat = _.get(geoCode, 'geometry.location.lat', null);
  //     const lon = _.get(geoCode, 'geometry.location.lng', null);
  //     if (_.isNil(lat) || _.isNil(lon)) {
  //       this.formControls.deliveryForm.addressError = true;
  //       this.toastr.error(GlobalConstants.errors.deliveryErrors.addressError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
  //         positionClass: 'toast-bottom-left',
  //         progressBar: true,
  //         disableTimeOut: false
  //       });
  //       this.isDeliveryFormInvalid();
  //       return;
  //     }

  //     // get deliveryDistance in miles
  //     this.orderForm.deliveryDistance = await this.googleMapsService.getDeliveryDistance(lat, lon);
  //     this.validateDeliveryFee();

  //     // store the last confirmed address
  //     this.orderForm.confirmedAddress = this.orderForm.address;
  //     if (!this.isDeliveryInvalid) {
  //       this.toastr.success(`Address is valid`, `Address Success!`,  {
  //         positionClass: 'toast-bottom-left',
  //         progressBar: true,
  //         disableTimeOut: false,
  //       });
  //     }
  //   } catch (error) {

  //     // show error if anything wrong happens with APIs or bad data
  //     this.formControls.deliveryForm.calcDistanceError = true;
  //     this.toastr.error(GlobalConstants.errors.deliveryErrors.calcDistanceError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
  //       positionClass: 'toast-bottom-left',
  //       progressBar: true,
  //       disableTimeOut: false
  //     });
  //     this.isDeliveryFormInvalid();
  //   }
  //   this.spinner.hide();
  // }

  /**** Disabled Delivery Feature ****/
  // validateDeliveryFee(): void {
  //   this.resetDeliveryFee();

  //   // Ignore all if pickup
  //   if (!this.orderForm.isDelivery) {
  //     return;
  //   }

  //   console.log('miles to destination: ', this.orderForm.deliveryDistance);

  //   if (this.orderForm.total < this.delivery.minTotal) {
  //     this.formControls.deliveryForm.tooPoor = true;
  //     this.toastr.error(GlobalConstants.errors.deliveryErrors.tooPoorError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
  //       positionClass: 'toast-bottom-left',
  //       progressBar: true,
  //       disableTimeOut: false
  //     });
  //     this.isDeliveryFormInvalid();
  //     return;
  //   }

  //   // show error if delivery distance is over 15 miles
  //   if (this.orderForm.deliveryDistance > this.delivery.maxDistance) {
  //     this.formControls.deliveryForm.tooFarError = true;
  //     this.toastr.error(GlobalConstants.errors.deliveryErrors.tooFarError, GlobalConstants.errors.deliveryErrors.errorTitle,  {
  //       positionClass: 'toast-bottom-left',
  //       progressBar: true,
  //       disableTimeOut: false
  //     });
  //     this.isDeliveryFormInvalid();
  //     return;
  //   }

  //   // charge $5 delivery fee if delivery distance is between 10 to 12 miles AND under 20
  //   if (this.orderForm.deliveryDistance > this.delivery.minDistance && this.orderForm.deliveryDistance <= this.delivery.maxDistance
  //     && this.orderForm.total >= this.delivery.minTotal) {
  //     this.formControls.deliveryForm.feeWarning = true;
  //     this.orderForm.deliveryFee = this.delivery.fee
  //   }
  //   this.isDeliveryInvalid = this.isDeliveryFormInvalid();
  // }

  /**** Disabled Delivery Feature ****/
  // async onChangeSearch(val: string) {
  //   this.formControls.deliveryForm = {};
  //   this.orderForm.deliveryFee = 0;
  //   this.orderForm.deliveryDistance = 0;
  //   // fetch remote data from here
  //   // And reassign the 'data' which is binded to 'data' property.
  //   console.log('onChangeSearch: ', val);
  //   // generate the session token to allow for proper billing
  //   this.orderForm.address = val;
  //   this.generateNewSessionToken();
  //   const predictedAddresses = await this.googlePlacesService.predictAddresses(val, this.currentSessionToken);
  //   this.predictedAddresses = [];
  //   if (predictedAddresses) {
  //     predictedAddresses.map((address, index) => {
  //       this.predictedAddresses.push({
  //         id: index,
  //         name: address.description
  //       });
  //     });
  //   }
  // }

  /**** Disabled Delivery Feature ****/
  // onFocused(e) {
  //   // do something when input is focused
  //   console.log('onFocused: ', e);
  // }

  resetAddress(useDefaultAddress: boolean = false) {
    this.orderForm.selectedDateTime = undefined;
    this.orderForm.address = useDefaultAddress ? _.cloneDeep(this.globalConstants.company.address) : undefined;
    /**** Disabled Delivery Feature ****/
    // this.resetDeliveryFee();
  }

  /**** Disabled Delivery Feature ****/
  // generateNewSessionToken() {
  //   if (this.timeStart === undefined) {
  //     this.timeStart = performance.now();
  //   }
  //   const timeElapsed = this.timeElapsed();
  //   if ((timeElapsed >= 5 && this.currentSessionToken) || this.currentSessionToken === undefined) {
  //     // generate new session token if more than 5 seconds elapsed
  //     // or session token not set yet
  //     this.currentSessionToken = uuidv4();
  //   }
  //   this.timeStart = performance.now();
  // }

  /**** Disabled Delivery Feature ****/
  // timeElapsed() {
  //   const endTime = performance.now();
  //   let  timeDiff = endTime - this.timeStart; //in ms
  //   // strip the ms
  //   timeDiff /= 1000;

  //   // get seconds
  //   const seconds = Math.round(timeDiff);
  //   console.log(seconds + " seconds");
  //   return seconds;
  // }

  closeCartModal(reason?: any): void {
    this.activeModal.close(reason);
  }

  dismissCartModal(reason?: string): void {
    this.activeModal.dismiss(reason);
  }

  updateFromCart(order: Order, index: number): void {
    this.cartService.updateFromCart(order, index);
    /**** Disabled Delivery Feature ****/
    // this.validateDeliveryFee();
  }

  removeFromCart(order: Order, index: number): void {
    this.toastr.info(`${order.quantity} ${order.name} (${_.join(order.selectedFlavors, ', ')}) - ${order.batchSize} for $${order.price}`, 'Removed from Cart', {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false,
      timeOut: 2000
    });
    this.cartService.removeFromCart(index);
    /**** Disabled Delivery Feature ****/
    // this.validateDeliveryFee();
  }

  // TODO: Remove ngb time picker references as we are no longer using it
  // isClosedDays() {
  //   if (!_.get(this.orderForm, 'date')) {
  //     return false;
  //   }
  //   const dateTime = this.getMomentDate();
  //   const isClosedDays = _.includes(['Friday', 'Saturday', 'Sunday'], dateTime.format('dddd'));
  //   return isClosedDays;
  // }

  // TODO: Remove ngb time picker references as we are no longer using it
  // getMomentDate() {
  //   if (_.isNil(_.get(this.orderForm, 'date'))) {
  //     return null;
  //   }
  //   const date = this.orderForm.date;
  //   return moment(`${date.year}-${date.month}-${date.day}`);

  // }

  // TODO: Remove ngb time picker references as we are no longer using it
  // getMomentDateTime() {
  //   if (_.isNil(_.get(this.orderForm, 'date')) || _.isNil(_.get(this.orderForm, 'time'))) {
  //     return null;
  //   }
  //   const date = this.orderForm.date;
  //   const time = this.orderForm.time;
  //   return moment(`${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:${time.second}`);
  // }

  // TODO: Remove ngb time picker references as we are no longer using it
  // getDateTimeText() {
  //   if (_.isNil(_.get(this.orderForm, 'date')) || _.isNil(_.get(this.orderForm, 'time'))) {
  //     return 'Date & Time';
  //   }
  //   return this.getMomentDate().format('LLL');
  // }

  // TODO: Remove ngb time picker references as we are no longer using it
  // isDateTimePickerInValid(): boolean {
  //   const date = _.get(this.orderForm, 'date');
  //   const time = _.get(this.orderForm, 'time');
  //   this.formControls.dateTimePicker = {};
  //   if (!_.isObject(date) || !_.isObject(time)) {
  //     return true;
  //   };

  //   let minTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  //   let maxTime: NgbTimeStruct = { hour: 21, minute: 0, second: 0 };

  //   if (!this.isClosedDays()) {
  //     minTime = { hour: 17, minute: 0, second: 0 };
  //   }

  //   if (time.hour < minTime.hour) {
  //     this.formControls.dateTimePicker.tooEarly = true;
  //     return true;
  //   }

  //   if ((time.hour > maxTime.hour) || (_.isEqual(time.hour, maxTime.hour) && (time.minute > maxTime.minute))) {
  //     this.formControls.dateTimePicker.tooLate = true;
  //     return true;
  //   }

  //   return false;
  // }

  /**** Disabled Delivery Feature ****/
  // isDeliveryFormInvalid(): boolean {
  //   return (
  //     this.formControls.deliveryForm.addressError ||
  //     this.formControls.deliveryForm.calcDistanceError ||
  //     this.formControls.deliveryForm.tooFarError ||
  //     this.formControls.deliveryForm.tooPoor
  //   );
  // }

  /**** Disabled Delivery Feature ****/
  // isDeliveryAndDateInvalid(): boolean {
  //   // Validate if date and time are invalid
  //   if (this.isDateTimePickerInValid()) {
  //     return true;
  //   }

  //   // Validate if delivery is valid
  //   // if (this.isDeliveryFormInvalid()) {
  //   //   return true;
  //   // }

  //   return false;
  // }

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

    // Validate if selectedDateTime is unset
    if (_.isNil(_.get(this.orderForm, 'selectedDateTime'))) {
      return true;
    }

    // Validate if Address is unset only if isDelivery is set
    /**** Disabled Delivery Feature ****/
    // if (_.isEmpty(_.get(this.orderForm, 'address')) && !_.isNil(_.get(this.orderForm, 'isDelivery')) && _.get(this.orderForm, 'isDelivery')) {
    //   return true;
    // };

    // Validate if there is at least one item in order
    if (this.orderForm.orders.length < 1) {
      return true;
    }

    /**** Disabled Delivery Feature ****/
    /* There is a bug with this any ways when we enable it */
    // if ( this.isDeliveryInvalid ) {
    //   return true;
    // }

    // All form validations passed. The Order Form is validated
    return false;
  };

  showDateTimePickerErrorOnSubmit(finalDateTime, errorMsg, errorTitle) {
    console.log('finalDateTime is not valid', finalDateTime);
    this.toastr.error(errorMsg, errorTitle,  {
      positionClass: 'toast-bottom-left',
      progressBar: true,
      disableTimeOut: false
    });
    this.spinner.hide();
  }

  async getEvents() {
    // time sent to google needs to be in RFC 3339
    this.spinner.show();
    try {
      const modDay = this.orderForm.date.day <= 9 ? `0${this.orderForm.date.day}` : `${this.orderForm.date.day}`;
      const modMonth = this.orderForm.date.month <= 9 ? `0${this.orderForm.date.month}` : `${this.orderForm.date.month}`;

      const dateTimeStart = moment(`${this.orderForm.date.year}-${modMonth}-${modDay} 00:00:00`).format();
      const dateTimeEnd = moment(`${this.orderForm.date.year}-${modMonth}-${modDay} 24:00:00`).format();
      const events = await this.googleCalendarService.getEvents(dateTimeStart, dateTimeEnd);
      console.log(events);
      // Show only events that contain the title [OPEN]
      this.dateTimeOptions = _.filter(events, (event: any) => _.includes(_.toUpper(_.get(event, ['summary'])), _.toUpper('[OPEN]')));
      console.log('google calendar getEvents response:: ', events);
    } catch (e) {
      console.log('error on google getEvents::', e);
    }
    this.spinner.hide();
  }

  async submit(): Promise<void> {
    // Extra check to prevent submitting when form validations are invalid
    if (this.isOrderFormDisabled()) {
      return;
    }
    this.spinner.show();
    try {
      // update the google calendar event with BOOKED status
      await this.googleCalendarService.bookCalendar(this.orderForm);

      // save order details in firebase

      // email confirmation AND possibly texting

      // send out toaster message that order is completed
      console.log('finalForm', this.orderForm);
      this.closeCartModal('payment-success');
      this.toastr.success(`We have received your order. You will receive an email confirmation soon. Thank you!`, `Order Success!`,  {
        positionClass: 'toast-bottom-left',
        progressBar: true,
        disableTimeOut: true
      });
      this.cartService.clearCart();
    } catch (e) {
      this.toastr.error('', GlobalConstants.errors.commonErrors.unknownError, {
        positionClass: 'toast-bottom-left',
        progressBar: true,
        disableTimeOut: false
      });
    }
    this.spinner.hide();
  }

}
