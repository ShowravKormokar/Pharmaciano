export interface OrganizationInfo {
    _id: string;
    name: string;
}

export interface BranchInfo {
    _id: string;
    name: string;
}

export interface WarehouseInfo {
    _id: string;
    name: string;
}

export interface CategoryInfo {
    _id: string;
    name: string;
    description?: string;
}

export interface BrandInfo {
    _id: string;
    name: string;
    manufacturer?: string;
    country?: string;
}

export interface CreatedByInfo {
    _id: string;
    name: string;
    email?: string;
}

export interface MedicineItem {
    _id: string;
    name: string;
    genericName?: string;
    barcode?: string;
    dosageForm?: string;
    strength?: string;
    unit?: string;
    unitPrice?: number;
    unitsPerStrip?: number;
    stripPrice?: number;
    isPrescriptionRequired?: boolean;
    taxRate?: number;
    isActive: boolean;
    organizationId?: OrganizationInfo;
    branchId?: BranchInfo;
    warehouseId?: WarehouseInfo;
    categoryId?: CategoryInfo;
    brandId?: BrandInfo;
    createdBy?: CreatedByInfo;
    categoryName?: string;
    brandName?: string;
    createdAt?: string;
    updatedAt?: string;
    organizationName?: string;
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