import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchJournalsService,
    fetchJournalByIdService,
    createJournalService,
    reverseJournalService,
} from "@/services/journal.service";
import type { JournalItem, CreateJournalPayload } from "@/types/journal";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";

interface JournalState {
    journals: JournalItem[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; limit: number; total: number; count: number };
    stats: { total: number; totalReversals: number; totalUnreversals: number };
    form: {
        debitAccountId: string;
        creditAccountId: string;
        amount: number;
        referenceType: string;
        referenceId: string;
        note: string;
        organizationName: string;
        branchName: string;
    };
    fetchJournals: (params?: any) => Promise<void>;
    fetchJournalById: (id: string) => Promise<JournalItem | null>;
    createJournal: () => Promise<boolean>;
    reverseJournal: (id: string) => Promise<boolean>;
    setForm: (data: Partial<JournalState["form"]>) => void;
    resetForm: () => void;
}

export const useJournalStore = create<JournalState>()(
    persist(
        (set, get) => ({
            journals: [],
            loading: false,
            error: null,
            pagination: { page: 1, limit: 20, total: 0, count: 0 },
            stats: { total: 0, totalReversals: 0, totalUnreversals: 0 },
            form: {
                debitAccountId: "",
                creditAccountId: "",
                amount: 0,
                referenceType: "Manual",
                referenceId: "",
                note: "",
                organizationName: "",
                branchName: "",
            },
            setForm: (data) => set((state) => ({ form: { ...state.form, ...data } })),
            resetForm: () => set({
                form: {
                    debitAccountId: "",
                    creditAccountId: "",
                    amount: 0,
                    referenceType: "Manual",
                    referenceId: "",
                    note: "",
                    organizationName: "",
                    branchName: "",
                },
            }),
            fetchJournals: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchJournalsService(params);
                    set({
                        journals: res.data.journal,
                        pagination: {
                            page: res.meta.page,
                            limit: res.meta.limit,
                            total: res.total,
                            count: res.meta.count,
                        },
                        stats: {
                            total: res.total,
                            totalReversals: res.totalReversals,
                            totalUnreversals: res.totalUnreversals,
                        },
                    });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch journal entries";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },
            fetchJournalById: async (id) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchJournalByIdService(id);
                    return res.data.journal;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch journal entry";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            createJournal: async () => {
                set({ loading: true, error: null });
                try {
                    const { debitAccountId, creditAccountId, amount, referenceType, referenceId, note, organizationName, branchName } = get().form;
                    if (!debitAccountId || !creditAccountId || !amount || amount <= 0) {
                        throw new Error("Debit account, credit account, and positive amount are required");
                    }
                    if (debitAccountId === creditAccountId) {
                        throw new Error("Debit and credit accounts cannot be the same");
                    }
                    const { user } = useAuthStore.getState();
                    const isSuper = isSuperAdmin(user?.email);
                    const payload: CreateJournalPayload = { debitAccountId, creditAccountId, amount, referenceType, referenceId, note };
                    if (isSuper) {
                        if (!organizationName || !branchName) throw new Error("Organization and branch are required for super admin");
                        payload.organizationName = organizationName;
                        payload.branchName = branchName;
                    }
                    const res = await createJournalService(payload);
                    toast.success(res.message || "Journal entry created successfully", { duration: 3000 });
                    await get().fetchJournals();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create journal entry";
                    toast.error(msg, { duration: 3000 });
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            reverseJournal: async (id) => {
                set({ loading: true });
                try {
                    const res = await reverseJournalService(id);
                    toast.success(res.message || "Journal entry reversed successfully", { duration: 3000 });
                    await get().fetchJournals(); // refresh list
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to reverse journal entry";
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
        }),
        { name: "journal-store", partialize: (state) => ({ form: state.form }) }
    )
);