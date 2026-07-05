import { api } from "@/lib/api";
import type { ForecastApiResponse, ForecastFilters } from "@/types/aiForecast";

export const fetchForecastService = async (params: ForecastFilters): Promise<ForecastApiResponse> => {
    const res = await api.get<ForecastApiResponse>("/v1/ai-forecasting", { params });
    return res.data;
};