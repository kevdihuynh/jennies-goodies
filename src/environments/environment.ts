// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useMock: false,
  firebase: {
    apiKey: 'AIzaSyDmGIVY1COhYIaG8llvdXMTUlERkeaozig',
    authDomain: 'jennies-goodies.firebaseapp.com',
    databaseURL: 'https://jennies-goodies.firebaseio.com',
    projectId: 'jennies-goodies',
    storageBucket: 'jennies-goodies.appspot.com',
    messagingSenderId: '949455722879',
    appId: '1:949455722879:web:ae430c0efb8eca3421624a',
    measurementId: 'G-DPTVR63GCE'
  },
  paypal: {
    clientId: 'AQdvMeYPhKyWkWWLA7OvVVQFyTlYIIR6izy3VkrtzvDNoE_oEHva-Qrm0sxB9Ty6SeL-tkCNegcMqEf7'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
