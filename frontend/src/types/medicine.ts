export interface MedicineItem {
    _id: string;
    name: string;
    genericName?: string;
    categoryName?: string;
    brandName?: string; 
    dosageForm?: string;
    strength?: string;
    unit?: string;
    unitPrice?: number;
    unitsPerStrip?: number;
    stripPrice?: number;
    isPrescriptionRequired?: boolean;
    taxRate?: number;
    isActive: boolean;
    createdBy?: { name: string; email: string };
    createdAt?: string;
    updatedAt?: string;
    categoryId?: {
        _id?: string;
        name: string;
        description?: string;
    };
    brandId?: {
        _id?: string;
        name: string;
        manufacturer?: string;
        country?: string;
    };
}

export interface MedicinesApiResponse {
    success: boolean;
    message: string;
    length: number;
    data: {
        medicine: MedicineItem[];
    };
}

export interface MedicineApiResponse {
    success: boolean;
    message: string;
    data: {
        medicine: MedicineItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}