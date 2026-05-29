import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchAccountsService,
    fetchAccountByIdService,
    createAccountService,
    updateAccountService,
    deleteAccountService,
} from "@/services/account.service";
import type { AccountItem, CreateAccountPayload, UpdateAccountPayload } from "@/types/account";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";

interface AccountState {
    accounts: AccountItem[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; limit: number; total: number; count: number };
    stats: { total: number; active: number; inActive: number };
    form: {
        name: string;
        type: string;
        code: string;
        isActive: boolean;
        organizationName: string;
    };
    fetchAccounts: (params?: any) => Promise<void>;
    fetchAccountById: (id: string) => Promise<AccountItem | null>;
    createAccount: () => Promise<boolean>;
    updateAccount: (id: string) => Promise<boolean>;
    deleteAccount: (id: string) => Promise<boolean>;
    setForm: (data: Partial<AccountState["form"]>) => void;
    resetForm: () => void;
}

export const useAccountStore = create<AccountState>()(
    persist(
        (set, get) => ({
            accounts: [],
            loading: false,
            error: null,
            pagination: { page: 1, limit: 10, total: 0, count: 0 },
            stats: { total: 0, active: 0, inActive: 0 },
            form: {
                name: "",
                type: "asset",
                code: "",
                isActive: true,
                organizationName: "",
            },
            setForm: (data) => set((state) => ({ form: { ...state.form, ...data } })),
            resetForm: () => set({
                form: {
                    name: "",
                    type: "asset",
                    code: "",
                    isActive: true,
                    organizationName: "",
                },
            }),
            fetchAccounts: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchAccountsService(params);
                    set({
                        accounts: res.data.accounts,
                        pagination: {
                            page: res.meta.page,
                            limit: res.meta.limit,
                            total: res.total,
                            count: res.meta.count,
                        },
                        stats: {
                            total: res.total,
                            active: res.active,
                            inActive: res.inActive,
                        },
                    });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch accounts";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },
            fetchAccountById: async (id) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchAccountByIdService(id);
                    return res.data.account;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch account";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            createAccount: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, type, code, isActive, organizationName } = get().form;
                    if (!name || !type || !code) {
                        throw new Error("Name, type, and code are required");
                    }
                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);
                    const payload: CreateAccountPayload = { name, type, code, isActive };
                    if (isSuper) {
                        if (!organizationName) throw new Error("Organization name is required for super admin");
                        payload.organizationName = organizationName;
                    }
                    const res = await createAccountService(payload);
                    toast.success(res.message || "Account created successfully", { duration: 3000 });
                    await get().fetchAccounts();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create account";
                    toast.error(msg, { duration: 3000 });
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            updateAccount: async (id) => {
                set({ loading: true, error: null });
                try {
                    const { name, type, code, isActive, organizationName } = get().form;
                    if (!name || !type || !code) {
                        throw new Error("Name, type, and code are required");
                    }
                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);
                    const payload: UpdateAccountPayload = { name, type, code, isActive };
                    if (isSuper && organizationName) {
                        payload.organizationName = organizationName;
                    }
                    const res = await updateAccountService(id, payload);
                    toast.success(res.message || "Account updated successfully", { duration: 3000 });
                    await get().fetchAccounts();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update account";
                    toast.error(msg, { duration: 3000 });
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            deleteAccount: async (id) => {
                try {
                    const res = await deleteAccountService(id);
                    toast.success(res.message || "Account deleted successfully", { duration: 3000 });
                    await get().fetchAccounts();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete account";
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        { name: "account-store", partialize: (state) => ({ form: state.form }) }
    )
);