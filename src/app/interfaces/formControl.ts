export interface FormControl {
    dateTimePicker: {
        tooEarly?: boolean;
        tooLate?: boolean;
    };
    deliveryForm: {
        feeWarning?: boolean;
        tooFarError?: boolean;
        calcDistanceError?: boolean;
        addressError?: boolean;
        tooPoor?: boolean;
    };
}
