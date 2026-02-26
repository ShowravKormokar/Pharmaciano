export interface BranchInfo {
    _id?: string;
    name: string;
    address?: string;
    contact?: {
        phone?: string;
        email?: string;
    };
}

export interface CreatedBy {
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
}

export interface WarehouseItem {
    _id: string;
    name: string;
    location: string;
    capacity: number;
    isActive: boolean;
    branchName?: string;      // for list response
    branchId?: BranchInfo;     // for detailed response
    createdBy?: CreatedBy;
    createdAt: string;
    updatedAt: string;
}

export interface WarehousesApiResponse {
    success: boolean;
    message: string;
    length?: number;
    data: {
        warehouse: WarehouseItem[];   // note: the key is "warehouse" (singular) in the response
    };
}

export interface WarehouseApiResponse {
    success: boolean;
    message: string;
    data: {
        warehouse: WarehouseItem;
    };
    staffList?: string; // optional
}