export class GlobalConstants {
    public static company = {
        name: "Jennie's Goodies",
        slogan: "Fresh homemade pastries & sweets served every day!",
        email: 'jenniesgoodies@yahoo.com',
        logo: '../assets/images/jennies_goodies_cupcake.png',
        facebook: 'https://www.facebook.com/Jennies-Goodies-112088677209362/?ref=page_internal',
        instagram: 'https://www.instagram.com/jenniesgoodies',
        phoneNumber: '(206) 765-0458',
        address: '17615 140th Ave SE, Renton, WA 98058, USA',
        url: 'jenniesgoodies.com'
    };
    public static errors = {
        deliveryErrors: {
            errorTitle: 'Delivery Error',
            addressError: 'Address is not valid',
            calcDistanceError: 'Could not calculate distance from selected address',
            tooFarError: 'Sorry address is too far for delivery, please select pickup',
            submitError: 'Sorry! Please check delivery address.',
            tooPoorError: 'Sorry! Your order amount does not meet the $20 minimum for delivery'
        },
        commonErrors: {
            unknownError: 'Sorry! Error occured.',
        },
        dateTimeErrors: {
            conflictError: 'Sorry! It looks like somebody has filled this timeslot. Please choose another available time',
            conflictTitle: 'Schedule Conflict!',
            incorrectDateTimeError: 'Sorry! Date and time selected is out of bounds',
            incorrectDateTimeTitle: 'Incorrect date or time',
        }
    };
}
