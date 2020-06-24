export interface FormControl {
    dateTimePicker: {
        tooEarly?: boolean;
        tooLate?: boolean;
    };
    deliveryForm: {
        tooFarError?: boolean;
        calcDistanceError?: boolean;
        addressError?: boolean;
    };
}
