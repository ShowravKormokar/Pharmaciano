export interface ForecastItem {
    medicine_id: string;
    medicine_name: string;
    batch_no: string;
    predicted_sales_next_30_days: number;
    current_stock: number;
    expiry_date: string;
    reorder_recommendation: string;
    confidence: 'High' | 'Medium' | 'Low';
}

export interface ForecastMeta {
    organizationId?: string;
    branchId?: string;
    filterApplied: string;
    analyzedFrom: string;
    analyzedTo: string;
}

export interface ForecastApiResponse {
    success: boolean;
    pagination: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
    meta: ForecastMeta;
    data: {
        forecast: ForecastItem[];
    };
}

export interface ForecastFilters {
    organizationId?: string;
    branchId?: string;
    medicineName?: string;
    barcode?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}