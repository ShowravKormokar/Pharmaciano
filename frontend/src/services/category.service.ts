import { api } from "@/lib/api";
import type { CategoriesApiResponse, CategoryApiResponse, BasicApiResponse } from "@/types/category";

export const fetchCategoriesService = async (): Promise<CategoriesApiResponse> => {
    const res = await api.get<CategoriesApiResponse>("/v1/categories");
    return res.data;
};

export const fetchCategoryByIdService = async (id: string): Promise<CategoryApiResponse> => {
    const res = await api.get<CategoryApiResponse>(`/v1/categories/${id}`);
    return res.data;
};

export const createCategoryService = async (data: {
    name: string;
    description?: string;
}): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/categories", data);
    return res.data;
};

export const updateCategoryService = async (
    id: string,
    data: {
        name: string;
        description?: string;
    }
): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/categories/${id}`, data);
    return res.data;
};

export const deleteCategoryService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/categories/${id}`);
    return res.data;
};