"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterX } from "lucide-react";
import { MedicineItem } from "@/types/medicine";

interface Filters {
    status: string;
    prescriptionRequired: boolean | null;
    dosageForm: string;
}

interface Props {
    medicines: MedicineItem[];
    onFilterChange: (filters: Filters) => void;
}

export default function MedicineFilter({ medicines, onFilterChange }: Props) {
    const [status, setStatus] = useState<string>("all");
    const [prescriptionRequired, setPrescriptionRequired] = useState<boolean | null>(null);
    const [dosageForm, setDosageForm] = useState<string>("all");

    // Extract unique dosage forms from medicines
    const dosageForms = useMemo(() => {
        const forms = medicines
            .map((m) => m.dosageForm)
            .filter((form): form is string => !!form);
        return Array.from(new Set(forms)).sort();
    }, [medicines]);

    // Notify parent when any filter changes
    useEffect(() => {
        onFilterChange({ status, prescriptionRequired, dosageForm });
    }, [status, prescriptionRequired, dosageForm, onFilterChange]);

    const clearFilters = () => {
        setStatus("all");
        setPrescriptionRequired(null);
        setDosageForm("all");
    };

    const hasFilters = status !== "all" || prescriptionRequired !== null || dosageForm !== "all";

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>

            {/* Dosage Form Filter */}
            <Select value={dosageForm} onValueChange={setDosageForm}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Dosage Forms" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Dosage Forms</SelectItem>
                    {dosageForms.map((form) => (
                        <SelectItem key={form} value={form} className="capitalize">
                            {form}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Prescription Required Filter */}
            <div className="flex items-center space-x-2 border border-gray-200 px-2 py-2.5 rounded-lg">
                <Checkbox
                    id="prescription-required"
                    checked={prescriptionRequired === true}
                    onCheckedChange={(checked) => {
                        if (checked === true) setPrescriptionRequired(true);
                        else if (checked === false) setPrescriptionRequired(null);
                        else setPrescriptionRequired(null);
                    }}
                />
                <label
                    htmlFor="prescription-required"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Prescription Required
                </label>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
}