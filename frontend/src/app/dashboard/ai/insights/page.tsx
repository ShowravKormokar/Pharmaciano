"use client";

import { Brain } from "lucide-react";
import AiSectionHeader from "@/components/ai/AiSectionHeader";
import ComingSoonPanel from "@/components/ai/ComingSoonPanel";

export default function BusinessInsightsPage() {
    return (
        <div className="space-y-6 p-6">
            <AiSectionHeader
                icon={Brain}
                title="Business Insights"
                subtitle="High-level trends and opportunities across your pharmacy operations."
            />
            <ComingSoonPanel icon={Brain} title="Business Insights" />
        </div>
    );
}