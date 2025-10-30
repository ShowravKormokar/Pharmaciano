export default function SalesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold ">Sales Management</h1>
                    <p className="mt-1">
                        Manage sales, POS, and transactions
                    </p>
                </div>
                <button
                    className="px-4 py-2 rounded-lg border transition-colors cursor-pointer border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground">
                    New Sale
                </button>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <div className=" p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold  mb-4">Today's Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="">Total Sales</span>
                            <span className="font-semibold ">TK. 12,450/-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Transactions</span>
                            <span className="font-semibold ">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="">Returns</span>
                            <span className="font-semibold text-red-500">2</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className=" p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold  mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 border rounded-lg  transition-colors">
                            🛒 Point of Sale (POS)
                        </button>
                        <button className="w-full text-left p-3 border rounded-lg  transition-colors">
                            📋 Sales List
                        </button>
                        <button className="w-full text-left p-3 border rounded-lg  transition-colors">
                            💳 Payment Management
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Sales */}
            <div className=" rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                    {[
                        { id: '#001', customer: 'Walk-in Customer', amount: 'TK. 1,250/-', time: '10:30 AM' },
                        { id: '#002', customer: 'Regular Customer', amount: 'TK. 2,800/-', time: '09:15 AM' },
                        { id: '#003', customer: 'Hospital Order', amount: 'TK. 8,400/-', time: 'Yesterday' }
                    ].map((sale, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium ">{sale.id}</p>
                                <p className="text-sm ">{sale.customer}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold ">{sale.amount}</p>
                                <p className="text-sm ">{sale.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}