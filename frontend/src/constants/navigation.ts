import type { LucideIcon } from "lucide-react";
import {
    Home, Users, ShoppingCart, PlusCircle, List, Terminal,
    DollarSignIcon, Warehouse, Settings, ShoppingBasket,
    FolderPlus, Tags, PackagePlus, PackageSearch, Layers,
    FileInput, ShieldCheck, UserCog, Palette, Globe, Bell,
    Database, CloudUpload, UserPlus, UserCheck, Truck,
    Wallet, ArrowLeftRight, WalletCards, Landmark,
    ListOrdered, RotateCcw, FileText, Scroll, AlertTriangle,
    CheckCircle, Brain, TrendingUp, Activity
} from "lucide-react";

export type NavChild = {
    label: string;
    href: string;
    icon?: LucideIcon;
    permission?: string;
};

export type NavItem = {
    label: string;
    href?: string;
    icon?: LucideIcon;
    children?: NavChild[];
    id?: string;
    permission?: string;
};

export const navigation: NavItem[] = [
    { label: "Dashboard", icon: Home, href: "/dashboard", id: "dashboard" },

    /* USERS & ACCESS */
    {
        label: "Users",
        icon: Users,
        id: "users",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/users" },
            { label: "User List", icon: List, href: "/dashboard/users/user-list" },
            { label: "Role List", icon: ShieldCheck, href: "/dashboard/users/role-list" },
        ],
    },

    /* SALES */
    {
        label: "Sales",
        icon: DollarSignIcon,
        id: "sales",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/sales" },
            { label: "POS", icon: PlusCircle, href: "/dashboard/sales/pos" },
            { label: "Sales List", icon: List, href: "/dashboard/sales/sales-list" },
            { label: "Sales Return", icon: RotateCcw, href: "/dashboard/sales/sales-return" },
        ],
    },

    /* PURCHASE */
    {
        label: "Purchase",
        icon: ShoppingCart,
        id: "purchase",
        children: [
            { label: "New Purchase", icon: PlusCircle, href: "/dashboard/purchase/new-purchase" },
            { label: "Purchase List", icon: ListOrdered, href: "/dashboard/purchase/purchase-list" },
            { label: "Purchase Return", icon: RotateCcw, href: "/dashboard/purchase/purchase-return-list" },
            { label: "Approvals", icon: CheckCircle, href: "/dashboard/purchase/approvals" },
        ],
    },

    /* INVENTORY */
    {
        label: "Inventory",
        icon: ShoppingBasket,
        id: "inventory",
        children: [
            { label: "Items", icon: List, href: "/dashboard/items/item-list" },
            { label: "Categories", icon: Tags, href: "/dashboard/items/category-list" },
            { label: "Brands", icon: PackageSearch, href: "/dashboard/items/brand-list" },
            { label: "Variants / Batches", icon: Layers, href: "/dashboard/items/variant-list" },
            { label: "Stock Adjustment", icon: Activity, href: "/dashboard/inventory/adjustment" },
            { label: "Expiry Alerts", icon: AlertTriangle, href: "/dashboard/inventory/expiry-alerts" },
            { label: "Import Items", icon: FileInput, href: "/dashboard/items/import-items" },
        ],
    },

    /* CONTACTS */
    {
        label: "Contacts",
        icon: Users,
        id: "contacts",
        children: [
            { label: "Customers", icon: UserCheck, href: "/dashboard/contacts/customer-list" },
            { label: "Suppliers", icon: Truck, href: "/dashboard/contacts/supplier-list" },
            { label: "Import Contacts", icon: FileInput, href: "/dashboard/contacts/import" },
        ],
    },

    /* WAREHOUSE */
    {
        label: "Warehouses",
        icon: Warehouse,
        id: "warehouses",
        children: [
            { label: "Warehouse List", icon: List, href: "/dashboard/warehouse/warehouse-list" },
            { label: "Add Warehouse", icon: PlusCircle, href: "/dashboard/warehouse/add-warehouse" },
        ],
    },

    /* ACCOUNTING (REAL ERP CORE) */
    {
        label: "Accounting",
        icon: Wallet,
        id: "accounting",
        children: [
            { label: "Chart of Accounts", icon: List, href: "/dashboard/accounting/chart-of-accounts" },
            { label: "Journal Entries", icon: Scroll, href: "/dashboard/accounting/journal" },
            { label: "General Ledger", icon: FileText, href: "/dashboard/accounting/ledger" },
            { label: "Expenses", icon: WalletCards, href: "/dashboard/accounting/expenses" },
            { label: "Transfers", icon: ArrowLeftRight, href: "/dashboard/accounting/transfers" },
        ],
    },

    /* REPORTS */
    {
        label: "Reports",
        icon: FileText,
        id: "reports",
        children: [
            { label: "Sales Report", href: "/dashboard/reports/sales" },
            { label: "Purchase Report", href: "/dashboard/reports/purchase" },
            { label: "Inventory Valuation", href: "/dashboard/reports/inventory" },
            { label: "Profit & Loss", href: "/dashboard/reports/profit-loss" },
            { label: "Tax Report", href: "/dashboard/reports/tax" },
        ],
    },

    /* AI INTELLIGENCE */
    {
        label: "AI Insights",
        icon: Brain,
        id: "ai",
        children: [
            { label: "Demand Prediction", icon: TrendingUp, href: "/dashboard/ai/demand-prediction" },
            { label: "Stock Recommendations", icon: Activity, href: "/dashboard/ai/stock-recommendation" },
            { label: "Trending Products", icon: TrendingUp, href: "/dashboard/ai/trending-products" },
            { label: "Business Insights", icon: Brain, href: "/dashboard/ai/insights" },
        ],
    },

    /* SETTINGS */
    {
        label: "Settings",
        icon: Settings,
        id: "settings",
        children: [
            { label: "Roles & Permissions", icon: ShieldCheck, href: "/dashboard/settings/permissions" },
            { label: "User Management", icon: UserCog, href: "/dashboard/settings/users" },
            { label: "Theme & Appearance", icon: Palette, href: "/dashboard/settings/theme" },
            { label: "Localization", icon: Globe, href: "/dashboard/settings/localization" },
            { label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
            { label: "Database Backup", icon: Database, href: "/dashboard/settings/database" },
            { label: "Import / Export", icon: CloudUpload, href: "/dashboard/settings/import-export" },
            { label: "Audit Logs", icon: Scroll, href: "/dashboard/settings/audit-logs" },
        ],
    },
];