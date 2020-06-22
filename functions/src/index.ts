import * as functions from 'firebase-functions';
import { geocodeApi } from './apis/geocode/geocodeApi';
import { distanceMatrixApi } from './apis/distanceMatrix/distanceMatrixApi';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// API_KEY AIzaSyCbM2-4MgaZh4ALiKBpoRUBiFH4yCiMSR4

export const getGeoCoordinates = functions.https.onRequest(async (request, response) => {
    const res = await geocodeApi.getGeocode('13515 27th ave NE, Seattle, WA 98125');
    response.send(res);
});

export const getDistance = functions.https.onRequest(async (request, response) => {
    const res = await distanceMatrixApi.getDistance(47.456950, -122.289290);
    response.send(res);
});