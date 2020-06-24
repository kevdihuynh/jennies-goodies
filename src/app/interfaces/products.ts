export interface Option {
    maxFlavors: number;
    batchSize: number;
    price: number;
}

export interface Product {
    variations?: Option[];
    flavors: string[];
    imageUrls: string[];
    name: string;
    description: string;
}
