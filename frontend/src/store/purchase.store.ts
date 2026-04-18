import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchPurchasesService,
    fetchPurchaseByIdService,
    createPurchaseService,
    updatePurchaseService,
    approvePurchaseService,
    receivePurchaseService,
    deletePurchaseService,
} from "@/services/purchase.service";
import type { PurchaseItem, CreatePurchasePayload, UpdatePurchasePayload, ReceivePurchasePayload } from "@/types/purchase";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";

interface PurchaseState {
    purchases: PurchaseItem[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; limit: number; total: number; count: number };
    stats: { pending: number; approved: number; received: number };
    form: {
        supplier: string;
        warehouseName: string;
        items: Array<{ medicineName: string; quantity: number }>;
        paymentStatus: string;
        paidAmount: number;
        discount: number;
        tax: number;
        organizationName: string;
        branchName: string;
    };
    fetchPurchases: (params?: any) => Promise<void>;
    fetchPurchaseById: (id: string) => Promise<PurchaseItem | null>;
    createPurchase: () => Promise<boolean>;
    updatePurchase: (id: string) => Promise<boolean>;
    approvePurchase: (id: string) => Promise<boolean>;
    receivePurchase: (id: string, data: ReceivePurchasePayload) => Promise<boolean>;
    deletePurchase: (id: string) => Promise<boolean>;
    setForm: (data: Partial<PurchaseState["form"]>) => void;
    resetForm: () => void;
}

export const usePurchaseStore = create<PurchaseState>()(
    persist(
        (set, get) => ({
            purchases: [],
            loading: false,
            error: null,
            pagination: { page: 1, limit: 10, total: 0, count: 0 },
            stats: { pending: 0, approved: 0, received: 0 },
            form: {
                supplier: "",
                warehouseName: "",
                items: [],
                paymentStatus: "unpaid",
                paidAmount: 0,
                discount: 0,
                tax: 0,
                organizationName: "",
                branchName: "",
            },
            setForm: (data) => set((state) => ({ form: { ...state.form, ...data } })),
            resetForm: () => set({
                form: {
                    supplier: "",
                    warehouseName: "",
                    items: [],
                    paymentStatus: "unpaid",
                    paidAmount: 0,
                    discount: 0,
                    tax: 0,
                    organizationName: "",
                    branchName: "",
                },
            }),
            fetchPurchases: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchPurchasesService(params);
                    set({
                        purchases: res.data.purchase,
                        pagination: {
                            page: res.meta.page,
                            limit: res.meta.limit,
                            total: res.total,
                            count: res.meta.count,
                        },
                        stats: {
                            pending: res.pending,
                            approved: res.approved,
                            received: res.received,
                        },
                    });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch purchases";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },
            fetchPurchaseById: async (id) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchPurchaseByIdService(id);
                    return res.data.purchase;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch purchase";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            createPurchase: async () => {
                set({ loading: true, error: null });
                try {
                    const { supplier, warehouseName, items, paymentStatus, paidAmount, organizationName, branchName } = get().form;
                    if (!supplier || !warehouseName || items.length === 0) {
                        throw new Error("Supplier, warehouse, and at least one item are required");
                    }
                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);
                    const payload: CreatePurchasePayload = { supplier, warehouseName, items, paymentStatus, paidAmount };
                    if (isSuper) {
                        if (!organizationName || !branchName) throw new Error("Organization and branch are required for super admin");
                        payload.organizationName = organizationName;
                        payload.branchName = branchName;
                    }
                    const res = await createPurchaseService(payload);
                    toast.success(res.message || "Purchase created successfully", { duration: 3000 });
                    await get().fetchPurchases();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create purchase";
                    toast.error(msg, { duration: 3000 });
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            updatePurchase: async (id) => {
                set({ loading: true, error: null });
                try {
                    const { supplier, warehouseName, items, paymentStatus, paidAmount, discount, tax, organizationName, branchName } = get().form;
                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);
                    const payload: UpdatePurchasePayload = { supplier, warehouseName, items, paymentStatus, paidAmount, discount, tax };
                    if (isSuper) {
                        payload.organizationName = organizationName;
                        payload.branchName = branchName;
                    }
                    const res = await updatePurchaseService(id, payload);
                    toast.success(res.message || "Purchase updated successfully", { duration: 3000 });
                    await get().fetchPurchases();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update purchase";
                    toast.error(msg, { duration: 3000 });
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            approvePurchase: async (id) => {
                set({ loading: true });
                try {
                    const res = await approvePurchaseService(id);
                    toast.success(res.message || "Purchase approved successfully", { duration: 3000 });
                    await get().fetchPurchases();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to approve purchase";
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            receivePurchase: async (id, data) => {
                set({ loading: true });
                try {
                    const res = await receivePurchaseService(id, data);
                    toast.success(res.message || "Purchase received and inventory updated", { duration: 3000 });
                    await get().fetchPurchases();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to receive purchase";
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            deletePurchase: async (id) => {
                try {
                    const res = await deletePurchaseService(id);
                    toast.success(res.message || "Purchase deleted successfully", { duration: 3000 });
                    await get().fetchPurchases();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete purchase";
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        { name: "purchase-store", partialize: (state) => ({ form: state.form }) }
    )
);