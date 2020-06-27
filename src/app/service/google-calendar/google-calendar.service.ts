import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import getEventsResponse from './../../db_mock/get_events_response.json';
import * as _ from 'lodash';

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
}
