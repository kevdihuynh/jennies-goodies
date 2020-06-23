import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl, getResponse } from 'src/app/utils/utility-functions';
import geocodeResponseJson from './../../db_mock/geocode_response.json';
import matrixResponseJson from './../../db_mock/matrix_response.json';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor(private fns: AngularFireFunctions, private http: HttpClient){}

  getGeocode(customerAddress: string) {
    const reqBody = { customerAddress, };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/getGeoCoordinates`, reqBody);
    getResponse(callback, geocodeResponseJson).subscribe(data => {
      console.log(data);
    });
  }

  getDistance(customerLat: number, customerLon: number) {
    const reqBody = {
      customerLat,
      customerLon,
    };
    const callback = () => this.http.post<any>(`${getBaseUrl()}/getDistance`, reqBody);
    getResponse(callback, matrixResponseJson).subscribe(data => {
      console.log(data);
    });
  }
}
