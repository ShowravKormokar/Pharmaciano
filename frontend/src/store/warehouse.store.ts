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
import { toast } from "sonner";

interface WarehouseState {
    warehouses: WarehouseItem[];
    loading: boolean;
    error: string | null;
    form: {
        name: string;
        location: string;
        capacity: number;
        branchName: string;
        isActive: boolean;
    };

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
                    const msg = err?.response?.data?.message || "Failed to fetch warehouses";
                    set({ error: msg });
                    toast.error(msg);
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
                    const msg = err?.response?.data?.message || "Failed to fetch warehouse";
                    set({ error: msg });
                    toast.error(msg);
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
                        throw new Error("Name, location and branch name are required.");
                    }
                    const payload = {
                        name,
                        location,
                        capacity: capacity || 0,
                        branchName,
                        isActive,
                    };
                    const res = await createWarehouseService(payload);
                    toast.success(res.message || "Warehouse created successfully", { duration: 3000 });
                    await get().fetchWarehouses();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create warehouse";
                    const hint = err?.response?.data?.hint;
                    const fullMsg = hint ? `${msg} - ${hint}` : msg;
                    set({ error: fullMsg });
                    toast.error(fullMsg, { duration: 5000 });
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
                        throw new Error("Name, location and branch name are required.");
                    }
                    const payload = {
                        name,
                        location,
                        capacity: capacity || 0,
                        branchName,
                        isActive,
                    };
                    const res = await updateWarehouseService(id, payload);
                    toast.success(res.message || "Warehouse updated successfully", { duration: 3000 });
                    await get().fetchWarehouses();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update warehouse";
                    const hint = err?.response?.data?.hint;
                    const fullMsg = hint ? `${msg} - ${hint}` : msg;
                    set({ error: fullMsg });
                    toast.error(fullMsg, { duration: 5000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteWarehouse: async (id: string) => {
                try {
                    const res = await deleteWarehouseService(id);
                    toast.success(res.message || "Warehouse deleted successfully", { duration: 3000 });
                    set((state) => ({
                        warehouses: state.warehouses.filter((w) => w._id !== id),
                        error: null,
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete warehouse";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
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