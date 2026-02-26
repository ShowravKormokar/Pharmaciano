import { api } from "@/lib/api";
import type { WarehousesApiResponse, WarehouseApiResponse, WarehouseItem } from "@/types/warehouse";

export const fetchWarehousesService = async (): Promise<WarehousesApiResponse> => {
    const res = await api.get<WarehousesApiResponse>("/v1/warehouses");
    return res.data;
};

export const fetchWarehouseByIdService = async (id: string): Promise<WarehouseApiResponse> => {
    const res = await api.get<WarehouseApiResponse>(`/v1/warehouses/${id}`);
    return res.data;
};

export const createWarehouseService = async (data: {
    name: string;
    location: string;
    capacity: number;
    branchName: string;
    isActive: boolean;
}) => {
    const res = await api.post("/v1/warehouses", data);
    return res.data;
};

export const updateWarehouseService = async (
    id: string,
    data: {
        name: string;
        location: string;
        capacity: number;
        branchName: string;
        isActive: boolean;
    }
) => {
    const res = await api.put(`/v1/warehouses/${id}`, data);
    return res.data;
};

export const deleteWarehouseService = async (id: string) => {
    const res = await api.delete(`/v1/warehouses/${id}`);
    return res.data;
};