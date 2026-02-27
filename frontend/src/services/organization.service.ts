
import { api } from "@/lib/api";
import type { OrganizationsApiResponse, OrganizationApiResponse, OrganizationItem } from "@/types/organization";

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
}) => {
    const res = await api.post("/v1/organization", data);
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
        isActive?: boolean; // maybe allowed in update
    }
) => {
    const res = await api.put(`/v1/organizations/${id}`, data);
    return res.data;
};

export const deleteOrganizationService = async (id: string) => {
    const res = await api.delete(`/v1/organizations/${id}`);
    return res.data;
};