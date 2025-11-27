// src/constants/navigation.ts
import type { LucideIcon } from "lucide-react";
import { Home, Users, ShoppingCart, PlusCircle, List, Terminal } from "lucide-react";

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
    { label: "Users", icon: Users, href: "/dashboard/users", id: "users" },
    {
        label: "Sales",
        icon: ShoppingCart,
        id: "sales",
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/sales" },
            { label: "POS", icon: PlusCircle, href: "/dashboard/sales/pos" },
            { label: "Add Sale", icon: PlusCircle, href: "/dashboard/sales/add-sale" },
            { label: "Sales List", icon: List, href: "/dashboard/sales/sales-list" },
        ],
    },
];