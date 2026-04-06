export interface InventoryBatchItem {
    _id: string;

    organizationId?: {
        _id: string;
        name: string;
        address?: string;
        contact?: {
            phone?: string;
            email?: string;
        };
    };

    branchId?: {
        _id: string;
        name: string;
        address?: string;
        contact?: {
            phone?: string;
            email?: string;
        };
    };

    warehouseId?: {
        _id: string;
        name: string;
        location?: string;
    };

    medicineId?: {
        _id: string;
        name: string;
        genericName?: string;
        dosageForm?: string;
        strength?: string;
        unit?: string;
        unitPrice?: number;
    };

    batchNo: string;
    expiryDate: string;
    quantity: number;
    purchasePrice: number;

    status: "active" | "expired" | "low_stock";

    createdBy?: {
        _id: string;
        name: string;
        email?: string;
    };

    createdAt?: string;
    updatedAt?: string;
}

export interface InventoryBatchesApiResponse {
    success: boolean;
    message: string;
    length: number;
    data: {
        inventoryBatch: InventoryBatchItem[];
    };
}

export interface InventoryBatchApiResponse {
    success: boolean;
    message: string;
    data: {
        inventoryBatch: InventoryBatchItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}