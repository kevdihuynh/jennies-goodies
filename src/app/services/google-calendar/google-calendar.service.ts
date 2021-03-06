import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import getEventsResponse from './../../db_mock/get_events_response.json';
import { OrderForm } from '../../interfaces/cart';
import { DatePipe } from '@angular/common';
import { CartService } from 'src/app/services/cart/cart.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  constructor(private cartService: CartService, private fns: AngularFireFunctions, private http: HttpClient, private datePipe: DatePipe){}

  async getEvents(timeMin: string, timeMax: string): Promise<any[]> {
    const reqBody = { timeMin, timeMax};
    const callback = () => this.http.post<any>(`${getBaseUrl()}/getCalendarEvents`, reqBody);
    const calendarEventsResponse = await getResponse(callback, getEventsResponse).toPromise();
    //TODO still need to parse it...
    return calendarEventsResponse;
  }

  async updateEvent(orderForm: any, descriptionHtml: any): Promise<any[]> {
    const reqBody = {
      orderForm,
      description: descriptionHtml,
    };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/updateCalendarEvent`, reqBody);
    const updateCalendarEventResponse = await getResponse(callback, getEventsResponse).toPromise();
    //TODO still need to parse it...
    return updateCalendarEventResponse;
  }

  async bookCalendar(orderForm: OrderForm, transactionId: string = 'N/A') {
    // time sent to google needs to be in RFC 3339
    const getDescription = (): string => {
      return `${_.get(orderForm, ['isDelivery']) ? 'Delivery' : 'Pick up'} at ${_.get(orderForm, ['address'])}  on ${this.datePipe.transform(orderForm.selectedDateTime.end.dateTime, 'fullDate')} between ${this.datePipe.transform(orderForm.selectedDateTime.start.dateTime, 'shortTime')} and ${this.datePipe.transform(orderForm.selectedDateTime.end.dateTime, 'shortTime')}`;
    }
    const getOrderItems = () => {
      let itemList = '';
      orderForm.orders.map((order) => {
        itemList += `<li>${this.cartService.displayFriendlyItemText(order)}</li>`;
      });
      return itemList;
    };
    const discount = _.get(orderForm, ['discount']);
    const descriptionHTML = `
      <section>
        <p><b>Transaction ID:</b> ${transactionId}</p>
        <p><b>Name:</b> ${orderForm.name}</p>
        <p><b>Email:</b> ${orderForm.email}</p>
        <p><b>Phone:</b> ${orderForm.phoneNumber}</p>
        ${!_.isNil(discount) ? `<p><b>Discount Code:</b> ${_.get(discount, ['code'])} (${_.get(discount, ['percent'], 0)}% OFF ${_.get(discount, ['type'])})</p>`: ''}
        <p><b>Total:</b> $${orderForm.total} ${(orderForm.deliveryFee > 0) ? `+ ${orderForm.deliveryFee} Delievery Fee` : ``}</p>
        <p><b>Orders:</b></p>
        <ul>${getOrderItems()}</ul>
        ${!_.isEmpty(orderForm.notes) ? `<p><b>Notes:</b> ${orderForm.notes}</p>` : ``}
        <p><b>Description:</b> ${getDescription()}</p>
      </section>
    `;
    const events = await this.updateEvent(orderForm, descriptionHTML);
    console.log('google calendar updateEvents response:: ', events);
  }
}
