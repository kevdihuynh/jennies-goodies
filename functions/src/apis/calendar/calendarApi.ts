import { AxiosRequestConfig } from 'axios';
import { Api } from '../api';
import _ = require('lodash');
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
    "refresh_token": "1//04KXS_oP_GLD3CgYIARAAGAQSNwF-L9Irnmjq0i93LHt0x3le2dr6RIlnqLYY2OstIQATwMy4witcIte95_kavz4i6EC-bIypk4s"
}

const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2; 
const calendar = google.calendar('v3');

// const ERROR_RESPONSE = {
//     status: "500",
//     message: "There was an error adding an event to your Google calendar"
// };
// const TIME_ZONE = 'PST';

// function addEvent(event:any, auth:any) {
//     return new Promise(function(resolve, reject) {
//         calendar.events.insert({
//             auth: auth,
//             calendarId: 'primary',
//             resource: {
//                 'summary': event.eventName,
//                 'description': event.description,
//                 'start': {
//                     'dateTime': event.startTime,
//                     'timeZone': TIME_ZONE,
//                 },
//                 'end': {
//                     'dateTime': event.endTime,
//                     'timeZone': TIME_ZONE,
//                 },
//             },
//         }, (err:any, res:any) => {
//             if (err) {
//                 console.log('Rejecting because of error');
//                 reject(err);
//             }
//             console.log('Request successful');
//             resolve(res.data);
//         });
//     });
// }

function getEvents(eventData: any, auth:any) {
    console.log('event data', eventData);
    return new Promise(function(resolve, reject) {
        calendar.events.list({
            auth: auth,
            timeMin: eventData.timeMin,
            timeMax: eventData.timeMax,
            calendarId: eventData.calendarId,
            // orderBy: eventData.orderBy,
            // timeZone: TIME_ZONE,
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

function updateEvent(eventData: any, auth:any,eventId: any) {

    return new Promise(function(resolve, reject) {
        let e = _.cloneDeep(eventData)
        e.summary = 'this works!!';
        const a = {
            auth: auth,
            "calendarId": "primary",
            "eventId": e.id,
            "resource": e,
        }
      
        console.log('event data', a);
    
        calendar.events.patch(a, (err:any, res:any) => {
            if (err) {
                console.log('Rejecting because of error');
                reject(err);
            }
            console.log('Request successful');
            resolve(res.data);
        });
    });
}


export class CalendarApi extends Api {
    public constructor (config?: AxiosRequestConfig) {
        super(config);
        this.getCalendarEvents = this.getCalendarEvents.bind(this);
        this.updateCalendarEvent = this.updateCalendarEvent.bind(this);
    }

    public getCalendarEvents(eventData: any): Promise<any> {
        const oAuth2Client = new OAuth2(
            googleCredentials.web.client_id,
            googleCredentials.web.client_secret,
            googleCredentials.web.redirect_uris[0]
        );
    
        oAuth2Client.setCredentials({
            refresh_token: googleCredentials.refresh_token
        });
        return getEvents(eventData, oAuth2Client);
    }

    public updateCalendarEvent(eventData: any, ev: any): Promise<any> {
        const oAuth2Client = new OAuth2(
            googleCredentials.web.client_id,
            googleCredentials.web.client_secret,
            googleCredentials.web.redirect_uris[0]
        );
    
        oAuth2Client.setCredentials({
            refresh_token: googleCredentials.refresh_token
        });
        return updateEvent(ev, oAuth2Client, eventData.eventId);
    }
}

export const calendarApi = new CalendarApi();