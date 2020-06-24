import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import geocodeResponseJson from './../../db_mock/geocode_response.json';
import matrixResponseJson from './../../db_mock/matrix_response.json';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor(private fns: AngularFireFunctions, private http: HttpClient){}

  async getGeocode(customerAddress: string): Promise<number[]> {
    const reqBody = { customerAddress, };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/getGeoCoordinates`, reqBody);
    const geocodeResponse = await getResponse(callback, geocodeResponseJson).toPromise();
    const lat = _.get(geocodeResponse, 'data.results[0].geometry.location.lat');
    const lon = _.get(geocodeResponse, 'data.results[0].geometry.location.lng');
    return [lat, lon];
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
