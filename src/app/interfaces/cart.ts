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
    time: NgbTimeStruct;
    deliveryDistance: number;
    deliveryFee: number;
    total: number;
    grandTotal: number;
    orders: Order[];
    totalOrdersQuantity: number;
    selectedDateTime: object;
    confirmedAddress: string;
}
export interface Order {
    imageUrls: string[];
    description: string;
    batchSize: number;
    selectedFlavors: string[];
    price: number;
    name: string;
    quantity: number;
}
