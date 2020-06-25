import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import * as _ from 'lodash';
import placesMock from './../../db_mock/places_response.json';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {

  constructor(private fns: AngularFireFunctions, private http: HttpClient){}

  async predictAddresses(address: string, sessiontoken: string): Promise<any> {
    const reqBody = {
      address,
      sessiontoken,
    };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/predictAddresses`, reqBody);
    const placesResponse = await getResponse(callback, placesMock).toPromise();
    const predictedAddresses: any = _.get(placesResponse, 'predictions');
    return predictedAddresses;
  }
}
