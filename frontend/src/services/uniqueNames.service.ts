import { api } from "@/lib/api";
import type { UniqueNamesResponse } from "@/types/uniqueNames";

export const fetchUniqueNamesService = async (): Promise<UniqueNamesResponse> => {
    const res = await api.get<UniqueNamesResponse>("/v1/unique-names");
    return res.data;
};