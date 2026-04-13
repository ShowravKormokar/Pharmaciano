import { api } from "@/lib/api";
import type { SalesApiResponse, SingleSaleApiResponse, BasicApiResponse, CreateSalePayload, UpdateSalePayload } from "@/types/sale";

export const fetchSalesService = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
): Promise<SalesApiResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const url = `/v1/sales?${params.toString()}`;
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

export const generateInvoicePdfService = async (id: string): Promise<Blob> => {
    const res = await api.get(`/v1/sales/${id}/invoice`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
    });
    return res.data;
};