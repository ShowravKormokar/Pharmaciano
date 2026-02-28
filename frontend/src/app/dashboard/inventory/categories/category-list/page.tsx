"use client";

import { useEffect, useState, useMemo } from "react";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Tag, Search } from "lucide-react";
import Link from "next/link";
import CategoryTable from "@/components/category/CategoryTable";
import CategoryTableSkeleton from "@/components/category/CategoryTableSkeleton";
import CategoryFilter from "@/components/category/CategoryFilter";

export default function CategoryListPage() {
    const { categories, fetchCategories, loading } = useCategoryStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ status: "all" });

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            const matchesSearch =
                !searchTerm.trim() ||
                category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (category.isActive !== isActive) return false;
            }
            return true;
        });
    }, [categories, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Category List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage product categories for your inventory.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/inventory/categories/add">
                        <Button variant="outline" size="sm">
                            <Tag className="h-4 w-4 mr-2" />
                            Create Category
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchCategories} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <CategoryFilter categories={categories} onFilterChange={setFilters} />
            </div>

            {loading ? <CategoryTableSkeleton /> : <CategoryTable categories={filteredCategories} />}
        </div>
    );
}