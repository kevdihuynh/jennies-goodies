import * as functions from 'firebase-functions';
import { geocodeApi } from './apis/geocode/geocodeApi';
import { distanceMatrixApi } from './apis/distanceMatrix/distanceMatrixApi';
import _ = require('lodash');
import { cors } from './utils';
import { placesApi } from './apis/places/placesApi';
import { calendarApi } from './apis/calendar/calendarApi';
const googleCredentials = {
    "web": {
        "client_id": "949455722879-ed09ppr7jo3rd4pm7kc447etcde0pt7p.apps.googleusercontent.com",
        "project_id": "jennies-goodies",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "ZjyXgw-6xMmoWmHou69bXiLz",
        "redirect_uris": [
            "https://jennies-goodies.firebaseapp.com/__/auth/handler"
        ],
        "javascript_origins": [
            "http://localhost",
            "http://localhost:5000",
            "http://localhost:4200",
            "http://localhost:5001",
            "https://jennies-goodies.web.app"
        ]
    },
    "refresh_token": "1//048WIgQ7KzDxBCgYIARAAGAQSNwF-L9IrvgDGCntH-2qWOcZJsm75pl0-coFi4t3l5ulmQnRGRhCf73Kiju0T9-oZ7gER31nFHbg"
}

const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2; 
const calendar = google.calendar('v3');

const ERROR_RESPONSE = {
    status: "500",
    message: "There was an error adding an event to your Google calendar"
};

const ERROR_RESPONSE_2 = {
    status: "500",
    message: "Date and time are not valid",
};

const TIME_ZONE = 'EST';

function addEvent(event:any, auth:any) {
    return new Promise(function(resolve, reject) {
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: {
                'summary': event.eventName,
                'description': event.description,
                'start': {
                    'dateTime': event.startTime,
                    'timeZone': TIME_ZONE,
                },
                'end': {
                    'dateTime': event.endTime,
                    'timeZone': TIME_ZONE,
                },
            },
        }, (err:any, res:any) => {
            if (err) {
                console.log('Rejecting because of error');
                reject(err);
            }
            console.log('Request successful');
            resolve(res.data);
        });
    });
}

export const addEventToCalendar = functions.https.onRequest((request, response) => {
    const r = {
        "eventName": "Firebase Event",
        "description": "This is a sample description",
        "startTime": "2020-06-25T10:00:00",
        "endTime": "2020-06-25T13:00:00"
    };
    const eventData = {
        eventName: r.eventName,
        description: r.description,
        startTime: r.startTime,
        endTime: r.endTime
    };
    const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[0]
    );

    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });

    addEvent(eventData, oAuth2Client).then(data => {
        response.status(200).send(data);
        return;
    }).catch(err => {
        console.error('Error adding event: ' + err.message); 
        response.status(500).send(ERROR_RESPONSE); 
        return;
    });
});

export const getCalendarEvents = functions.https.onRequest(async (request, response) => {
    cors(request, response);
    console.log('entering::', request.body);
    const timeMin = _.get(request, 'body.timeMin', undefined);
    const timeMax = _.get(request, 'body.timeMax', undefined);
    const eventData = {
        timeMin,
        timeMax,
        calendarId: 'primary',
        orderBy: 'startTime',
    }
    if (timeMax && timeMin) {
        calendarApi.getCalendarEvents(eventData).then(data => {
            console.log('data::', data);
            const events = _.get(data, 'items', {});
            response.status(200).send(events);
            return;
        }).catch(err => {
            console.error('Error adding event: ' + err.message); 
            response.status(500).send(ERROR_RESPONSE); 
            return;
        });
    } else {
        response.status(200).send(ERROR_RESPONSE_2);
        return;
    }
});

export const updateCalendarEvent = functions.https.onRequest(async (request, response) => {
    cors(request, response);
    console.log('request body', request.body);
    const orderForm = _.get(request, 'body.orderForm', undefined);
    const selectedDateTime = _.get(orderForm, 'selectedDateTime', undefined);
    const description = _.get(request, 'body.description', undefined);
    
    const name = _.get(orderForm, 'name', undefined);
    const email = _.get(orderForm, 'email', '');

    if (selectedDateTime && name) {
        selectedDateTime.summary = `BOOKED ${name} ${email ? `(${email})` : ''}`;
        selectedDateTime.description = description;
        console.log('event::', selectedDateTime);
        const eventData = {
            calendarId:'primary',
            eventId: _.get(selectedDateTime, 'id', undefined),
            resource: selectedDateTime,
        };
        calendarApi.updateCalendarEvent(eventData).then(data => {
            // console.log('data::', data);
            // const events = _.get(data, 'items', {});
            response.status(200).send(data);
            return;
        }).catch(err => {
            console.error('Error adding event: ' + err.message); 
            response.status(500).send(ERROR_RESPONSE); 
            return;
        });
    } else {
        response.status(200).send(ERROR_RESPONSE_2);
        return;
    }
});

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