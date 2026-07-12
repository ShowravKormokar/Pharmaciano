"use client";

import { useEffect, useState, useMemo } from "react";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import CustomerTable from "@/components/customer/CustomerTable";
import CustomerTableSkeleton from "@/components/customer/CustomerTableSkeleton";
import CustomerFilter from "@/components/customer/CustomerFilter";
import { aggregateCustomers, CustomerSummary } from "@/lib/dashboardHelpers";

export default function CustomerListPage() {
    const { sales, fetchSales, loading } = useSaleStore();
    const [filters, setFilters] = useState({ name: "", phone: "", minOrders: 0 });
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);

    const loadCustomers = async () => {
        await fetchSales();
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        if (!loading && sales.length > 0) {
            const aggregated = aggregateCustomers(sales);
            setCustomers(aggregated);
        } else {
            setCustomers([]);
        }
    }, [sales, loading]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const matchesName = customer.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesPhone = customer.phone.includes(filters.phone);
            const matchesOrders = customer.totalOrders >= filters.minOrders;
            return matchesName && matchesPhone && matchesOrders;
        });
    }, [customers, filters]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Customer List</h1>
                    <p className="text-muted-foreground mt-1">
                        View all customers, their orders and spending
                    </p>
                </div>
                <Button onClick={loadCustomers} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <CustomerFilter onFilterChange={setFilters} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardDescription>
                            {filteredCustomers.length} customers found
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <CustomerTableSkeleton />
                    ) : (
                        <CustomerTable customers={filteredCustomers} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}