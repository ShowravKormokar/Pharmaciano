import { Building2 } from 'lucide-react'

export function LoginHero() {
    return (
        <div className="hidden lg:flex flex-1 relative bg-linear-to-br from-primary to-primary/80">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">

                {/* Brand Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <div className="bg-primary-foreground p-3 rounded-xl">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-primary-foreground">Pharmaciano ERP</h1>
                    <p className="text-primary-foreground/80 mt-2">Pharmacy Management System</p>
                </div>

                {/* Features Section */}
                <div className="max-w-lg">
                    <h2 className="text-4xl font-bold mb-6">
                        Streamline Your Pharmacy Operations
                    </h2>
                    <p className="text-xl text-primary-foreground/90 mb-8">
                        Manage inventory, process sales, track analytics, and handle accounting
                        all in one powerful ERP system designed for modern pharmacies.
                    </p>
                    <div className="space-y-4">
                        {[
                            "Real-time inventory management",
                            "Multi-branch support",
                            "Advanced analytics & reporting",
                            "Secure role-based access"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-primary-foreground/60 rounded-full"></div>
                                <span className="text-primary-foreground/90">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};