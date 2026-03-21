import { api } from "@/lib/api";
import type { OrganizationsApiResponse, OrganizationApiResponse, OrganizationItem } from "@/types/organization";
import type { MutationApiResponse } from "@/types/response";

export const fetchOrganizationsService = async (): Promise<OrganizationsApiResponse> => {
    const res = await api.get<OrganizationsApiResponse>("/v1/organizations");
    return res.data;
};

export const fetchOrganizationByIdService = async (id: string): Promise<OrganizationItem> => {
    const res = await api.get<OrganizationApiResponse>(`/v1/organizations/${id}`);
    return res.data.data;
};

export const createOrganizationService = async (data: {
    name: string;
    tradeLicenseNo?: string;
    drugLicenseNo?: string;
    vatRegistrationNo?: string;
    address?: string;
    contact: { phone: string; email: string };
    subscriptionPlan: string;
}): Promise<MutationApiResponse> => {
    const res = await api.post<MutationApiResponse>("/v1/organization", data);
    return res.data;
};

export const updateOrganizationService = async (
    id: string,
    data: {
        name: string;
        tradeLicenseNo?: string;
        drugLicenseNo?: string;
        vatRegistrationNo?: string;
        address?: string;
        contact: { phone: string; email: string };
        subscriptionPlan: string;
        isActive?: boolean;
    }
): Promise<MutationApiResponse> => {
    const res = await api.put<MutationApiResponse>(`/v1/organizations/${id}`, data);
    return res.data;
};

export const deleteOrganizationService = async (id: string): Promise<MutationApiResponse> => {
    const res = await api.delete<MutationApiResponse>(`/v1/organizations/${id}`);
    return res.data;
};