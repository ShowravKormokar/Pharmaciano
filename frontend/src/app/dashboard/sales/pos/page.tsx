"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, FileText } from "lucide-react";
import SalesForm from "@/components/sales/SalesForm";
import { useDraftSaleStore } from "@/store/draftSale.store";

export default function POSPage() {
    const router = useRouter();
    const { drafts, activeDraftId, createDraft, loadDraft, deleteDraft, updateCurrentDraft } = useDraftSaleStore();

    // Auto‑save the current draft every second
    useEffect(() => {
        const interval = setInterval(() => {
            updateCurrentDraft();
        }, 1000);
        return () => clearInterval(interval);
    }, [updateCurrentDraft]);

    // Save before leaving the page
    useEffect(() => {
        return () => {
            updateCurrentDraft();
        };
    }, [updateCurrentDraft]);

    // Load or create a draft on mount
    useEffect(() => {
        if (drafts.length > 0 && activeDraftId) {
            // There is an active draft persisted – load it
            loadDraft(activeDraftId);
        } else if (drafts.length > 0 && !activeDraftId) {
            // No active draft but drafts exist – load the first one
            loadDraft(drafts[0].id);
        } else if (drafts.length === 0) {
            // No drafts at all – create a new one
            createDraft();
        }
    }, [drafts, activeDraftId, loadDraft, createDraft]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Point of Sale (POS)</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            {/* Draft Tabs / Manager */}
            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={createDraft}>
                        <Plus className="h-4 w-4 mr-1" /> New Sale
                    </Button>
                    <div className="h-6 w-px bg-border mx-2" />
                    {drafts.map(draft => (
                        <div key={draft.id} className="flex items-center gap-1 bg-muted rounded-md">
                            <Button
                                variant={activeDraftId === draft.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => loadDraft(draft.id)}
                                className="rounded-r-none"
                            >
                                <FileText className="h-4 w-4 mr-1" />
                                {new Date(draft.createdAt).toLocaleTimeString()}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteDraft(draft.id)}
                                className="rounded-l-none px-2"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            <SalesForm
                onSuccess={() => {
                    if (activeDraftId) {
                        deleteDraft(activeDraftId);
                    }
                    createDraft();
                }}
            />
        </div>
    );
}