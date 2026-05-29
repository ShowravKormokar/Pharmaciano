import { api } from "@/lib/api";

export const downloadDatabaseBackupService = async (): Promise<Blob> => {
    const res = await api.get<Blob>("/v1/database/download", {
        responseType: "blob",
        headers: { Accept: "application/json" },
    });
    return res.data;
};