"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJournalStore } from "@/store/journal.store";
import { Button } from "@/components/ui/button";
import JournalView from "@/components/journal/JournalView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewJournalPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchJournalById } = useJournalStore();
    const [journal, setJournal] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid ID");
                setLoading(false);
                return;
            }
            const data = await fetchJournalById(id);
            if (data) setJournal(data);
            else setError("Journal entry not found");
            setLoading(false);
        };
        load();
    }, [id, fetchJournalById]);

    if (loading) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-6"><p className="text-red-500">{error}</p><Button onClick={() => router.back()}>Go Back</Button></div>;
    return <div className="p-6"><JournalView journal={journal} /></div>;
}