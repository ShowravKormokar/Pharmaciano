export interface CategoryItem {
    _id: string;

    name: string;
    description?: string;
    isActive: boolean;

    organizationId?: {
        _id: string;
        name: string;
    };

    branchId?: {
        _id: string;
        name: string;
    };

    warehouseId?: {
        _id: string;
        name: string;
    };

    createdBy?: {
        _id: string;
        email: string;
        name: string;
    };

    createdAt?: string;
    updatedAt?: string;
}

export interface CategoriesApiResponse {
    success: boolean;
    message: string;
    total: number;
    active: number;
    inActive: number;
    data: {
        category: CategoryItem[];
    };
}

export interface CategoryApiResponse {
    success: boolean;
    message: string;
    data: {
        category: CategoryItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}