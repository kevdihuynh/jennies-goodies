import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormattedAddressComponent } from './google';

export interface OrderForm {
    name: string;
    email: string;
    phoneNumber: string;
    isDelivery: boolean;
    address: string;
    addressComponent: FormattedAddressComponent;
    notes?: string;
    date: NgbDateStruct;
    // time: NgbTimeStruct; // TODO: Remove ngb time picker references as we are no longer using it
    deliveryDistance: number;
    deliveryFee: number;
    total: number;
    grandTotal: number;
    orders: Order[];
    totalOrdersQuantity: number;
    selectedDateTime: any;
    confirmedAddress: string;
    discount: any;
}
export interface Order {
    imageUrls: string[];
    description: string;
    batchSize: number;
    selectedFlavors: string[];
    price: number;
    name: string;
    quantity: number;
    allowMultiple: boolean;
    rank: number;
}
