import { api } from "@/lib/api";
import type { BranchesApiResponse, BranchApiResponse, MutationApiResponse } from "@/types/branch";

export const fetchBranchesService = async (): Promise<BranchesApiResponse> => {
    const res = await api.get<BranchesApiResponse>("/v1/branches");
    return res.data;
};

export const fetchBranchByIdService = async (id: string): Promise<BranchApiResponse> => {
    const res = await api.get<BranchApiResponse>(`/v1/branches/${id}`);
    return res.data;
};

export const createBranchService = async (data: {
    name: string;
    address: string;
    contact: { phone: string; email: string };
    orgName: string;
}): Promise<MutationApiResponse> => {
    const res = await api.post<MutationApiResponse>("/v1/branches", data);
    return res.data;
};

export const updateBranchService = async (
    id: string,
    data: {
        name: string;
        address: string;
        contact: { phone: string; email: string };
        orgName: string;
        isActive?: boolean;
    }
): Promise<MutationApiResponse> => {
    const res = await api.put<MutationApiResponse>(`/v1/branches/${id}`, data);
    return res.data;
};

export const deleteBranchService = async (id: string): Promise<MutationApiResponse> => {
    const res = await api.delete<MutationApiResponse>(`/v1/branches/${id}`);
    return res.data;
};