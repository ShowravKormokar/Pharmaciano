import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchBranchesService,
    fetchBranchByIdService,
    createBranchService,
    updateBranchService,
    deleteBranchService,
} from "@/services/branch.service";
import type { BranchItem } from "@/types/branch";
import { toast } from "sonner";

interface BranchState {
    branches: BranchItem[];
    loading: boolean;
    error: string | null;
    form: {
        name: string;
        address: string;
        contact: {
            phone: string;
            email: string;
        };
        orgName: string;
        isActive: boolean;
    };
    fetchBranches: () => Promise<void>;
    fetchBranchById: (id: string) => Promise<BranchItem | null>;
    createBranch: () => Promise<boolean>;
    updateBranch: (id: string) => Promise<boolean>;
    deleteBranch: (id: string) => Promise<boolean>;
    setForm: (data: Partial<BranchState["form"]>) => void;
    resetForm: () => void;
}

export const useBranchStore = create<BranchState>()(
    persist(
        (set, get) => ({
            branches: [],
            loading: false,
            error: null,
            form: {
                name: "",
                address: "",
                contact: { phone: "", email: "" },
                orgName: "",
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
                        address: "",
                        contact: { phone: "", email: "" },
                        orgName: "",
                        isActive: true,
                    },
                }),
            fetchBranches: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchBranchesService();
                    set({ branches: res.data.branch });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch branches";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },
            fetchBranchById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchBranchByIdService(id);
                    return res.data.branch;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch branch";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            createBranch: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, address, contact, orgName } = get().form;
                    if (!name || !address || !contact.phone || !contact.email || !orgName) {
                        throw new Error("All fields are required");
                    }
                    const payload = { name, address, contact, orgName };
                    const res = await createBranchService(payload);
                    toast.success(res.message || "Branch created successfully", { duration: 3000 });
                    await get().fetchBranches();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create branch";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            updateBranch: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { name, address, contact, orgName, isActive } = get().form;
                    if (!name || !address || !contact.phone || !contact.email || !orgName) {
                        throw new Error("All fields are required");
                    }
                    const payload = { name, address, contact, orgName, isActive };
                    const res = await updateBranchService(id, payload);
                    toast.success(res.message || "Branch updated successfully", { duration: 3000 });
                    await get().fetchBranches();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update branch";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            deleteBranch: async (id: string) => {
                try {
                    const res = await deleteBranchService(id);
                    toast.success(res.message || "Branch deleted successfully", { duration: 3000 });
                    set((state) => ({
                        branches: state.branches.filter((b) => b._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete branch";
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "branch-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);