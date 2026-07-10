import { create } from "zustand";
import { fetchForecastService } from "@/services/aiForecast.service";
import type { ForecastItem, ForecastMeta, ForecastFilters } from "@/types/aiForecast";
import { toast } from "sonner";

// The API paginates server-side (page/limit). Business insights and charts
// need the FULL filtered dataset, not just one page, so the store fetches
// in chunks of BULK_PAGE_SIZE and stitches them together, capped at
// MAX_BULK_PAGES as a safety valve. Real datasets here are small
// (tens of batches per org), so this comfortably covers normal use while
// staying well clear of runaway requests. The table itself then paginates
// this already-fetched array client-side — instant page turns, no re-fetch.
const BULK_PAGE_SIZE = 50;
const MAX_BULK_PAGES = 10; // up to 500 records per filter set

export type ForecastErrorType = "not_found" | "server_error" | null;

interface ForecastState {
    allForecasts: ForecastItem[];
    meta: ForecastMeta | null;
    totalRecords: number;
    truncated: boolean;
    loading: boolean;
    errorType: ForecastErrorType;
    errorMessage: string | null;
    lastUpdated: Date | null;
    filters: ForecastFilters;
    clientPage: number;
    clientPageSize: number;

    fetchForecast: (filters?: Partial<ForecastFilters>) => Promise<void>;
    setClientPage: (page: number) => void;
    setClientPageSize: (size: number) => void;
    resetFilters: () => void;
}

const defaultFilters: ForecastFilters = {
    medicineName: undefined,
    barcode: undefined,
    fromDate: undefined,
    toDate: undefined,
    organizationId: undefined,
    branchId: undefined,
};

// Module-level so a new fetch can abort a still-in-flight previous one,
// preventing an older, slower response from overwriting newer state.
let activeController: AbortController | null = null;

export const useForecastStore = create<ForecastState>((set, get) => ({
    allForecasts: [],
    meta: null,
    totalRecords: 0,
    truncated: false,
    loading: false,
    errorType: null,
    errorMessage: null,
    lastUpdated: null,
    filters: { ...defaultFilters },
    clientPage: 1,
    clientPageSize: 10,

    fetchForecast: async (filters) => {
        activeController?.abort();
        const controller = new AbortController();
        activeController = controller;

        const nextFilters = { ...get().filters, ...filters };
        set({
            loading: true,
            errorType: null,
            errorMessage: null,
            filters: nextFilters,
            clientPage: 1,
        });

        try {
            const first = await fetchForecastService(
                { ...nextFilters, page: 1, limit: BULK_PAGE_SIZE },
                controller.signal
            );
            const totalPages = first.pagination.totalPages;
            const items: ForecastItem[] = [...first.data.forecast];

            const pagesToFetch = Math.min(totalPages, MAX_BULK_PAGES);
            if (pagesToFetch > 1) {
                const requests = [];
                for (let p = 2; p <= pagesToFetch; p++) {
                    requests.push(
                        fetchForecastService({ ...nextFilters, page: p, limit: BULK_PAGE_SIZE }, controller.signal)
                    );
                }
                const rest = await Promise.all(requests);
                rest.forEach((r) => items.push(...r.data.forecast));
            }

            if (controller.signal.aborted) return;

            set({
                allForecasts: items,
                meta: first.meta,
                totalRecords: first.pagination.totalRecords,
                truncated: totalPages > MAX_BULK_PAGES,
                loading: false,
                lastUpdated: new Date(),
            });
        } catch (err: any) {
            if (controller.signal.aborted || err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
                return; // a newer request superseded this one — ignore silently
            }

            const status = err?.response?.status;
            if (status === 404) {
                set({
                    allForecasts: [],
                    totalRecords: 0,
                    loading: false,
                    errorType: "not_found",
                    errorMessage:
                        err?.response?.data?.message || "No sales history found for the selected filters.",
                });
            } else {
                const msg = err?.response?.data?.message || "Failed to generate forecast. Please try again.";
                set({ loading: false, errorType: "server_error", errorMessage: msg });
                toast.error(msg);
            }
        }
    },

    setClientPage: (page) => set({ clientPage: page }),
    setClientPageSize: (size) => set({ clientPageSize: size, clientPage: 1 }),

    resetFilters: () => set({ filters: { ...defaultFilters } }),
}));
