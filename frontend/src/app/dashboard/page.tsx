import { Separator } from '@/components/ui/separator';
import { SeparatorHorizontal, ShoppingCart, Users } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold ">Dashboard</h1>
                    <p className=" mt-1">
                        Welcome to Pharmaciano ERP System
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium ">Total Users</p>
                            <p className="text-2xl font-bold  mt-1">10</p>
                        </div>
                        <div className="p-3 rounded-lg">
                            <Users className="h-6 w-6 " />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium ">Today's Sales</p>
                            <p className="text-2xl font-bold  mt-1">TK. 2,000/-</p>
                        </div>
                        <div className="p-3  rounded-lg">
                            <ShoppingCart className="h-6 w-6 " />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium ">Inventory Items</p>
                            <p className="text-2xl font-bold  mt-1">100</p>
                        </div>
                        <div className="p-3  rounded-lg">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold  mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg">
                        <div className="w-2 h-2 rounded-full"></div>
                        <p className="text-sm ">New user registered - John Doe</p>
                        <span className="text-xs  ml-auto">2 min ago</span>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-3 p-3 rounded-lg">
                        <div className="w-2 h-2  rounded-full"></div>
                        <p className="text-sm ">Sale completed - TK. 2,050/-</p>
                        <span className="text-xs ml-auto">5 min ago</span>
                    </div>
                </div>
            </div>
        </div>
    )
}