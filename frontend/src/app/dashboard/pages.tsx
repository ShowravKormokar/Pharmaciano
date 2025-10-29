import { ShoppingCart, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome to Pharmaciano ERP System
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">₹8,420</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-sm text-gray-600">New user registered - John Doe</p>
                        <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <p className="text-sm text-gray-600">Sale completed - ₹1,250</p>
                        <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
                    </div>
                </div>
            </div>
        </div>
    )
}