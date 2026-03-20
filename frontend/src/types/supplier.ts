export interface SupplierItem {
    _id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    isActive: boolean;
    createdBy?: {
        _id: string;
        email: string;
        name: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface SuppliersApiResponse {
    success: boolean;
    message: string;
    length: number;
    data: {
        supplier: SupplierItem[];
    };
}

export interface SupplierApiResponse {
    success: boolean;
    message: string;
    data: {
        supplier: SupplierItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}