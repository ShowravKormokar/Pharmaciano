import { api } from "@/lib/api";
import type { SalesApiResponse, SingleSaleApiResponse, BasicApiResponse, CreateSalePayload, UpdateSalePayload } from "@/types/sale";

export const fetchSalesService = async (medicine?: string): Promise<SalesApiResponse> => {
    const url = medicine ? `/v1/sales?medicine=${encodeURIComponent(medicine)}` : "/v1/sales";
    const res = await api.get<SalesApiResponse>(url);
    return res.data;
};

export const fetchSaleByIdService = async (id: string): Promise<SingleSaleApiResponse> => {
    const res = await api.get<SingleSaleApiResponse>(`/v1/sales/${id}`);
    return res.data;
};

export const createSaleService = async (data: CreateSalePayload): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/sales", data);
    return res.data;
};

export const updateSaleService = async (id: string, data: UpdateSalePayload): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/sales/${id}`, data);
    return res.data;
};

export const deleteSaleService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/sales/${id}`);
    return res.data;
};