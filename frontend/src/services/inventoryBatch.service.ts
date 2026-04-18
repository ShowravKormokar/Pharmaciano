import { api } from "@/lib/api";
import type {
    InventoryBatchItem,
    InventoryBatchApiResponse,
    BasicApiResponse,
} from "@/types/inventoryBatch";

// Actual API response shape for list endpoint
export interface InventoryBatchesRawResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        count: number;
    };
    total: number;
    active: number;
    expired: number;
    data: InventoryBatchItem[];
}

// Parameter type for fetching batches
export type FetchBatchesParams = {
    page?: number;
    limit?: number;
    status?: string;
    medicineName?: string;
    batchNo?: string;
};

// Fetch list of inventory batches with optional filters and pagination
export const fetchInventoryBatchesService = async (
    params?: FetchBatchesParams
): Promise<InventoryBatchesRawResponse> => {
    const res = await api.get<InventoryBatchesRawResponse>("/v1/inventory-batches", {
        params,
    });
    return res.data;
};

// Single batch fetch
export const fetchInventoryBatchByIdService = async (
    id: string
): Promise<InventoryBatchApiResponse> => {
    const res = await api.get<InventoryBatchApiResponse>(`/v1/inventory-batches/${id}`);
    return res.data;
};

// Create batch
export const createInventoryBatchService = async (data: {
    medicineName: string;
    batchNo: string;
    expiryDate: string;
    quantity: number;
    purchasePrice: number;
    warehouseName: string;
    organizationName?: string;  // for super admin
    branchName?: string;        // for super admin
    status?: string;
}): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/inventory-batches", data);
    return res.data;
};

// Update batch
export const updateInventoryBatchService = async (
    id: string,
    data: {
        medicineName: string;
        batchNo: string;
        expiryDate: string;
        quantity: number;
        purchasePrice: number;
        warehouseName: string;
        organizationName?: string;   // for super admin
        branchName?: string;         // for super admin
        status?: string;
    }
): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/inventory-batches/${id}`, data);
    return res.data;
};

// Delete batch
export const deleteInventoryBatchService = async (
    id: string
): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/inventory-batches/${id}`);
    return res.data;
};