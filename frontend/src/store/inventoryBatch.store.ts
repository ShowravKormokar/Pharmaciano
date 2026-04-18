import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchInventoryBatchesService,
    fetchInventoryBatchByIdService,
    createInventoryBatchService,
    updateInventoryBatchService,
    deleteInventoryBatchService,
    FetchBatchesParams, // now correctly exported
} from "@/services/inventoryBatch.service";
import type { InventoryBatchItem } from "@/types/inventoryBatch";
import { toast } from "sonner";
import { useAuthStore } from "./auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";

interface InventoryBatchState {
    batches: InventoryBatchItem[];
    loading: boolean;
    error: string | null;
    meta: { page: number; limit: number; count: number } | null;
    total: number;
    active: number;
    expired: number;
    form: {
        medicineName: string;
        batchNo: string;
        expiryDate: string;
        quantity: number;
        purchasePrice: number;
        orgName: string;
        branchName: string;
        warehouseName: string;
        status: string;
        isActive: boolean;
    };
    fetchBatches: (params?: FetchBatchesParams) => Promise<void>;
    fetchBatchById: (id: string) => Promise<InventoryBatchItem | null>;
    createBatch: () => Promise<boolean>;
    updateBatch: (id: string) => Promise<boolean>;
    deleteBatch: (id: string) => Promise<boolean>;
    setForm: (data: Partial<InventoryBatchState["form"]>) => void;
    resetForm: () => void;
}

export const useInventoryBatchStore = create<InventoryBatchState>()(
    persist(
        (set, get) => ({
            batches: [],
            loading: false,
            error: null,
            meta: null,
            total: 0,
            active: 0,
            expired: 0,
            form: {
                medicineName: "",
                batchNo: "",
                expiryDate: "",
                quantity: 0,
                purchasePrice: 0,
                orgName: "",
                branchName: "",
                warehouseName: "",
                status: "active",
                isActive: true,
            },
            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),
            resetForm: () =>
                set({
                    form: {
                        medicineName: "",
                        batchNo: "",
                        expiryDate: "",
                        quantity: 0,
                        purchasePrice: 0,
                        orgName: "",
                        branchName: "",
                        warehouseName: "",
                        status: "active",
                        isActive: true,
                    },
                }),
            fetchBatches: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchInventoryBatchesService(params);
                    set({
                        batches: res.data,
                        meta: res.meta,
                        total: res.total,
                        active: res.active,
                        expired: res.expired,
                    });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch batches";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },
            fetchBatchById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchInventoryBatchByIdService(id);
                    return res.data.inventoryBatch;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch batch";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            createBatch: async () => {
                set({ loading: true, error: null });
                try {
                    const { medicineName, batchNo, expiryDate, quantity, purchasePrice, orgName, branchName, warehouseName, status } = get().form;
                    if (!medicineName || !batchNo || !expiryDate || !quantity || !purchasePrice) {
                        throw new Error("All fields are required");
                    }
                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);
                    const payload: any = {
                        medicineName,
                        batchNo,
                        expiryDate,
                        quantity,
                        purchasePrice,
                        warehouseName,
                        status,
                    };
                    if (isSuper) {
                        payload.organizationName = orgName;
                        payload.branchName = branchName;
                    }
                    const res = await createInventoryBatchService(payload);
                    toast.success(res.message || "Batch created successfully", { duration: 3000 });
                    await get().fetchBatches();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create batch";
                    const hint = err?.response?.data?.hint;
                    const fullMsg = hint ? `${msg} - ${hint}` : msg;
                    set({ error: fullMsg });
                    toast.error(fullMsg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            updateBatch: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { medicineName, batchNo, expiryDate, quantity, purchasePrice, orgName, branchName, warehouseName, status } = get().form;
                    if (!medicineName || !batchNo || !expiryDate || !quantity || !purchasePrice || !warehouseName) {
                        throw new Error("Medicine, batch number, expiry date, quantity, purchase price and warehouse are required");
                    }

                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);

                    const payload: any = {
                        medicineName,
                        batchNo,
                        expiryDate,
                        quantity,
                        purchasePrice,
                        warehouseName,
                        status,
                    };

                    if (isSuper) {
                        if (!orgName || !branchName) {
                            throw new Error("Organization and branch are required for super admin");
                        }
                        payload.organizationName = orgName;
                        payload.branchName = branchName;
                    }

                    const res = await updateInventoryBatchService(id, payload);
                    toast.success(res.message || "Batch updated successfully", { duration: 3000 });
                    await get().fetchBatches();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update batch";
                    const hint = err?.response?.data?.hint;
                    const fullMsg = hint ? `${msg} - ${hint}` : msg;
                    set({ error: fullMsg });
                    toast.error(fullMsg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            deleteBatch: async (id: string) => {
                try {
                    const res = await deleteInventoryBatchService(id);
                    toast.success(res.message || "Batch deleted successfully", { duration: 3000 });
                    await get().fetchBatches();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete batch";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "inventory-batch-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);