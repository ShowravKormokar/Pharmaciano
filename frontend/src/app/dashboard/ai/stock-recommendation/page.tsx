"use client";

import { Activity } from "lucide-react";
import AiSectionHeader from "@/components/ai/AiSectionHeader";
import ComingSoonPanel from "@/components/ai/ComingSoonPanel";

export default function StockRecommendationPage() {
    return (
        <div className="space-y-6 p-6">
            <AiSectionHeader
                icon={Activity}
                title="Stock Recommendations"
                subtitle="AI-driven restocking guidance across your inventory."
            />
            <ComingSoonPanel icon={Activity} title="Stock Recommendations" />
        </div>
    );
}