export interface Option {
    flavors: string[];
    maxFlavors: number;
    qty: number;
    desc: string;
    imageUrl: string;
    name: string;
    price: number;
}

export interface Products {
    options?: Option[];
}
