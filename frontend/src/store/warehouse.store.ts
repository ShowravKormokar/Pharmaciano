import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchWarehousesService,
    fetchWarehouseByIdService,
    createWarehouseService,
    updateWarehouseService,
    deleteWarehouseService,
} from "@/services/warehouse.service";
import type { WarehouseItem } from "@/types/warehouse";

interface WarehouseState {
    warehouses: WarehouseItem[];
    loading: boolean;
    error: string | null;
    // Form state for create/edit
    form: {
        name: string;
        location: string;
        capacity: number;
        branchName: string;
        isActive: boolean;
    };

    // Actions
    fetchWarehouses: () => Promise<void>;
    fetchWarehouseById: (id: string) => Promise<WarehouseItem | null>;
    createWarehouse: () => Promise<boolean>;
    updateWarehouse: (id: string) => Promise<boolean>;
    deleteWarehouse: (id: string) => Promise<boolean>;
    setForm: (data: Partial<WarehouseState["form"]>) => void;
    resetForm: () => void;
}

export const useWarehouseStore = create<WarehouseState>()(
    persist(
        (set, get) => ({
            warehouses: [],
            loading: false,
            error: null,

            form: {
                name: "",
                location: "",
                capacity: 0,
                branchName: "",
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
                        location: "",
                        capacity: 0,
                        branchName: "",
                        isActive: true,
                    },
                }),

            fetchWarehouses: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchWarehousesService();
                    set({ warehouses: res.data.warehouse });
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to fetch warehouses" });
                } finally {
                    set({ loading: false });
                }
            },

            fetchWarehouseById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchWarehouseByIdService(id);
                    return res.data.warehouse;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to fetch warehouse" });
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            createWarehouse: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, location, capacity, branchName, isActive } = get().form;
                    if (!name || !location || !branchName) {
                        set({ error: "Name, location and branch name are required." });
                        return false;
                    }
                    const payload = {
                        name,
                        location,
                        capacity: capacity || 0,
                        branchName,
                        isActive,
                    };
                    await createWarehouseService(payload);
                    await get().fetchWarehouses();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to create warehouse";
                    // If there's a hint, include it
                    const hint = err?.response?.data?.hint;
                    set({ error: hint ? `${msg} - ${hint}` : msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateWarehouse: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { name, location, capacity, branchName, isActive } = get().form;
                    if (!name || !location || !branchName) {
                        set({ error: "Name, location and branch name are required." });
                        return false;
                    }
                    const payload = {
                        name,
                        location,
                        capacity: capacity || 0,
                        branchName,
                        isActive,
                    };
                    await updateWarehouseService(id, payload);
                    await get().fetchWarehouses();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to update warehouse";
                    const hint = err?.response?.data?.hint;
                    set({ error: hint ? `${msg} - ${hint}` : msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteWarehouse: async (id: string) => {
                try {
                    await deleteWarehouseService(id);
                    set((state) => ({
                        warehouses: state.warehouses.filter((w) => w._id !== id),
                        error: null,
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete warehouse";
                    set({ error: msg });
                    return false;
                }
            },
        }),
        {
            name: "warehouse-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);