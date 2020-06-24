export class GlobalConstants {
    public static apiURL: string = "https://wwww.itsolutionstuff.com/";
    public static companyName: string = "Jennie's Goodies";
    public static companyLogo: string = '../assets/images/jennies_goodies_logo.jpg';
    public static errors = {
        deliveryErrors: {
            errorTitle: 'Delivery Error',
            addressError: 'Address is not valid',
            calcDistanceError: 'Could not calculate distance from selected address',
            tooFarError: 'Sorry address is too far for delivery, please select pickup',
            submitError: 'Sorry! Please check delivery address.'
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
