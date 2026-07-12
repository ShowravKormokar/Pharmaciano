// lib/exportHelpers.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

// ─── Shared ──────────────────────────────────────────────────────
export const getExportHeader = () => {
    const orgName = typeof window !== 'undefined' ? localStorage.getItem('organizationName') || 'Pharmaciano' : 'Pharmaciano';
    const now = dayjs().format("DD/MM/YYYY hh:mm A");
    return {
        organization: orgName,
        generatedAt: now,
    };
};

// ─── Sales Report ──────────────────────────────────────────────
export const exportSalesReportToPDF = (data: any) => {
    const doc = new jsPDF();
    const { organization, generatedAt } = getExportHeader();
    doc.setFontSize(16);
    doc.text(`Sales Report - ${organization}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${generatedAt}`, 14, 30);

    // Summary
    doc.setFontSize(12);
    doc.text(`Total Sales: TK. ${data.totalSales.toFixed(2)}/-`, 14, 40);
    doc.text(`Total Orders: ${data.totalOrders}`, 14, 48);
    doc.text(`Average Order Value: TK. ${data.averageOrderValue.toFixed(2)}/-`, 14, 56);

    // Sales by Day
    autoTable(doc, {
        startY: 66,
        head: [['Date', 'Orders', 'Revenue']],
        body: data.salesByDate.map((d: any) => [d.date, d.orders, `TK. ${d.total.toFixed(2)}/-`]),
        foot: [['Total', '', `TK. ${data.totalSales.toFixed(2)}/-`]],
    });

    // Top Products
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Product', 'Qty Sold', 'Revenue']],
        body: data.topProducts.map((p: any) => [p.name, p.quantity, `TK. ${p.revenue.toFixed(2)}/-`]),
    });

    doc.save(`Sales_Report_${dayjs().format("YYYY-MM-DD")}.pdf`);
};

export const exportSalesReportToCSV = (data: any) => {
    const rows = data.salesByDate.map((d: any) => ({ Date: d.date, Orders: d.orders, Revenue: d.total }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, `Sales_Report_${dayjs().format("YYYY-MM-DD")}.xlsx`);
};

export const printSalesReport = (data: any) => {
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head><title>Sales Report</title>
        <style>body { font-family: Arial; padding: 20px; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #f0f0f0; }</style>
        </head>
        <body>
            <h2>Sales Report - ${getExportHeader().organization}</h2>
            <p>Generated: ${getExportHeader().generatedAt}</p>
            <p>Total Sales: TK. ${data.totalSales.toFixed(2)}/- | Total Orders: ${data.totalOrders}</p>
            <h3>Sales by Day</h3>
            <table>
                <thead><tr><th>Date</th><th>Orders</th><th>Revenue</th></tr></thead>
                <tbody>${data.salesByDate.map((d: any) => `<tr><td>${d.date}</td><td>${d.orders}</td><td>TK. ${d.total.toFixed(2)}/-</td></tr>`).join('')}</tbody>
            </table>
            <h3>Top Products</h3>
            <table>
                <thead><tr><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                <tbody>${data.topProducts.map((p: any) => `<tr><td>${p.name}</td><td>${p.quantity}</td><td>TK. ${p.revenue.toFixed(2)}/-</td></tr>`).join('')}</tbody>
            </table>
            <script>window.onload = function(){ window.print(); }</script>
        </body>
        </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
        win.document.write(printContent);
        win.document.close();
    }
};

// ─── Purchase Report ────────────────────────────────────────────
export const exportPurchaseReportToPDF = (data: any) => {
    const doc = new jsPDF();
    const { organization, generatedAt } = getExportHeader();
    doc.setFontSize(16);
    doc.text(`Purchase Report - ${organization}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${generatedAt}`, 14, 30);
    doc.setFontSize(12);
    doc.text(`Total Purchases: TK. ${data.totalPurchases.toFixed(2)}/-`, 14, 40);
    doc.text(`Total Orders: ${data.totalOrders}`, 14, 48);
    doc.text(`Average Order Value: TK. ${data.averageOrderValue.toFixed(2)}/-`, 14, 56);

    autoTable(doc, {
        startY: 66,
        head: [['Date', 'Orders', 'Amount']],
        body: data.purchasesByDate.map((d: any) => [d.date, d.orders, `TK. ${d.total.toFixed(2)}/-`]),
        foot: [['Total', '', `TK. ${data.totalPurchases.toFixed(2)}/-`]],
    });
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Supplier', 'Total']],
        body: data.topSuppliers.map((s: any) => [s.name, `TK. ${s.total.toFixed(2)}/-`]),
    });
    doc.save(`Purchase_Report_${dayjs().format("YYYY-MM-DD")}.pdf`);
};

