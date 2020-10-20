import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import getEventsResponse from './../../db_mock/get_events_response.json';
import * as _ from 'lodash';
import { OrderForm } from '../../interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  constructor(private fns: AngularFireFunctions, private http: HttpClient){}

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

  async bookCalendar(orderForm: OrderForm) {
    // time sent to google needs to be in RFC 3339
    const getOrderItems = () => {
      let itemList = '';
      orderForm.orders.map((order) => {
        itemList += `<li>${order.quantity} x ${order.name} (${_.join(order.selectedFlavors, ', ')}) - ${order.batchSize} for $${order.price}</li>`;
      });
      return itemList;
    };

    const descriptionHTML = `
      <section>
        <p>
          phone: ${orderForm.phoneNumber}
        </p>
        <p>
          ${orderForm.notes}
        </p>
        <p>
          ${orderForm.isDelivery ? `${orderForm.address} (${orderForm.deliveryDistance})` : 'Pickup'}
        </p>
        <p>
          Total: $${orderForm.total} + $${orderForm.deliveryFee}
        </p>
        <ul>
          ${getOrderItems()}
        </ul>
      </section>
    `;
    console.log(descriptionHTML);
    const events = await this.updateEvent(orderForm, descriptionHTML);
    console.log('google calendar updateEvents response:: ', events);
  }
}
