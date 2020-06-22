import * as functions from 'firebase-functions';
import { geocodeApi } from './apis/geocode/geocodeApi';

// const GOOGLE_API_KEY = 'AIzaSyCbM2-4MgaZh4ALiKBpoRUBiFH4yCiMSR4';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// API_KEY AIzaSyCbM2-4MgaZh4ALiKBpoRUBiFH4yCiMSR4

export const getGeoCoordinates = functions.https.onRequest(async (request, response) => {
    const res = await geocodeApi.getGeocode('test', 'test');
    response.send(res);
});
   