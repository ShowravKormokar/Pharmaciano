import { Home, Users, ShoppingCart, PlusCircle, List, Terminal } from "lucide-react"

export const navigation = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/dashboard"
    },
    {
        label: "Users",
        icon: Users,
        href: "/dashboard/users"
    },
    {
        label: "Sales",
        icon: ShoppingCart,
        children: [
            { label: "Overview", icon: Terminal, href: "/dashboard/sales" },
            { label: "POS", icon: PlusCircle, href: "/dashboard/sales/pos" },
            { label: "Add Sale", icon: PlusCircle, href: "/dashboard/sales/add-sale" },
            { label: "Sales List", icon: List, href: "/dashboard/sales/sales-list" },
        ]
    }
];