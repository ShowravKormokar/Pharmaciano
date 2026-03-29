import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchMedicinesService,
    fetchMedicineByIdService,
    createMedicineService,
    updateMedicineService,
    deleteMedicineService,
} from "@/services/medicine.service";
import type { MedicineItem } from "@/types/medicine";
import { toast } from "sonner";

interface MedicineState {
    medicines: MedicineItem[];
    loading: boolean;
    error: string | null;
    form: {
        name: string;
        genericName: string;
        categoryName: string;
        brandName: string;
        dosageForm: string;
        strength: string;
        unit: string;
        unitPrice: number;
        unitsPerStrip: number;
        stripPrice: number;
        isPrescriptionRequired: boolean;
        taxRate: number;
        isActive: boolean;
    };

    fetchMedicines: () => Promise<void>;
    fetchMedicineById: (id: string) => Promise<MedicineItem | null>;
    createMedicine: () => Promise<boolean>;
    updateMedicine: (id: string) => Promise<boolean>;
    deleteMedicine: (id: string) => Promise<boolean>;
    setForm: (data: Partial<MedicineState["form"]>) => void;
    resetForm: () => void;
}

export const useMedicineStore = create<MedicineState>()(
    persist(
        (set, get) => ({
            medicines: [],
            loading: false,
            error: null,
            form: {
                name: "",
                genericName: "",
                categoryName: "",
                brandName: "",
                dosageForm: "",
                strength: "",
                unit: "",
                unitPrice: 0,
                unitsPerStrip: 0,
                stripPrice: 0,
                isPrescriptionRequired: false,
                taxRate: 0,
                isActive: true,
            },
            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),
            resetForm: () =>
                set({
                    form: {
                        name: "",
                        genericName: "",
                        categoryName: "",
                        brandName: "",
                        dosageForm: "",
                        strength: "",
                        unit: "",
                        unitPrice: 0,
                        unitsPerStrip: 0,
                        stripPrice: 0,
                        isPrescriptionRequired: false,
                        taxRate: 0,
                        isActive: true,
                    },
                }),
            fetchMedicines: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchMedicinesService();
                    set({ medicines: res.data.medicine });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch medicines";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },
            fetchMedicineById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchMedicineByIdService(id);
                    return res.data.medicine;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch medicine";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            createMedicine: async () => {
                set({ loading: true, error: null });
                try {
                    const {
                        name,
                        genericName,
                        categoryName,
                        brandName,
                        dosageForm,
                        strength,
                        unit,
                        unitPrice,
                        unitsPerStrip,
                        stripPrice,
                        isPrescriptionRequired,
                        taxRate,
                        isActive,
                    } = get().form;
                    if (!name) {
                        throw new Error("Medicine name is required");
                    }
                    const payload = {
                        name,
                        genericName: genericName || undefined,
                        categoryName: categoryName || undefined,
                        brandName: brandName || undefined,
                        dosageForm: dosageForm || undefined,
                        strength: strength || undefined,
                        unit: unit || undefined,
                        unitPrice: unitPrice || 0,
                        unitsPerStrip: unitsPerStrip || 0,
                        stripPrice: stripPrice || 0,
                        isPrescriptionRequired,
                        taxRate: taxRate || 0,
                        isActive,
                    };
                    const res = await createMedicineService(payload);
                    toast.success(res.message || "Medicine created successfully", { duration: 3000 });
                    await get().fetchMedicines();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create medicine";
                    const hint = err?.response?.data?.hint;
                    const fullMsg = hint ? `${msg} - ${hint}` : msg;
                    set({ error: fullMsg });
                    toast.error(fullMsg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            updateMedicine: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const {
                        name,
                        genericName,
                        categoryName,
                        brandName,
                        dosageForm,
                        strength,
                        unit,
                        unitPrice,
                        unitsPerStrip,
                        stripPrice,
                        isPrescriptionRequired,
                        taxRate,
                        isActive,
                    } = get().form;
                    if (!name) {
                        throw new Error("Medicine name is required");
                    }
                    const payload = {
                        name,
                        genericName: genericName || undefined,
                        categoryName: categoryName || undefined,
                        brandName: brandName || undefined,
                        dosageForm: dosageForm || undefined,
                        strength: strength || undefined,
                        unit: unit || undefined,
                        unitPrice: unitPrice || 0,
                        unitsPerStrip: unitsPerStrip || 0,
                        stripPrice: stripPrice || 0,
                        isPrescriptionRequired,
                        taxRate: taxRate || 0,
                        isActive,
                    };
                    const res = await updateMedicineService(id, payload);
                    toast.success(res.message || "Medicine updated successfully", { duration: 3000 });
                    await get().fetchMedicines();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update medicine";
                    const hint = err?.response?.data?.hint;
                    const fullMsg = hint ? `${msg} - ${hint}` : msg;
                    set({ error: fullMsg });
                    toast.error(fullMsg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            deleteMedicine: async (id: string) => {
                try {
                    const res = await deleteMedicineService(id);
                    toast.success(res.message || "Medicine deleted successfully", { duration: 3000 });
                    set((state) => ({
                        medicines: state.medicines.filter((m) => m._id !== id),
                        error: null,
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete medicine";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "medicine-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);