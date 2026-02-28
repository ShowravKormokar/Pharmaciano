import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchBrandsService,
    fetchBrandByIdService,
    createBrandService,
    updateBrandService,
    deleteBrandService,
} from "@/services/brand.service";
import type { BrandItem } from "@/types/brand";
import { toast } from "sonner";

interface BrandState {
    brands: BrandItem[];
    loading: boolean;
    error: string | null;

    form: {
        name: string;
        manufacturer: string;
        country: string;
        isActive: boolean;
    };

    fetchBrands: () => Promise<void>;
    fetchBrandById: (id: string) => Promise<BrandItem | null>;
    createBrand: () => Promise<boolean>;
    updateBrand: (id: string) => Promise<boolean>;
    deleteBrand: (id: string) => Promise<boolean>;
    setForm: (data: Partial<BrandState["form"]>) => void;
    resetForm: () => void;
}

export const useBrandStore = create<BrandState>()(
    persist(
        (set, get) => ({
            brands: [],
            loading: false,
            error: null,

            form: {
                name: "",
                manufacturer: "",
                country: "",
                isActive: true,
            },

            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),

            resetForm: () =>
                set({
                    form: { name: "", manufacturer: "", country: "", isActive: true },
                }),

            fetchBrands: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchBrandsService();
                    set({ brands: res.data.brands });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch brand";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            fetchBrandById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchBrandByIdService(id);
                    return res.data.brand;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch brand";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            createBrand: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, manufacturer, country } = get().form;
                    if (!name || !manufacturer || !country) {
                        throw new Error("All fields are required");
                    }
                    const payload = { name, manufacturer, country };
                    const res = await createBrandService(payload);
                    toast.success(res.message || "Brand created successfully", {
                        duration: 3000,
                    });
                    await get().fetchBrands();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create brand";
                    set({ error: msg });
                    toast.error(msg, {
                        duration: 3000,
                    });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateBrand: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { name, manufacturer, country } = get().form;
                    if (!name || !manufacturer || !country) {
                        throw new Error("All fields are required");
                    }
                    const payload = { name, manufacturer, country };
                    const res = await updateBrandService(id, payload);
                    toast.success(res.message || "Brand updated successfully", {
                        duration: 3000,
                    });
                    await get().fetchBrands();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update brand";
                    set({ error: msg });
                    toast.error(msg, {
                        duration: 3000,
                    });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteBrand: async (id: string) => {
                try {
                    const res = await deleteBrandService(id);
                    toast.success(res.message || "Brand deleted successfully", {
                        duration: 3000,
                    });
                    set((state) => ({
                        brands: state.brands.filter((b) => b._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete brand";
                    toast.error(msg, {
                        duration: 3000,
                    });
                    return false;
                }
            },
        }),
        {
            name: "brand-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);