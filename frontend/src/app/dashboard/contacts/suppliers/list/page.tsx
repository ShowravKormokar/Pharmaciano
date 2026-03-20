"use client";

import { useEffect, useState, useMemo } from "react";
import { useSupplierStore } from "@/store/supplier.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Truck, Search } from "lucide-react";
import Link from "next/link";
import SupplierTable from "@/components/supplier/SupplierTable";
import SupplierTableSkeleton from "@/components/supplier/SupplierTableSkeleton";
import SupplierFilter from "@/components/supplier/SupplierFilter";

export default function SupplierListPage() {
    const { suppliers, fetchSuppliers, loading } = useSupplierStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ status: "all" });

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            const matchesSearch =
                !searchTerm.trim() ||
                supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.email?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (supplier.isActive !== isActive) return false;
            }
            return true;
        });
    }, [suppliers, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Supplier List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage suppliers and their contact details.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/contacts/suppliers/add">
                        <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Create Supplier
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchSuppliers} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <SupplierFilter onFilterChange={setFilters} />
            </div>

            {loading ? <SupplierTableSkeleton /> : <SupplierTable suppliers={filteredSuppliers} />}
        </div>
    );
}