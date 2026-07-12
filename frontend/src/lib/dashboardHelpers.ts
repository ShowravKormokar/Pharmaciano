import { SaleItem } from "@/types/sale";
import { MedicineItem } from "@/types/medicine";
import { InventoryBatchItem } from "@/types/inventoryBatch";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

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

export interface ExpiryAlert {
    medicineName: string;
    batchNo: string;
    expiryDate: string;
    quantity: number;
    status: 'expired' | 'expiring_soon' | 'ok';
}

export interface CustomerSummary {
    name: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
}

export const getTodaySales = (sales: SaleItem[]): number => {
    const today = dayjs().startOf('day');
    return sales
        .filter(sale => dayjs(sale.createdAt).isSame(today, 'day'))
        .reduce((sum, sale) => sum + sale.totalAmount, 0);
};

export const getTodayOrders = (sales: SaleItem[]): number => {
    const today = dayjs().startOf('day');
    return sales.filter(sale => dayjs(sale.createdAt).isSame(today, 'day')).length;
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
    const end = dayjs();
    const start = end.subtract(days - 1, 'day');
    const dateMap = new Map<string, number>();
    let current = start;
    while (current.isSameOrBefore(end)) {
        dateMap.set(current.format("YYYY-MM-DD"), 0);
        current = current.add(1, 'day');
    }
    sales.forEach(sale => {
        const dateKey = dayjs(sale.createdAt).format("YYYY-MM-DD");
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
    const now = dayjs();
    const monthMap = new Map<string, number>();
    for (let i = months - 1; i >= 0; i--) {
        const date = now.subtract(i, 'month').startOf('month');
        const key = date.format("MMM YYYY");
        monthMap.set(key, 0);
    }
    sales.forEach(sale => {
        const saleDate = dayjs(sale.createdAt);
        const key = saleDate.format("MMM YYYY");
        if (monthMap.has(key)) {
            monthMap.set(key, monthMap.get(key)! + sale.totalAmount);
        }
    });
    return Array.from(monthMap.entries()).map(([month, total]) => ({ month, total }));
};

export const getRecentSales = (sales: SaleItem[], limit: number = 3): SaleItem[] => {
    return [...sales]
        .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
        .slice(0, limit);
};

export const getRecentBatches = (batches: InventoryBatchItem[], limit: number = 3): InventoryBatchItem[] => {
    return [...batches]
        .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
        .slice(0, limit);
};

export const getRecentMedicines = (medicines: MedicineItem[], limit: number = 3): MedicineItem[] => {
    return [...medicines]
        .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
        .slice(0, limit);
};

export const getHighestSaleMonth = (sales: SaleItem[]): { month: string; total: number } => {
    if (sales.length === 0) {
        return { month: "N/A", total: 250000 };
    }
    const monthMap = new Map<string, number>();
    sales.forEach(sale => {
        const date = dayjs(sale.createdAt);
        const key = date.format("MMM YYYY");
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
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return sales.filter(sale => {
        const saleDate = dayjs(sale.createdAt);
        return saleDate.isBetween(start, end, null, '[]');
    });
};

export const getExpiryAlerts = (
    batches: InventoryBatchItem[],
    thresholdDays: number = 30
): { expired: ExpiryAlert[]; expiringSoon: ExpiryAlert[] } => {
    const now = dayjs();
    const expired: ExpiryAlert[] = [];
    const expiringSoon: ExpiryAlert[] = [];

    batches.forEach(batch => {
        if (!batch.expiryDate) return;
        const expiry = dayjs(batch.expiryDate);
        const daysUntilExpiry = expiry.diff(now, 'day');

        // Get medicine name safely
        let medicineName = "Unknown";
        if (batch.medicineId && typeof batch.medicineId === 'object' && batch.medicineId.name) {
            medicineName = batch.medicineId.name;
        } else if (batch.medicineId?.name) {
            medicineName = batch.medicineId?.name;
        }

        const alert: ExpiryAlert = {
            medicineName,
            batchNo: batch.batchNo,
            expiryDate: batch.expiryDate,
            quantity: batch.quantity,
            status: 'ok',
        };

        if (daysUntilExpiry < 0) {
            alert.status = 'expired';
            expired.push(alert);
        } else if (daysUntilExpiry <= thresholdDays) {
            alert.status = 'expiring_soon';
            expiringSoon.push(alert);
        }
    });

    // Sort: most urgent first (shortest days left for expiringSoon, oldest expired first)
    expired.sort((a, b) => dayjs(a.expiryDate).valueOf() - dayjs(b.expiryDate).valueOf());
    expiringSoon.sort((a, b) => dayjs(a.expiryDate).valueOf() - dayjs(b.expiryDate).valueOf());

    return { expired, expiringSoon };
};

export const aggregateCustomers = (sales: SaleItem[]): CustomerSummary[] => {
    const customerMap = new Map<string, CustomerSummary>();

    sales.forEach(sale => {
        // Use phone as primary key, fallback to name
        const key = sale.customerPhone || sale.customerName || 'unknown';
        if (!customerMap.has(key)) {
            customerMap.set(key, {
                name: sale.customerName || 'Unknown',
                phone: sale.customerPhone || '',
                totalOrders: 0,
                totalSpent: 0,
            });
        }
        const customer = customerMap.get(key)!;
        customer.totalOrders += 1;
        customer.totalSpent += sale.totalAmount;
    });

    return Array.from(customerMap.values());
};