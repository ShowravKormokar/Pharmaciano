export interface InventoryBatchItem {
    _id: string;
    medicineId?: { name: string } | string; // from list, medicineId is object with name
    medicineName?: string; // for create/update
    batchNo: string;
    expiryDate: string;
    quantity: number;
    purchasePrice: number;
    status: 'active' | 'expired' | 'low_stock';
    orgName?: string;
    branchName?: string;
    warehouseName?: string;
    organizationId?: string;
    branchId?: string;
    warehouseId?: string;
    createdBy?: { name: string; email: string };
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