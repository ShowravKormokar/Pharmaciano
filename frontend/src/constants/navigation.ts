import type { LucideIcon } from "lucide-react";
import { Home, Users, ShoppingCart, PlusCircle, List, Terminal, DollarSignIcon, Warehouse, Settings, Settings2, Settings2Icon, Scroll, Accessibility, IterationCcw, ShoppingBasket, FolderPlus, Tags, PackagePlus, PackageSearch, Layers, FileInput, ShieldCheck, UserCog, Palette, Globe, Bell, Database, CloudUpload, UserPlus, UserCheck, Truck, Wallet, ArrowLeftRight, WalletCards, Landmark, ListOrdered, RotateCcw } from "lucide-react";

export type NavChild = {
    label: string;
    href: string;
    icon?: LucideIcon;
};

export type NavItem = {
    label: string;
    href?: string;
    icon?: LucideIcon;
    children?: NavChild[];
    id?: string; // optional stable id for state keys
};

export const navigation: NavItem[] = [
    { label: "Dashboard", icon: Home, href: "/dashboard", id: "dashboard" },
    {
        label: "Users",
        icon: Users,
        href: "/dashboard/users",
        id: "users",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/users" },
            { label: "User List", icon: List, href: "/dashboard/users/user-list" },
            { label: "Role List", icon: List, href: "/dashboard/users/role-list" },
        ],
    },
    {
        label: "Sales",
        icon: DollarSignIcon,
        id: "sales",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/sales" },
            { label: "POS", icon: PlusCircle, href: "/dashboard/sales/pos" },
            { label: "Add Sale", icon: PlusCircle, href: "/dashboard/sales/add-sale" },
            { label: "Sales List", icon: List, href: "/dashboard/sales/sales-list" },
        ],
    },
    {
        label: "Accounts",
        icon: Wallet,
        id: "accounts",
        children: [
            { label: "Add Account", icon: PlusCircle, href: "/dashboard/accounts/add-account" },
            { label: "Account List", icon: List, href: "/dashboard/accounts/account-list" },
            { label: "Money Transfer", icon: ArrowLeftRight, href: "/dashboard/accounts/money-transfer-list" },
            { label: "Deposit List", icon: WalletCards, href: "/dashboard/accounts/deposite-list" },
            { label: "Cash Transaction", icon: Landmark, href: "/dashboard/accounts/cash-transaction" },
        ],
    },
    {
        label: "Items",
        icon: ShoppingBasket,
        id: "items",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/items" },

            { label: "Add Item", icon: PlusCircle, href: "/dashboard/items/add-item" },
            { label: "Item List", icon: List, href: "/dashboard/items/item-list" },

            { label: "Add Category", icon: FolderPlus, href: "/dashboard/items/add-category" },
            { label: "Category List", icon: Tags, href: "/dashboard/items/category-list" },

            { label: "Add Brand", icon: PackagePlus, href: "/dashboard/items/add-brand" },
            { label: "Brand List", icon: PackageSearch, href: "/dashboard/items/brand-list" },

            { label: "Variant List", icon: Layers, href: "/dashboard/items/variant-list" },

            { label: "Import Items", icon: FileInput, href: "/dashboard/items/import-items" },
        ],
    },
    {
        label: "Purchase",
        icon: ShoppingCart,
        id: "purchase",
        children: [
            { label: "New Purchase", icon: ShoppingCart, href: "/dashboard/purchase/new-purchase" },
            { label: "Purchase List", icon: ListOrdered, href: "/dashboard/purchase/purchase-list" },
            { label: "Purchase Return List", icon: RotateCcw, href: "/dashboard/purchase/purchase-return-list" },
        ],
    },
    {
        label: "Contacts",
        icon: Users,
        id: "contacts",
        children: [
            { label: "Add Customer", icon: UserPlus, href: "/dashboard/contacts/add-customer" },
            { label: "Customer List", icon: UserCheck, href: "/dashboard/contacts/customer-list" },

            { label: "Add Supplier", icon: Truck, href: "/dashboard/contacts/add-supplier" },
            { label: "Supplier List", icon: List, href: "/dashboard/contacts/supplier-list" },

            { label: "Import Customers", icon: FileInput, href: "/dashboard/contacts/import-customer" },
            { label: "Import Suppliers", icon: FileInput, href: "/dashboard/contacts/import-supplier" },
        ],
    },
    {
        label: "Warehouses",
        icon: Warehouse,
        id: "warehouses",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/warehouse" },
            { label: "Add Warehouse", icon: PlusCircle, href: "/dashboard/warehouse/add-warehouse" },
            { label: "Warehouse List", icon: List, href: "/dashboard/warehouse/warehouse-list" }
        ],
    },
    {
        label: "Settings",
        icon: Settings,
        id: "settings",
        children: [
            { label: "Docs/Manual", icon: Terminal, href: "/dashboard/setting" },
            { label: "User Roles & Permissions", icon: ShieldCheck, href: "/dashboard/settings/permissions" },
            { label: "User Management", icon: UserCog, href: "/dashboard/settings/users" },
            { label: "Appearance / Theme", icon: Palette, href: "/dashboard/settings/theme" },
            { label: "Localization (Currency, Timezone)", icon: Globe, href: "/dashboard/settings/localization" },
            { label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
            { label: "Database Backup/Restore", icon: Database, href: "/dashboard/settings/database" },
            { label: "Import/Export Settings", icon: CloudUpload, href: "/dashboard/settings/import-export" },
        ],
    },
];