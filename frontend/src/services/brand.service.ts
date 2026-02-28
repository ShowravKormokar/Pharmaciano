import { api } from "@/lib/api";
import type { BrandsApiResponse, BrandApiResponse, BasicApiResponse } from "@/types/brand";

export const fetchBrandsService = async (): Promise<BrandsApiResponse> => {
    const res = await api.get<BrandsApiResponse>("/v1/brands");
    return res.data;
};

export const fetchBrandByIdService = async (id: string): Promise<BrandApiResponse> => {
    const res = await api.get<BrandApiResponse>(`/v1/brands/${id}`);
    return res.data;
};

export const createBrandService = async (
    data: {
        name: string;
        manufacturer: string;
        country: string;
    }
): Promise<BrandApiResponse> => {
    const res = await api.post<BrandApiResponse>("/v1/brands", data);
    return res.data;
};

export const updateBrandService = async (
    id: string,
    data: {
        name: string;
        manufacturer: string;
        country: string;
    }
): Promise<BrandApiResponse> => {
    const res = await api.put<BrandApiResponse>(`/v1/brands/${id}`, data);
    return res.data;
};

export const deleteBrandService = async (
    id: string
): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/brands/${id}`);
    return res.data;
};