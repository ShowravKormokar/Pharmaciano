export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome to Pharmaciano ERP System
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">This is Pharmaciano Dashboard</h2>
                    <p className="text-muted-foreground">
                        Future analytics, stats, and overview content will be added here.
                    </p>
                </div>

                {/* Quick stats placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border rounded-lg p-6">
                        <h3 className="font-semibold mb-2">Total Sales</h3>
                        <p className="text-2xl font-bold">₹0</p>
                    </div>
                    <div className="bg-card border rounded-lg p-6">
                        <h3 className="font-semibold mb-2">Inventory Items</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-card border rounded-lg p-6">
                        <h3 className="font-semibold mb-2">Today's Transactions</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>
            </div>
        </div>
    )
}