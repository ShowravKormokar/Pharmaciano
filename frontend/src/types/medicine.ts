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
    stripPrice?: number; // calculated by backend? Not needed in form
    isPrescriptionRequired?: boolean;
    taxRate?: number;
    isActive: boolean;
    createdBy?: { name: string; email: string };
    createdAt?: string;
    updatedAt?: string;
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