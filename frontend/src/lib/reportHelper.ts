import { SaleItem } from "@/types/sale";
import { PurchaseItem } from "@/types/purchase";
import { InventoryBatchItem } from "@/types/inventoryBatch";
import { MedicineItem } from "@/types/medicine";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

//  Date Filtering ─
export const filterByDateRange = <T extends { createdAt: string }>(
    items: T[],
    startDate?: string,
    endDate?: string
): T[] => {
    if (!startDate && !endDate) return items;
    const start = startDate ? dayjs(startDate).startOf('day') : null;
    const end = endDate ? dayjs(endDate).endOf('day') : null;
    return items.filter(item => {
        const date = dayjs(item.createdAt);
        if (start && end) return date.isBetween(start, end, null, '[]');
        if (start) return date.isAfter(start) || date.isSame(start);
        if (end) return date.isBefore(end) || date.isSame(end);
        return true;
    });
};

//  Sales Report ─
export interface SalesReportData {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    salesByDate: { date: string; total: number; orders: number }[];
    topProducts: { name: string; quantity: number; revenue: number }[];
    paymentMethodBreakdown: { method: string; total: number }[];
}

export const computeSalesReport = (
    sales: SaleItem[],
    startDate?: string,
    endDate?: string
): SalesReportData => {
    const filtered = filterByDateRange(sales, startDate, endDate);
    if (filtered.length === 0) {
        return {
            totalSales: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            salesByDate: [],
            topProducts: [],
            paymentMethodBreakdown: [],
        };
    }

    const totalSales = filtered.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalOrders = filtered.length;
    const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Group by date
    const dateMap = new Map<string, { total: number; orders: number }>();
    filtered.forEach(s => {
        const key = dayjs(s.createdAt).format("YYYY-MM-DD");
        const existing = dateMap.get(key) || { total: 0, orders: 0 };
        existing.total += s.totalAmount;
        existing.orders += 1;
        dateMap.set(key, existing);
    });
    const salesByDate = Array.from(dateMap.entries()).map(([date, data]) => ({
        date,
        total: data.total,
        orders: data.orders,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Top products
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    filtered.forEach(sale => {
        sale.items.forEach(item => {
            const key = item.medicineName;
            const existing = productMap.get(key) || { quantity: 0, revenue: 0 };
            existing.quantity += item.quantity;
            existing.revenue += item.sellingPrice * item.quantity;
            productMap.set(key, existing);
        });
    });
    const topProducts = Array.from(productMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // Payment method breakdown
    const paymentMap = new Map<string, number>();
    filtered.forEach(sale => {
        let method: string = 'unknown';
        if (typeof sale.paymentMethod === 'string') {
            method = sale.paymentMethod;
        } else if (sale.paymentMethod && typeof sale.paymentMethod === 'object' && 'type' in sale.paymentMethod) {
            method = (sale.paymentMethod as any).type;
        }
        paymentMap.set(method, (paymentMap.get(method) || 0) + sale.totalAmount);
    });
    const paymentMethodBreakdown = Array.from(paymentMap.entries())
        .map(([method, total]) => ({ method, total }))
        .sort((a, b) => b.total - a.total);

    return { totalSales, totalOrders, averageOrderValue: avgOrder, salesByDate, topProducts, paymentMethodBreakdown };
};

//  Purchase Report 
export interface PurchaseReportData {
    totalPurchases: number;
    totalOrders: number;
    averageOrderValue: number;
    purchasesByDate: { date: string; total: number; orders: number }[];
    topSuppliers: { name: string; total: number }[];
    paymentStatusBreakdown: { status: string; total: number }[];
}

export const computePurchaseReport = (
    purchases: PurchaseItem[],
    startDate?: string,
    endDate?: string
): PurchaseReportData => {
    const filtered = filterByDateRange(purchases, startDate, endDate);
    if (filtered.length === 0) {
        return {
            totalPurchases: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            purchasesByDate: [],
            topSuppliers: [],
            paymentStatusBreakdown: [],
        };
    }

    const totalPurchases = filtered.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalOrders = filtered.length;
    const avgOrder = totalOrders > 0 ? totalPurchases / totalOrders : 0;

    // Group by date
    const dateMap = new Map<string, { total: number; orders: number }>();
    filtered.forEach(p => {
        const key = dayjs(p.createdAt).format("YYYY-MM-DD");
        const existing = dateMap.get(key) || { total: 0, orders: 0 };
        existing.total += p.totalAmount;
        existing.orders += 1;
        dateMap.set(key, existing);
    });
    const purchasesByDate = Array.from(dateMap.entries())
        .map(([date, data]) => ({ date, total: data.total, orders: data.orders }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Top suppliers
    const supplierMap = new Map<string, number>();
    filtered.forEach(p => {
        const name = p.supplierId?.name || 'Unknown';
        supplierMap.set(name, (supplierMap.get(name) || 0) + p.totalAmount);
    });
    const topSuppliers = Array.from(supplierMap.entries())
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    // Payment status breakdown
    const statusMap = new Map<string, number>();
    filtered.forEach(p => {
        const status = p.paymentStatus || 'unknown';
        statusMap.set(status, (statusMap.get(status) || 0) + p.totalAmount);
    });
    const paymentStatusBreakdown = Array.from(statusMap.entries())
        .map(([status, total]) => ({ status, total }))
        .sort((a, b) => b.total - a.total);

    return { totalPurchases, totalOrders, averageOrderValue: avgOrder, purchasesByDate, topSuppliers, paymentStatusBreakdown };
};

//  Inventory Valuation 
export interface InventoryValuationData {
    totalItems: number;
    totalValue: number; // valuation based on purchase price * quantity
    totalSellingValue: number; // using selling price if available
    categories: { category: string; count: number; value: number }[];
    brands: { brand: string; count: number; value: number }[];
    valuationByBatch: { batchNo: string; medicineName: string; quantity: number; value: number }[];
}

export const computeInventoryValuation = (
    batches: InventoryBatchItem[],
    medicines: MedicineItem[]
): InventoryValuationData => {
    // Build a map of medicine name -> unit price (use unitPrice from medicine, fallback to batch purchasePrice)
    const medicinePriceMap = new Map<string, number>();
    medicines.forEach(m => {
        medicinePriceMap.set(m.name, m.unitPrice || 0);
    });

    let totalValue = 0;
    let totalSellingValue = 0;
    const categoryMap = new Map<string, { count: number; value: number }>();
    const brandMap = new Map<string, { count: number; value: number }>();
    const batchDetails: InventoryValuationData['valuationByBatch'] = [];

    batches.forEach(batch => {
        // Get medicine name
        let medicineName = "Unknown";
        if (batch.medicineId && typeof batch.medicineId === 'object' && batch.medicineId.name) {
            medicineName = batch.medicineId.name;
        } else if (batch.medicineId?.name) {
            medicineName = batch.medicineId?.name;
        }

        const purchasePrice = batch.purchasePrice || 0;
        const sellingPrice = medicinePriceMap.get(medicineName) || 0;
        const value = purchasePrice * batch.quantity;
        const sellValue = sellingPrice * batch.quantity;

        totalValue += value;
        totalSellingValue += sellValue;

        // Category (if available from medicine)
        // We don't have category in batch, we'll need to look up medicine by name
        // For simplicity, we'll leave category and brand for now if we have them.
        // We'll need to cross-reference with medicines list.
        // For now, we'll skip category/brand grouping if we don't have the data.

        batchDetails.push({
            batchNo: batch.batchNo,
            medicineName,
            quantity: batch.quantity,
            value,
        });
    });

    // We'll compute category and brand from medicines (requires lookup by name)
    // This is a placeholder; in a real scenario, you'd cross-reference with medicineId.
    // For simplicity, we'll leave them empty.
    return {
        totalItems: batches.length,
        totalValue,
        totalSellingValue,
        categories: [],
        brands: [],
        valuationByBatch: batchDetails,
    };
};

//  Profit & Loss
export interface ProfitLossData {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    incomeBreakdown: { source: string; amount: number }[];
    expenseBreakdown: { source: string; amount: number }[];
    monthlyTrend: { month: string; income: number; expenses: number; profit: number }[];
}

export const computeProfitLoss = (
    sales: SaleItem[],
    purchases: PurchaseItem[],
    startDate?: string,
    endDate?: string
): ProfitLossData => {
    const filteredSales = filterByDateRange(sales, startDate, endDate);
    const filteredPurchases = filterByDateRange(purchases, startDate, endDate);

    const totalIncome = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = filteredPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const netProfit = totalIncome - totalExpenses;

    // Income breakdown by payment method (as source)
    const incomeMap = new Map<string, number>();
    filteredSales.forEach(s => {
        let method = 'sale';
        if (typeof s.paymentMethod === 'string') {
            method = s.paymentMethod;
        } else if (s.paymentMethod && typeof s.paymentMethod === 'object' && 'type' in s.paymentMethod) {
            method = (s.paymentMethod as any).type;
        }
        incomeMap.set(method, (incomeMap.get(method) || 0) + s.totalAmount);
    });
    const incomeBreakdown = Array.from(incomeMap.entries())
        .map(([source, amount]) => ({ source, amount }))
        .sort((a, b) => b.amount - a.amount);

    // Expense breakdown by supplier (or purchase status)
    const expenseMap = new Map<string, number>();
    filteredPurchases.forEach(p => {
        const source = p.supplierId?.name || 'purchase';
        expenseMap.set(source, (expenseMap.get(source) || 0) + p.totalAmount);
    });
    const expenseBreakdown = Array.from(expenseMap.entries())
        .map(([source, amount]) => ({ source, amount }))
        .sort((a, b) => b.amount - a.amount);

    // Monthly trend (combine sales and purchases by month)
    const monthMap = new Map<string, { income: number; expenses: number }>();

    filteredSales.forEach(item => {
        const key = dayjs(item.createdAt).format("MMM YYYY");
        const existing = monthMap.get(key) || { income: 0, expenses: 0 };
        existing.income += item.totalAmount;
        monthMap.set(key, existing);
    });

    filteredPurchases.forEach(item => {
        const key = dayjs(item.createdAt).format("MMM YYYY");
        const existing = monthMap.get(key) || { income: 0, expenses: 0 };
        existing.expenses += item.totalAmount;
        monthMap.set(key, existing);
    });
    const monthlyTrend = Array.from(monthMap.entries())
        .map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses,
            profit: data.income - data.expenses,
        }))
        .sort((a, b) => {
            // Sort by month
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const [m1, y1] = a.month.split(' ');
            const [m2, y2] = b.month.split(' ');
            if (y1 !== y2) return parseInt(y1) - parseInt(y2);
            return months.indexOf(m1) - months.indexOf(m2);
        });

    return {
        totalIncome,
        totalExpenses,
        netProfit,
        incomeBreakdown,
        expenseBreakdown,
        monthlyTrend,
    };
};

export interface SalesOverview {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
}

export interface PurchaseOverview {
    totalSpent: number;
    totalOrders: number;
    averageOrderValue: number;
}

export interface InventoryOverview {
    totalItems: number;
    totalValue: number;
}

export interface ProfitLossOverview {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
}

export const getSalesOverview = (sales: SaleItem[]): SalesOverview => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalOrders = sales.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, averageOrderValue: avgOrder };
};

export const getPurchaseOverview = (purchases: PurchaseItem[]): PurchaseOverview => {
    const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalOrders = purchases.length;
    const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
    return { totalSpent, totalOrders, averageOrderValue: avgOrder };
};

export const getInventoryOverview = (batches: InventoryBatchItem[]): InventoryOverview => {
    const totalItems = batches.length;
    const totalValue = batches.reduce((sum, b) => sum + (b.purchasePrice || 0) * b.quantity, 0);
    return { totalItems, totalValue };
};

export const getProfitLossOverview = (sales: SaleItem[], purchases: PurchaseItem[]): ProfitLossOverview => {
    const totalIncome = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    return { totalIncome, totalExpenses, netProfit: totalIncome - totalExpenses };
};