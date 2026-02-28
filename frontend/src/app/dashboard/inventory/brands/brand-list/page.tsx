"use client";

import { useEffect, useState, useMemo } from "react";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Package, Search } from "lucide-react";
import Link from "next/link";
import BrandTable from "@/components/brand/BrandTable";
import BrandTableSkeleton from "@/components/brand/BrandTableSkeleton";
import BrandFilter from "@/components/brand/BrandFilter";

export default function BrandListPage() {
    const { brands, fetchBrands, loading } = useBrandStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ manufacturer: "all", country: "all", status: "all" });

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const filteredBrands = useMemo(() => {
        return brands.filter((brand) => {
            const matchesSearch =
                !searchTerm.trim() ||
                brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.country?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (filters.manufacturer !== "all" && brand.manufacturer !== filters.manufacturer) return false;
            if (filters.country !== "all" && brand.country !== filters.country) return false;
            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (brand.isActive !== isActive) return false;
            }
            return true;
        });
    }, [brands, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Brand List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage pharmaceutical brands and manufacturers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/inventory/brands/add">
                        <Button variant="outline" size="sm">
                            <Package className="h-4 w-4 mr-2" />
                            Create Brand
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchBrands} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search brands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <BrandFilter brands={brands} onFilterChange={setFilters} />
            </div>

            {loading ? <BrandTableSkeleton /> : <BrandTable brands={filteredBrands} />}
        </div>
    );
}