export const exportPurchaseReportToCSV = (data: any) => {
    const rows = data.purchasesByDate.map((d: any) => ({ Date: d.date, Orders: d.orders, Amount: d.total }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    XLSX.writeFile(wb, `Purchase_Report_${dayjs().format("YYYY-MM-DD")}.xlsx`);
};

export const printPurchaseReport = (data: any) => {
    // Similar to sales, using data from purchase report
    const printContent = `...`; // same pattern as sales
    // We'll implement quickly
    const { organization, generatedAt } = getExportHeader();
    const rows = data.purchasesByDate.map((d: any) => `<tr><td>${d.date}</td><td>${d.orders}</td><td>TK. ${d.total.toFixed(2)}/-</td></tr>`).join('');
    const supplierRows = data.topSuppliers.map((s: any) => `<tr><td>${s.name}</td><td>TK. ${s.total.toFixed(2)}/-</td></tr>`).join('');
    const content = `
        <h2>Purchase Report - ${organization}</h2>
        <p>Generated: ${generatedAt}</p>
        <p>Total Purchases: TK. ${data.totalPurchases.toFixed(2)}/- | Total Orders: ${data.totalOrders}</p>
        <h3>Purchases by Day</h3>
        <table><thead><tr><th>Date</th><th>Orders</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
        <h3>Top Suppliers</h3>
        <table><thead><tr><th>Supplier</th><th>Total</th></tr></thead><tbody>${supplierRows}</tbody></table>
        <script>window.onload = function(){ window.print(); }</script>
    `;
    // Reuse same print logic
    const win = window.open('', '_blank');
    if (win) { win.document.write(`<!DOCTYPE html><html><head><title>Purchase Report</title><style>body{font-family:Arial;padding:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f0f0f0;}</style></head><body>${content}</body></html>`); win.document.close(); }
};

// ─── Inventory Valuation ────────────────────────────────────────
export const exportInventoryValuationToPDF = (data: any) => {
    const doc = new jsPDF();
    const { organization, generatedAt } = getExportHeader();
    doc.text(`Inventory Valuation - ${organization}`, 14, 20);
    doc.text(`Generated: ${generatedAt}`, 14, 30);
    doc.text(`Total Items: ${data.totalItems}`, 14, 40);
    doc.text(`Total Value (Cost): TK. ${data.totalValue.toFixed(2)}/-`, 14, 48);
    doc.text(`Total Selling Value: TK. ${data.totalSellingValue.toFixed(2)}/-`, 14, 56);
    autoTable(doc, {
        startY: 66,
        head: [['Batch No', 'Medicine', 'Qty', 'Value']],
        body: data.valuationByBatch.map((b: any) => [b.batchNo, b.medicineName, b.quantity, `TK. ${b.value.toFixed(2)}/-`]),
        foot: [['', '', 'Total', `TK. ${data.totalValue.toFixed(2)}/-`]],
    });
    doc.save(`Inventory_Valuation_${dayjs().format("YYYY-MM-DD")}.pdf`);
};

export const exportInventoryValuationToCSV = (data: any) => {
    const rows = data.valuationByBatch.map((b: any) => ({ Batch: b.batchNo, Medicine: b.medicineName, Qty: b.quantity, Value: b.value }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Inventory_Valuation_${dayjs().format("YYYY-MM-DD")}.xlsx`);
};

export const printInventoryValuation = (data: any) => {
    const { organization, generatedAt } = getExportHeader();
    const rows = data.valuationByBatch.map((b: any) => `<tr><td>${b.batchNo}</td><td>${b.medicineName}</td><td>${b.quantity}</td><td>TK. ${b.value.toFixed(2)}/-</td></tr>`).join('');
    const content = `
        <h2>Inventory Valuation - ${organization}</h2>
        <p>Generated: ${generatedAt}</p>
        <p>Total Items: ${data.totalItems} | Total Value: TK. ${data.totalValue.toFixed(2)}/-</p>
        <table><thead><tr><th>Batch</th><th>Medicine</th><th>Qty</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table>
        <script>window.onload = function(){ window.print(); }</script>
    `;
    const win = window.open('', '_blank');
    if (win) {
        win.document.write(`<!DOCTYPE html>
        <html>
        <head>
        <title>Inventory Valuation</title>
        <style>body{font-family:Arial;padding:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f0f0f0;}</style>
        </head>
        <body>${content}</body>
        </html>`
        ); win.document.close();
    }
};

// ─── Profit & Loss ─────────────────────────────────────────────
export const exportProfitLossToPDF = (data: any) => {
    const doc = new jsPDF();
    const { organization, generatedAt } = getExportHeader();
    doc.text(`Profit & Loss - ${organization}`, 14, 20);
    doc.text(`Generated: ${generatedAt}`, 14, 30);
    doc.text(`Total Income: TK. ${data.totalIncome.toFixed(2)}/-`, 14, 40);
    doc.text(`Total Expenses: TK. ${data.totalExpenses.toFixed(2)}/-`, 14, 48);
    doc.text(`Net Profit: TK. ${data.netProfit.toFixed(2)}/-`, 14, 56);
    autoTable(doc, {
        startY: 66,
        head: [['Month', 'Income', 'Expenses', 'Profit']],
        body: data.monthlyTrend.map((m: any) => [m.month, `TK. ${m.income.toFixed(2)}/-`, `TK. ${m.expenses.toFixed(2)}/-`, `TK. ${m.profit.toFixed(2)}/-`]),
    });
    doc.save(`Profit_Loss_${dayjs().format("YYYY-MM-DD")}.pdf`);
};

export const exportProfitLossToCSV = (data: any) => {
    const rows = data.monthlyTrend.map((m: any) => ({ Month: m.month, Income: m.income, Expenses: m.expenses, Profit: m.profit }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProfitLoss");
    XLSX.writeFile(wb, `Profit_Loss_${dayjs().format("YYYY-MM-DD")}.xlsx`);
};

export const printProfitLoss = (data: any) => {
    const { organization, generatedAt } = getExportHeader();
    const rows = data.monthlyTrend.map((m: any) => `<tr><td>${m.month}</td><td>TK. ${m.income.toFixed(2)}/-</td><td>TK. ${m.expenses.toFixed(2)}/-</td><td>TK. ${m.profit.toFixed(2)}/-</td></tr>`).join('');
    const content = `
        <h2>Profit & Loss - ${organization}</h2>
        <p>Generated: ${generatedAt}</p>
        <p>Total Income: TK. ${data.totalIncome.toFixed(2)}/- | Total Expenses: TK. ${data.totalExpenses.toFixed(2)}/- | Net Profit: TK. ${data.netProfit.toFixed(2)}/-</p>
        <table><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Profit</th></tr></thead><tbody>${rows}</tbody></table>
        <script>window.onload = function(){ window.print(); }</script>
    `;
    const win = window.open('', '_blank');
    if (win) { win.document.write(`<!DOCTYPE html><html><head><title>Profit & Loss</title><style>body{font-family:Arial;padding:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f0f0f0;}</style></head><body>${content}</body></html>`); win.document.close(); }
};