export interface BrandItem {
    _id: string;
    name: string;
    manufacturer: string;
    country: string;
    isActive: boolean;
    createdBy?: {
        _id: string;
        email: string;
        name: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface BrandsApiResponse {
    success: boolean;
    message: string;
    length: number;
    data: {
        brands: BrandItem[];
    };
}

export interface BrandApiResponse {
    success: boolean;
    message: string;
    data: {
        brand: BrandItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
}