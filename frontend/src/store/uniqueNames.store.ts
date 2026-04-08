import { create } from "zustand";
import { fetchUniqueNamesService } from "@/services/uniqueNames.service";
import type { UniqueNamesData } from "@/types/uniqueNames";
import { toast } from "sonner";

interface UniqueNamesState {
    data: UniqueNamesData | null;
    loading: boolean;
    error: string | null;
    fetchUniqueNames: () => Promise<void>;
    getMedicineNames: () => string[];
    getCategoryNames: () => string[];
    getBrandNames: () => string[];
    getBatchNumbers: () => string[];
    getOrganizationNames: () => string[];
    getBranchNames: () => string[];
    getRoleNames: () => string[];
}

export const useUniqueNamesStore = create<UniqueNamesState>((set, get) => ({
    data: null,
    loading: false,
    error: null,

    fetchUniqueNames: async () => {
        // Prevent multiple simultaneous calls
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
            const res = await fetchUniqueNamesService();
            set({ data: res.data, loading: false });
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || "Failed to fetch unique names";
            set({ error: errorMsg, loading: false });
            toast.error(errorMsg, { duration: 3000 });
        }
    },

    // Helper selectors (return empty array if data not loaded)
    getMedicineNames: () => get().data?.medicineName ?? [],
    getCategoryNames: () => get().data?.categoryName ?? [],
    getBrandNames: () => get().data?.brandName ?? [],
    getBatchNumbers: () => get().data?.batchNo ?? [],
    getOrganizationNames: () => get().data?.organizationName ?? [],
    getBranchNames: () => get().data?.branchName ?? [],
    getRoleNames: () => get().data?.roleName ?? [],
}));