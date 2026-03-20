import { api } from "@/lib/api";
import type { SuppliersApiResponse, SupplierApiResponse, BasicApiResponse } from "@/types/supplier";

export const fetchSuppliersService = async (): Promise<SuppliersApiResponse> => {
    const res = await api.get<SuppliersApiResponse>("/v1/suppliers");
    return res.data;
};

export const fetchSupplierByIdService = async (id: string): Promise<SupplierApiResponse> => {
    const res = await api.get<SupplierApiResponse>(`/v1/suppliers/${id}`);
    return res.data;
};

export const createSupplierService = async (data: {
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
}): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/suppliers", data);
    return res.data;
};

export const updateSupplierService = async (
    id: string,
    data: {
        name: string;
        contactPerson?: string;
        phone?: string;
        email?: string;
        address?: string;
        isActive?: boolean;
    }
): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/suppliers/${id}`, data);
    return res.data;
};

export const deleteSupplierService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/suppliers/${id}`);
    return res.data;
};