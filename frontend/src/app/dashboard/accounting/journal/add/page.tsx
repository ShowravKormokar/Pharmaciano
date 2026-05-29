"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import JournalForm from "@/components/journal/JournalForm";
import { useJournalStore } from "@/store/journal.store";

export default function AddJournalPage() {
    const router = useRouter();
    const resetForm = useJournalStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Journal Entry</h1>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>
            <JournalForm onSuccess={() => router.push("/dashboard/accounting/journal/list")} />
        </div>
    );
}