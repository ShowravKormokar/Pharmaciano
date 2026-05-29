import { api } from "@/lib/api";
import type {
    AccountsApiResponse,
    AccountApiResponse,
    BasicApiResponse,
    CreateAccountPayload,
    UpdateAccountPayload,
} from "@/types/account";

export const fetchAccountsService = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    isActive?: boolean;
}): Promise<AccountsApiResponse> => {
    const res = await api.get<AccountsApiResponse>("/v1/accounts", { params });
    return res.data;
};

export const fetchAccountByIdService = async (id: string): Promise<AccountApiResponse> => {
    const res = await api.get<AccountApiResponse>(`/v1/accounts/${id}`);
    return res.data;
};

export const createAccountService = async (data: CreateAccountPayload): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/accounts", data);
    return res.data;
};

export const updateAccountService = async (id: string, data: UpdateAccountPayload): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/accounts/${id}`, data);
    return res.data;
};

export const deleteAccountService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/accounts/${id}`);
    return res.data;
};