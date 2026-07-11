// lib/dashboardHelpers.ts

import { SaleItem } from "@/types/sale";
import { MedicineItem } from "@/types/medicine";
import { InventoryBatchItem } from "@/types/inventoryBatch";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";

export interface DailySales {
    date: string;
    total: number;
}

export interface BranchSales {
    branch: string;
    total: number;
}

export interface MonthlySales {
    month: string;
    total: number;
}

export interface TopProduct {
    name: string;
    quantity: number;
    revenue: number;
}

export const getTodaySales = (sales: SaleItem[]): number => {
    const today = new Date();
    return sales
        .filter(sale => new Date(sale.createdAt).toDateString() === today.toDateString())
        .reduce((sum, sale) => sum + sale.totalAmount, 0);
};

export const getTodayOrders = (sales: SaleItem[]): number => {
    const today = new Date();
    return sales.filter(sale => new Date(sale.createdAt).toDateString() === today.toDateString()).length;
};

export const getLowStockItems = (batches: InventoryBatchItem[], threshold: number = 10): InventoryBatchItem[] => {
    return batches.filter(batch => batch.quantity < threshold);
};

export const getTopProducts = (sales: SaleItem[], limit: number = 5): TopProduct[] => {
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    sales.forEach(sale => {
        sale.items.forEach(item => {
            const key = item.medicineName;
            const existing = productMap.get(key);
            if (existing) {
                existing.quantity += item.quantity;
                existing.revenue += item.sellingPrice * item.quantity;
            } else {
                productMap.set(key, { quantity: item.quantity, revenue: item.sellingPrice * item.quantity });
            }
        });
    });
    return Array.from(productMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit);
};

export const getDailySalesData = (sales: SaleItem[], days: number = 30): DailySales[] => {
    const end = new Date();
    const start = subDays(end, days - 1);
    const dateMap = new Map<string, number>();
    eachDayOfInterval({ start, end }).forEach(date => {
        dateMap.set(format(date, "yyyy-MM-dd"), 0);
    });
    sales.forEach(sale => {
        const dateKey = format(new Date(sale.createdAt), "yyyy-MM-dd");
        if (dateMap.has(dateKey)) {
            dateMap.set(dateKey, dateMap.get(dateKey)! + sale.totalAmount);
        }
    });
    return Array.from(dateMap.entries()).map(([date, total]) => ({ date, total }));
};

export const getBranchSalesData = (sales: SaleItem[]): BranchSales[] => {
    const branchMap = new Map<string, number>();
    sales.forEach(sale => {
        const branch = sale.branchId?.name || "Unknown";
        branchMap.set(branch, (branchMap.get(branch) || 0) + sale.totalAmount);
    });
    return Array.from(branchMap.entries()).map(([branch, total]) => ({ branch, total }));
};

export const getMonthlySalesData = (sales: SaleItem[], months: number = 6): MonthlySales[] => {
    const now = new Date();
    const monthMap = new Map<string, number>();
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = format(date, "MMM yyyy");
        monthMap.set(key, 0);
    }
    sales.forEach(sale => {
        const saleDate = new Date(sale.createdAt);
        const key = format(saleDate, "MMM yyyy");
        if (monthMap.has(key)) {
            monthMap.set(key, monthMap.get(key)! + sale.totalAmount);
        }
    });
    return Array.from(monthMap.entries()).map(([month, total]) => ({ month, total }));
};

export const getRecentSales = (sales: SaleItem[], limit: number = 3): SaleItem[] => {
    return [...sales]
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, limit);
};

export const getRecentBatches = (batches: InventoryBatchItem[], limit: number = 3): InventoryBatchItem[] => {
    return [...batches]
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, limit);
};

export const getRecentMedicines = (medicines: MedicineItem[], limit: number = 3): MedicineItem[] => {
    return [...medicines]
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, limit);
};

export const getHighestSaleMonth = (sales: SaleItem[]): { month: string; total: number } => {
    if (sales.length === 0) {
        return { month: "N/A", total: 250000 }; // fallback default target
    }
    const monthMap = new Map<string, number>();
    sales.forEach(sale => {
        const date = new Date(sale.createdAt);
        const key = format(date, "MMM yyyy");
        monthMap.set(key, (monthMap.get(key) || 0) + sale.totalAmount);
    });
    let maxMonth = "";
    let maxTotal = 0;
    for (const [month, total] of monthMap) {
        if (total > maxTotal) {
            maxTotal = total;
            maxMonth = month;
        }
    }
    return { month: maxMonth, total: maxTotal };
};

export const filterSalesByDateRange = (sales: SaleItem[], startDate: Date, endDate: Date): SaleItem[] => {
    return sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= startDate && saleDate <= endDate;
    });
};