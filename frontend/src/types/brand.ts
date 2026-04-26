export interface OrganizationInfo {
    _id: string;
    name: string;
    contact?: { phone: string; email: string };
    address?: string;
}

export interface BranchInfo {
    _id: string;
    name: string;
    address?: string;
    contact?: { phone: string; email: string };
}

export interface WarehouseInfo {
    _id: string;
    name: string;
    location?: string;
}

export interface CreatedByInfo {
    _id: string;
    name: string;
    email?: string;
}

export interface BrandItem {
    _id: string;
    name: string;
    manufacturer: string;
    country: string;
    isActive: boolean;
    organizationId?: OrganizationInfo;
    branchId?: BranchInfo;
    warehouseId?: WarehouseInfo;
    createdBy?: CreatedByInfo;
    createdAt?: string;
    updatedAt?: string;
    organizationName?: string;
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