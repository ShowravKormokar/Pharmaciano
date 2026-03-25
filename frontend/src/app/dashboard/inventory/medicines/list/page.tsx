"use client";

import { useEffect, useState, useMemo } from "react";
import { useMedicineStore } from "@/store/medicine.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Pill, Search } from "lucide-react";
import Link from "next/link";
import MedicineTable from "@/components/medicine/MedicineTable";
import MedicineTableSkeleton from "@/components/medicine/MedicineTableSkeleton";
import MedicineFilter from "@/components/medicine/MedicineFilter";
import { Card, CardContent } from "@/components/ui/card";

interface Filters {
    status: string;
    prescriptionRequired: boolean | null;
    dosageForm: string;
}

export default function MedicineListPage() {
    const { medicines, fetchMedicines, loading } = useMedicineStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<Filters>({
        status: "all",
        prescriptionRequired: null,
        dosageForm: "all",
    });

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    const filteredMedicines = useMemo(() => {
        return medicines.filter((med) => {
            // Search filter
            const matchesSearch =
                !searchTerm.trim() ||
                med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                med.genericName?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // Status filter
            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (med.isActive !== isActive) return false;
            }

            // Prescription required filter
            if (filters.prescriptionRequired !== null) {
                if (med.isPrescriptionRequired !== filters.prescriptionRequired) return false;
            }

            // Dosage form filter
            if (filters.dosageForm !== "all") {
                if (med.dosageForm !== filters.dosageForm) return false;
            }

            return true;
        });
    }, [medicines, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Medicine List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all medicines, dosage forms, and pricing.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/inventory/medicines/add">
                        <Button variant="outline" size="sm">
                            <Pill className="h-4 w-4 mr-2" />
                            Create Medicine
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchMedicines} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <MedicineFilter medicines={medicines} onFilterChange={setFilters} />
            </div></CardContent>
            </Card >

            {loading ? <MedicineTableSkeleton /> : <MedicineTable medicines={filteredMedicines} />}
        </div>
    );
}