import { api } from "@/lib/api";
import type { ForecastApiResponse, ForecastFilters } from "@/types/aiForecast";

interface RawParams extends ForecastFilters {
    page: number;
    limit: number;
}

export const fetchForecastService = async (
    params: RawParams,
    signal?: AbortSignal
): Promise<ForecastApiResponse> => {
    const res = await api.get<ForecastApiResponse>("/v1/ai-forecasting", {
        params,
        signal,
    } as any);
    return res.data;
};