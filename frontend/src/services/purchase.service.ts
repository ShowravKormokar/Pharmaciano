import { api } from "@/lib/api";
import type {
    PurchasesApiResponse,
    PurchaseApiResponse,
    BasicApiResponse,
    CreatePurchasePayload,
    UpdatePurchasePayload,
    ReceivePurchasePayload,
} from "@/types/purchase";

export const fetchPurchasesService = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    fromDate?: string;
    toDate?: string;
}): Promise<PurchasesApiResponse> => {
    const res = await api.get<PurchasesApiResponse>("/v1/purchases", { params });
    return res.data;
};

export const fetchPurchaseByIdService = async (id: string): Promise<PurchaseApiResponse> => {
    const res = await api.get<PurchaseApiResponse>(`/v1/purchases/${id}`);
    return res.data;
};

export const createPurchaseService = async (data: CreatePurchasePayload): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/purchases", data);
    return res.data;
};

export const updatePurchaseService = async (id: string, data: UpdatePurchasePayload): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/purchases/${id}`, data);
    return res.data;
};

export const approvePurchaseService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.patch<BasicApiResponse>(`/v1/purchases/${id}/approve`);
    return res.data;
};

export const receivePurchaseService = async (id: string, data: ReceivePurchasePayload): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>(`/v1/purchases/${id}/receive`, data);
    return res.data;
};

export const deletePurchaseService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/purchases/${id}`);
    return res.data;
};