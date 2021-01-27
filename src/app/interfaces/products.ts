export interface Option {
    maxFlavors: number;
    batchSize: number;
    price: number;
    quantity?: number;
}

export interface Product {
    secondOptionHeading?: string;
    allowMultiFlavor?: boolean;
    multiFlavors?: object;
    hasFilling?: boolean;
    variations?: Option[];
    flavors: string[];
    imageUrls: string[];
    name: string;
    description: string;
    quantity: number;
    slug: string;
    allowMultiple: boolean;
    rank: number;
    badge?: string;
    productId?: string;
}
