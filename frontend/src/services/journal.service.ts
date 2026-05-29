import { api } from "@/lib/api";
import type {
    JournalsApiResponse,
    JournalApiResponse,
    BasicApiResponse,
    CreateJournalPayload,
} from "@/types/journal";

export const fetchJournalsService = async (params?: {
    page?: number;
    limit?: number;
    referenceType?: string;
    isReversed?: boolean;
    fromDate?: string;
    toDate?: string;
}): Promise<JournalsApiResponse> => {
    const res = await api.get<JournalsApiResponse>("/v1/journal-entries", { params });
    return res.data;
};

export const fetchJournalByIdService = async (id: string): Promise<JournalApiResponse> => {
    const res = await api.get<JournalApiResponse>(`/v1/journal-entries/${id}`);
    return res.data;
};

export const createJournalService = async (data: CreateJournalPayload): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>("/v1/journal-entries", data);
    return res.data;
};

export const reverseJournalService = async (id: string): Promise<BasicApiResponse> => {
    const res = await api.post<BasicApiResponse>(`/v1/journal-entries/${id}/reverse`);
    return res.data;
};