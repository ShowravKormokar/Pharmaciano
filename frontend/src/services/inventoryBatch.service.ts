import { api } from "@/lib/api";
import type { InventoryBatchesApiResponse, InventoryBatchApiResponse, BasicApiResponse } from "@/types/inventoryBatch";

export const fetchInventoryBatchesService = async (): Promise<InventoryBatchesApiResponse> => {
    const res = await api.get<InventoryBatchesApiResponse>("/v1/inventory-batches");
    return res.data;
};

export const fetchInventoryBatchByIdService = async (id: string): Promise<InventoryBatchApiResponse> => {
    const res = await api.get<InventoryBatchApiResponse>(`/v1/inventory-batches/${id}`);
    return res.data;
};

export const createInventoryBatchService = async (data: {
    medicineName: string;
    batchNo: string;
    expiryDate: string;
    quantity: number;
    purchasePrice: number;
    orgName: string;
    branchName: string;
    warehouseName: string;
    status?: string;
}): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/inventory-batches", data);
    return res.data;
};

export const updateInventoryBatchService = async (
    id: string,
    data: {
        medicineName: string;
        batchNo: string;
        expiryDate: string;
        quantity: number;
        purchasePrice: number;
        orgName: string;
        branchName: string;
        warehouseName: string;
        status?: string;
    }
): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/inventory-batches/${id}`, data);
    return res.data;
};

export const deleteInventoryBatchService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/inventory-batches/${id}`);
    return res.data;
};