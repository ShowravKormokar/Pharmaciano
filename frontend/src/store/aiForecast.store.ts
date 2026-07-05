import { create } from "zustand";
import { fetchForecastService } from "@/services/aiForecast.service";
import type { ForecastItem, ForecastMeta, ForecastFilters, ForecastApiResponse } from "@/types/aiForecast";
import { toast } from "sonner";

interface ForecastState {
    forecasts: ForecastItem[];
    meta: ForecastMeta | null;
    pagination: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
    loading: boolean;
    error: string | null;
    filters: ForecastFilters;
    fetchForecast: (filters?: ForecastFilters) => Promise<void>;
    setFilters: (filters: Partial<ForecastFilters>) => void;
    resetFilters: () => void;
}

const defaultFilters: ForecastFilters = {
    page: 1,
    limit: 10,
    fromDate: undefined,
    toDate: undefined,
    medicineName: undefined,
    barcode: undefined,
    organizationId: undefined,
    branchId: undefined,
};

export const useForecastStore = create<ForecastState>((set, get) => ({
    forecasts: [],
    meta: null,
    pagination: { totalRecords: 0, currentPage: 1, limit: 10, totalPages: 0 },
    loading: false,
    error: null,
    filters: { ...defaultFilters },

    fetchForecast: async (filters) => {
        set({ loading: true, error: null });
        try {
            const params = { ...get().filters, ...filters };
            const res = await fetchForecastService(params);
            set({
                forecasts: res.data.forecast,
                meta: res.meta,
                pagination: {
                    totalRecords: res.pagination.totalRecords,
                    currentPage: res.pagination.currentPage,
                    limit: res.pagination.limit,
                    totalPages: res.pagination.totalPages,
                },
                filters: params,
            });
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to fetch forecast";
            set({ error: msg });
            toast.error(msg);
        } finally {
            set({ loading: false });
        }
    },

    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
        }));
    },

    resetFilters: () => {
        set({ filters: { ...defaultFilters } });
    },
}));