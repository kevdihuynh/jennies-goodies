import * as functions from 'firebase-functions';
import { geocodeApi } from './apis/geocode/geocodeApi';
import { distanceMatrixApi } from './apis/distanceMatrix/distanceMatrixApi';
import _ = require('lodash');
import { cors } from './utils';
import { placesApi } from './apis/places/placesApi';

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const getGeoCoordinates = functions.https.onRequest(async (request, response) => {
    cors(request, response);
    const customerAddress:string = _.get(request, 'body.customerAddress', undefined);
    const res = customerAddress ? await geocodeApi.getGeocode(customerAddress) : undefined;
    response.send({data: res});
});

export const getDistance = functions.https.onRequest(async (request, response) => {
    cors(request, response);
    const customerLat:number = _.get(request, 'body.customerLat', undefined);
    const customerLon:number = _.get(request, 'body.customerLon', undefined);
    const res = customerLat && customerLon ? await distanceMatrixApi.getDistance(customerLat, customerLon) : undefined;
    response.send(res);
});

export const predictAddresses = functions.https.onRequest(async (request, response) => {
    cors(request, response);
    const address:string = _.get(request, 'body.address', undefined);
    const sessiontoken:string = _.get(request, 'body.sessiontoken', undefined);
    const res = address ? await placesApi.getAddresses(address, sessiontoken) : undefined;
    response.send(res);
});