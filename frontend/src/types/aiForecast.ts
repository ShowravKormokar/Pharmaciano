/**
 * Types for GET /api/v1/ai-forecasting
 *
 * IMPORTANT: The Swagger doc's "Schema" example block is stale — it shows
 * `predicted_sales_next_30_days` and `confidence`. The doc's own captured
 * "Try it out" response (the real payload) uses different field names and
 * includes an extra field the schema doesn't mention:
 *
 *   predicted_total_sales_next_30_days   (NOT predicted_sales_next_30_days)
 *   confidence_interval                  (NOT confidence)
 *   demand_status                        (NEW — "High Demand" / "Moderate Demand" / "Low Demand")
 *
 * These types follow the REAL response. If the backend later aligns with the
 * schema doc, update here first — every component reads through this file.
 */

export type ConfidenceLevel = "High" | "Medium" | "Low";
export type DemandStatus = "High Demand" | "Moderate Demand" | "Low Demand";

export interface ForecastItem {
    medicine_id: string;
    medicine_name: string;
    batch_no: string;
    current_stock: number;
    expiry_date: string; // ISO date string, e.g. "2030-02-19"
    predicted_total_sales_next_30_days: number;
    confidence_interval: ConfidenceLevel;
    demand_status: DemandStatus;
    reorder_recommendation: string;
}

export interface ForecastMeta {
    organizationId?: string; // may be an ObjectId OR the literal string "All Organizations"
    branchId?: string; // may be an ObjectId OR the literal string "All Branches"
    filterApplied: string;
    analyzedFrom: string; // ISO date
    analyzedTo: string; // ISO date
}

export interface ForecastPagination {
    totalRecords: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}

export interface ForecastApiResponse {
    success: boolean;
    pagination: ForecastPagination;
    meta: ForecastMeta;
    data: {
        forecast: ForecastItem[];
    };
}

/**
 * Filters the UI exposes. `page` / `limit` are handled internally by the
 * store (it fetches in bulk and paginates client-side — see store for why),
 * so they're intentionally omitted here.
 */
export interface ForecastFilters {
    organizationId?: string;
    branchId?: string;
    medicineName?: string;
    barcode?: string;
    fromDate?: string;
    toDate?: string;
}
