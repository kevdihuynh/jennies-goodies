import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export interface OrderForm {
    name: string;
    email: string;
    phoneNumber: string;
    isDelivery: boolean;
    address: string;
    notes?: string;
    date: NgbDateStruct;
    time: NgbTimeStruct;
    transporationFee: number | undefined;
    orders: Order[];
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
