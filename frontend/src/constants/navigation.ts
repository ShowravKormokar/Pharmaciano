import type { LucideIcon } from "lucide-react";
import { UserRoleEnum } from "@/types/roles";
import {
    Home, Users, ShoppingCart, PlusCircle, List, Terminal,
    DollarSignIcon, Warehouse, Settings, ShoppingBasket,
    Tags, PackageSearch, Layers,
    FileInput, ShieldCheck, UserCog, Palette, Globe, Bell,
    Database, CloudUpload, UserCheck, Truck,
    Wallet, ArrowLeftRight, WalletCards,
    ListOrdered, RotateCcw, FileText, Scroll, AlertTriangle,
    CheckCircle, Brain, TrendingUp, Activity,
    User
} from "lucide-react";

export type NavChild = {
    label: string;
    href: string;
    icon?: LucideIcon;
    permission?: string;   // page-level control
    roles?: UserRoleEnum[];      // optional override
};

export type NavItem = {
    label: string;
    href?: string;
    icon?: LucideIcon;
    children?: NavChild[];
    id?: string;
    permission?: string;   // module-level control
    roles?: UserRoleEnum[];      // module visibility
};

export const navigation: NavItem[] = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
        id: "dashboard",
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF, UserRoleEnum.CASHIER, UserRoleEnum.PROCUREMENT, UserRoleEnum.ACCOUNTANT, UserRoleEnum.PHARMACIST, UserRoleEnum.WAREHOUSE_STAFF], // visible to all roles
    },

    /* USERS & ACCESS */
    {
        label: "Users",
        icon: Users,
        id: "users",
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER],   // module visible only to these roles
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/users", permission: "user:read" },
            { label: "User List", icon: List, href: "/dashboard/users/user-list", permission: "user:read" },
            { label: "Role List", icon: ShieldCheck, href: "/dashboard/users/role-list", permission: "role:read", roles: [UserRoleEnum.SUPER_ADMIN] },
        ],
    },

    /* SALES */
    {
        label: "Sales",
        icon: DollarSignIcon,
        id: "sales",
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.CASHIER],
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/sales", permission: "sales:read" },
            { label: "POS", icon: PlusCircle, href: "/dashboard/sales/pos", permission: "sales:process", roles: [UserRoleEnum.CASHIER, UserRoleEnum.MANAGER] },
            { label: "Sales List", icon: List, href: "/dashboard/sales/sales-list", permission: "sales:read" },
            { label: "Sales Return", icon: RotateCcw, href: "/dashboard/sales/sales-return", permission: "sales:return" },
        ],
    },

    /* PURCHASE */
    {
        label: "Purchase",
        icon: ShoppingCart,
        id: "purchase",
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.PROCUREMENT],
        children: [
            { label: "New Purchase", icon: PlusCircle, href: "/dashboard/purchase/new-purchase", permission: "purchase:create" },
            { label: "Purchase List", icon: ListOrdered, href: "/dashboard/purchase/purchase-list", permission: "purchase:read" },
            { label: "Purchase Return", icon: RotateCcw, href: "/dashboard/purchase/purchase-return-list", permission: "purchase:return" },
            { label: "Approvals", icon: CheckCircle, href: "/dashboard/purchase/approvals", permission: "purchase:approve", roles: [UserRoleEnum.MANAGER] },
        ],
    },

    /* INVENTORY */
    {
        label: "Inventory",
        icon: ShoppingBasket,
        id: "inventory",
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAREHOUSE_STAFF],
        children: [
            { label: "Items", icon: List, href: "/dashboard/inventory/item-list", permission: "inventory:read" },
            { label: "Categories", icon: Tags, href: "/dashboard/inventory/category-list", permission: "inventory:manage" },
            { label: "Brands", icon: PackageSearch, href: "/dashboard/inventory/brand-list", permission: "inventory:manage" },
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
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
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
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAREHOUSE_STAFF],
        children: [
            { label: "Warehouse List", icon: List, href: "/dashboard/warehouses/warehouse-list", permission: "warehouse:read" },
            { label: "Add Warehouse", icon: PlusCircle, href: "/dashboard/warehouses/add-warehouse", permission: "warehouse:create", roles: [UserRoleEnum.MANAGER] },
        ],
    },

    /* ACCOUNTING */
    {
        label: "Accounting",
        icon: Wallet,
        id: "accounting",
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.ACCOUNTANT],
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
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER],
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
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER],
        children: [
            { label: "Demand Prediction", icon: TrendingUp, href: "/dashboard/ai/demand-prediction", permission: "ai:predict" },
            { label: "Stock Recommendations", icon: Activity, href: "/dashboard/ai/stock-recommendation", permission: "ai:recommend" },
            { label: "Trending Products", icon: TrendingUp, href: "/dashboard/ai/trending-products", permission: "ai:read" },
            { label: "Business Insights", icon: Brain, href: "/dashboard/ai/insights", permission: "ai:read" },
        ],
    },

    /* SETTINGS */
    {
        label: "Settings",
        icon: Settings,
        id: "settings",
        roles: [UserRoleEnum.SUPER_ADMIN], // Only Super Admin can see the Settings module
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