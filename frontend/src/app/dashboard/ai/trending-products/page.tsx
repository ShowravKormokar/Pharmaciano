"use client";

import { TrendingUp } from "lucide-react";
import AiSectionHeader from "@/components/ai/AiSectionHeader";
import ComingSoonPanel from "@/components/ai/ComingSoonPanel";

export default function TrendingProductsPage() {
    return (
        <div className="space-y-6 p-6">
            <AiSectionHeader
                icon={TrendingUp}
                title="Trending Products"
                subtitle="Medicines gaining or losing momentum across your branches."
            />
            <ComingSoonPanel icon={TrendingUp} title="Trending Products" />
        </div>
    );
}