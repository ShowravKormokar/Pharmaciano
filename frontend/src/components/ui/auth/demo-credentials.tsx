export function DemoCredentials() {
    return (
        <div className="space-y-6">
            {/* Demo Credentials */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-primary mb-2">
                    Demo Credentials
                </h4>
                <div className="text-xs text-primary space-y-1">
                    <p><strong>Admin:</strong> admin@pharmacare.com / admin123</p>
                    <p><strong>Salesman:</strong> salesman@pharmacare.com / salesman123</p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    © 2024 PharmaCare ERP. All rights reserved.
                </p>
            </div>
        </div>
    )
};