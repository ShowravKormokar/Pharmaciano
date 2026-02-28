import type { LucideIcon } from "lucide-react";
import {
    Home, Users, ShoppingCart, PlusCircle, List, Terminal,
    DollarSignIcon, Warehouse, Settings, ShoppingBasket,
    Tags, PackageSearch, Layers,
    FileInput, ShieldCheck, UserCog, Palette, Globe, Bell,
    Database, CloudUpload, UserCheck, Truck,
    Wallet, ArrowLeftRight, WalletCards,
    ListOrdered, RotateCcw, FileText, Scroll, AlertTriangle,
    CheckCircle, Brain, TrendingUp, Activity,
    User,
    Landmark,
    BrainCog
} from "lucide-react";

export type NavChild = {
    label: string;
    href: string;
    icon?: LucideIcon;
    permission?: string;   // page-level control
};

export type NavItem = {
    label: string;
    href?: string;
    icon?: LucideIcon;
    children?: NavChild[];
    id?: string;           // module name
    permission?: string;   // module-level control
};

export const navigation: NavItem[] = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
        id: "dashboard",
    },

    /* USERS & ACCESS */
    {
        label: "Users",
        icon: Users,
        id: "users",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/users", permission: "user:read" },
            { label: "User List", icon: List, href: "/dashboard/users/user-list", permission: "user:read" },
            { label: "Role List", icon: ShieldCheck, href: "/dashboard/users/role-list", permission: "role:read" },
        ],
    },

    /* SALES */
    {
        label: "Sales",
        icon: DollarSignIcon,
        id: "sales",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/sales", permission: "sales:read" },
            { label: "POS", icon: PlusCircle, href: "/dashboard/sales/pos", permission: "sales:process" },
            { label: "Sales List", icon: List, href: "/dashboard/sales/sales-list", permission: "sales:read" },
            { label: "Sales Return", icon: RotateCcw, href: "/dashboard/sales/sales-return", permission: "sales:return" },
        ],
    },

    /* PURCHASE */
    {
        label: "Purchase",
        icon: ShoppingCart,
        id: "purchase",
        children: [
            { label: "New Purchase", icon: PlusCircle, href: "/dashboard/purchase/new-purchase", permission: "purchase:create" },
            { label: "Purchase List", icon: ListOrdered, href: "/dashboard/purchase/purchase-list", permission: "purchase:read" },
            { label: "Purchase Return", icon: RotateCcw, href: "/dashboard/purchase/purchase-return-list", permission: "purchase:return" },
            { label: "Approvals", icon: CheckCircle, href: "/dashboard/purchase/approvals", permission: "purchase:approve" },
        ],
    },

    /* INVENTORY */
    {
        label: "Inventory",
        icon: ShoppingBasket,
        id: "inventory",
        children: [
            { label: "Items", icon: List, href: "/dashboard/inventory/item-list", permission: "inventory:read" },
            { label: "Categories", icon: Tags, href: "/dashboard/inventory/categories", permission: "inventory:manage" },
            { label: "Brands", icon: PackageSearch, href: "/dashboard/inventory/brands", permission: "inventory:manage" },
            { label: "Variants / Batches", icon: Layers, href: "/dashboard/inventory/variant-list", permission: "inventory:manage" },
            { label: "Stock Adjustment", icon: Activity, href: "/dashboard/inventory/adjustment", permission: "inventory:adjust" },
            { label: "Expiry Alerts", icon: AlertTriangle, href: "/dashboard/inventory/expiry-alerts", permission: "inventory:read" },
            { label: "Import Items", icon: FileInput, href: "/dashboard/inventory/import-items", permission: "inventory:import" },
        ],
    },

    /* CONTACTS */
    {
        label: "Contacts",
        icon: Users,
        id: "contacts",
        children: [
            { label: "Customers", icon: UserCheck, href: "/dashboard/contacts/customer-list", permission: "contacts:read" },
            { label: "Suppliers", icon: Truck, href: "/dashboard/contacts/supplier-list", permission: "contacts:read" },
            { label: "Import Contacts", icon: FileInput, href: "/dashboard/contacts/import", permission: "contacts:import" },
        ],
    },

    /* WAREHOUSE */
    {
        label: "Warehouses",
        icon: Warehouse,
        id: "warehouses",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/warehouses", permission: "warehouse:read" },
            { label: "Warehouse List", icon: List, href: "/dashboard/warehouses/warehouse-list", permission: "warehouse:read" },
            { label: "Add Warehouse", icon: PlusCircle, href: "/dashboard/warehouses/add", permission: "warehouse:create" },
        ],
    },

    /* ACCOUNTING */
    {
        label: "Accounting",
        icon: Wallet,
        id: "accounting",
        children: [
            { label: "Chart of Accounts", icon: List, href: "/dashboard/accounting/chart-of-accounts", permission: "accounting:read" },
            { label: "Journal Entries", icon: Scroll, href: "/dashboard/accounting/journal", permission: "accounting:manage" },
            { label: "General Ledger", icon: FileText, href: "/dashboard/accounting/ledger", permission: "accounting:read" },
            { label: "Expenses", icon: WalletCards, href: "/dashboard/accounting/expenses", permission: "accounting:manage" },
            { label: "Transfers", icon: ArrowLeftRight, href: "/dashboard/accounting/transfers", permission: "accounting:transfer" },
        ],
    },

    /* REPORTS */
    {
        label: "Reports",
        icon: FileText,
        id: "reports",
        children: [
            { label: "Sales Report", href: "/dashboard/reports/sales", permission: "reports:view" },
            { label: "Purchase Report", href: "/dashboard/reports/purchase", permission: "reports:view" },
            { label: "Inventory Valuation", href: "/dashboard/reports/inventory", permission: "reports:view" },
            { label: "Profit & Loss", href: "/dashboard/reports/profit-loss", permission: "reports:view" },
            { label: "Tax Report", href: "/dashboard/reports/tax", permission: "reports:view" },
        ],
    },

    /* AI INSIGHTS */
    {
        label: "AI Insights",
        icon: Brain,
        id: "ai",
        children: [
            { label: "Demand Prediction", icon: TrendingUp, href: "/dashboard/ai/demand-prediction", permission: "ai:predict" },
            { label: "Stock Recommendations", icon: Activity, href: "/dashboard/ai/stock-recommendation", permission: "ai:recommend" },
            { label: "Trending Products", icon: TrendingUp, href: "/dashboard/ai/trending-products", permission: "ai:read" },
            { label: "Business Insights", icon: Brain, href: "/dashboard/ai/insights", permission: "ai:read" },
        ],
    },

    /* ORGANIZATION */
    {
        label: "Organization",
        icon: Landmark,
        id: "organization",
        children: [
            {
                label: "Overview",
                href: "/dashboard/organizations/",
                permission: "organization:view",
            },
            {
                label: "Organization List",
                href: "/dashboard/organizations/org-list",
                permission: "organization:read",
            },
            {
                label: "Create Organization",
                href: "/dashboard/organizations/add",
                permission: "organization:create",
            }
        ],
    },

    /* BRANCHES */
    {
        label: "Branches",
        icon: BrainCog,
        id: "branches",
        children: [
            {
                label: "Overview",
                href: "/dashboard/branches/",
                permission: "branch:view",
            },
            {
                label: "Branch List",
                href: "/dashboard/branches/branch-list",
                permission: "branch:read",
            },
            {
                label: "Create Branch",
                href: "/dashboard/branches/add",
                permission: "branch:create",
            }
        ],
    },

    /* SETTINGS */
    {
        label: "Settings",
        icon: Settings,
        id: "settings",
        children: [
            {
                label: "Roles & Permissions",
                icon: ShieldCheck,
                href: "/dashboard/settings/permissions",
                permission: "settings:manage",
            },
            {
                label: "User Management",
                icon: UserCog,
                href: "/dashboard/settings/users",
                permission: "settings:manage",
            },
            {
                label: "Theme & Appearance",
                icon: Palette,
                href: "/dashboard/settings/theme",
                permission: "settings:read",
            },
            {
                label: "Localization",
                icon: Globe,
                href: "/dashboard/settings/localization",
                permission: "settings:read",
            },
            {
                label: "Notifications",
                icon: Bell,
                href: "/dashboard/settings/notifications",
                permission: "settings:read",
            },
            {
                label: "Database Backup",
                icon: Database,
                href: "/dashboard/settings/database",
                permission: "settings:backup",
            },
            {
                label: "Import / Export",
                icon: CloudUpload,
                href: "/dashboard/settings/import-export",
                permission: "settings:import-export",
            },
            {
                label: "Audit Logs",
                icon: Scroll,
                href: "/dashboard/settings/audit-logs",
                permission: "settings:audit",
            },
        ],
    }
];