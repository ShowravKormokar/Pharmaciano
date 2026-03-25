import { api } from "@/lib/api";
import type { MedicinesApiResponse, MedicineApiResponse, BasicApiResponse } from "@/types/medicine";

export const fetchMedicinesService = async (): Promise<MedicinesApiResponse> => {
    const res = await api.get<MedicinesApiResponse>("/v1/medicines");
    return res.data;
};

export const fetchMedicineByIdService = async (id: string): Promise<MedicineApiResponse> => {
    const res = await api.get<MedicineApiResponse>(`/v1/medicines/${id}`);
    return res.data;
};

export const createMedicineService = async (data: {
    name: string;
    genericName?: string;
    categoryName?: string;
    brandName?: string;
    dosageForm?: string;
    strength?: string;
    unit?: string;
    unitPrice?: number;
    unitsPerStrip?: number;
    isPrescriptionRequired?: boolean;
    taxRate?: number;
    isActive?: boolean;
}): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/medicines", data);
    return res.data;
};

export const updateMedicineService = async (
    id: string,
    data: {
        name: string;
        genericName?: string;
        categoryName?: string;
        brandName?: string;
        dosageForm?: string;
        strength?: string;
        unit?: string;
        unitPrice?: number;
        unitsPerStrip?: number;
        isPrescriptionRequired?: boolean;
        taxRate?: number;
        isActive?: boolean;
    }
): Promise<BasicApiResponse> => {
    const res = await api.put<BasicApiResponse>(`/v1/medicines/${id}`, data);
    return res.data;
};

export const deleteMedicineService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.delete<BasicApiResponse>(`/v1/medicines/${id}`);
    return res.data;
};