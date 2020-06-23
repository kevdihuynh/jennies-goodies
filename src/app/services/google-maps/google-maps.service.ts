import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl } from 'src/app/utils/utility-functions';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor(private fns: AngularFireFunctions, private http: HttpClient){}

  getGeocode(customerAddress: string) {
    const reqBody = { customerAddress, };
    this.http.post<any>(`${getBaseUrl()}/getGeoCoordinates`, reqBody).subscribe(data => {
      console.log(data);
    });
  }

  getDistance(customerLat: number, customerLon: number) {
    const reqBody = {
      customerLat,
      customerLon,
    };

    this.http.post<any>(`${getBaseUrl()}/getDistance`, reqBody).subscribe(data => {
      console.log(data);
    });
  }
}
