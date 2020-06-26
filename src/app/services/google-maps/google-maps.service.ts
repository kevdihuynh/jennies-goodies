import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import geocodeResponseJson from './../../db_mock/geocode_response.json';
import matrixResponseJson from './../../db_mock/matrix_response.json';
import * as _ from 'lodash';
import { FormattedAddressComponent } from '../../interfaces/google';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor(private fns: AngularFireFunctions, private http: HttpClient){}

  getFormattedAddressComponent(address_components: Array<any>): FormattedAddressComponent {
    const formattedAddressComponent = {};
    _.each(address_components, function (k, v1) {
      _.each(address_components[v1].types, function (k2, v2) {
        formattedAddressComponent[address_components[v1].types[v2]] = address_components[v1].short_name
      });
    });
    return formattedAddressComponent;
  }

  async getGeoCode(customerAddress: string): Promise<any> {
    const reqBody = { customerAddress, };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/getGeoCoordinates`, reqBody);
    const geocodeResponse: any = await getResponse(callback, geocodeResponseJson).toPromise();
    return _.get(geocodeResponse, 'data.results[0]');
  }

  async getDistance(customerLat: number, customerLon: number): Promise<number> {
    let miles;
    const meterToMileFormula = (0.000621371 / 1);
    const reqBody = {
      customerLat,
      customerLon,
    };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/getDistance`, reqBody);
    const distanceResponse = await getResponse(callback, matrixResponseJson).toPromise();
    const metersToDestination: number = _.get(distanceResponse, 'rows[0].elements[0].distance.value');
    if (metersToDestination >= 0) {
      miles =  metersToDestination * meterToMileFormula;
    }
    return miles;
  }
}
