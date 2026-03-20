import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchSuppliersService,
    fetchSupplierByIdService,
    createSupplierService,
    updateSupplierService,
    deleteSupplierService,
} from "@/services/supplier.service";
import type { SupplierItem } from "@/types/supplier";
import { toast } from "sonner";

interface SupplierState {
    suppliers: SupplierItem[];
    loading: boolean;
    error: string | null;

    form: {
        name: string;
        contactPerson: string;
        phone: string;
        email: string;
        address: string;
        isActive: boolean;
    };

    fetchSuppliers: () => Promise<void>;
    fetchSupplierById: (id: string) => Promise<SupplierItem | null>;
    createSupplier: () => Promise<boolean>;
    updateSupplier: (id: string) => Promise<boolean>;
    deleteSupplier: (id: string) => Promise<boolean>;
    setForm: (data: Partial<SupplierState["form"]>) => void;
    resetForm: () => void;
}

export const useSupplierStore = create<SupplierState>()(
    persist(
        (set, get) => ({
            suppliers: [],
            loading: false,
            error: null,

            form: {
                name: "",
                contactPerson: "",
                phone: "",
                email: "",
                address: "",
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
                        contactPerson: "",
                        phone: "",
                        email: "",
                        address: "",
                        isActive: true,
                    },
                }),

            fetchSuppliers: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchSuppliersService();
                    set({ suppliers: res.data.supplier });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch suppliers";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            fetchSupplierById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchSupplierByIdService(id);
                    return res.data.supplier;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch supplier";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            createSupplier: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, contactPerson, phone, email, address, isActive } = get().form;
                    if (!name) {
                        throw new Error("Supplier name is required");
                    }
                    const payload = { name, contactPerson, phone, email, address, isActive };
                    const res = await createSupplierService(payload);
                    toast.success(res.message || "Supplier created successfully", { duration: 3000 });
                    await get().fetchSuppliers();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create supplier";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateSupplier: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { name, contactPerson, phone, email, address, isActive } = get().form;
                    if (!name) {
                        throw new Error("Supplier name is required");
                    }
                    const payload = { name, contactPerson, phone, email, address, isActive };
                    const res = await updateSupplierService(id, payload);
                    toast.success(res.message || "Supplier updated successfully", { duration: 3000 });
                    await get().fetchSuppliers();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update supplier";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteSupplier: async (id: string) => {
                try {
                    const res = await deleteSupplierService(id);
                    toast.success(res.message || "Supplier deleted successfully", { duration: 3000 });
                    set((state) => ({
                        suppliers: state.suppliers.filter((s) => s._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete supplier";
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "supplier-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);