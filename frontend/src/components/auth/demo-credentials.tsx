"use client";

interface Props {
    onFillCredentials: (email: string, password: string) => void;
}

export function DemoCredentials({ onFillCredentials }: Props) {
    return (
        <div className="space-y-6">
            {/* Demo Credentials */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-primary mb-2">
                    Demo Credentials
                </h4>
                <div className="text-xs text-primary space-y-2">
                    <div className="flex items-center justify-between">
                        <p>
                            <strong>Admin:</strong> superadmin@pharmaciano.com / superadmin123
                        </p>
                        <button
                            onClick={() => onFillCredentials("superadmin@pharmaciano.com", "superadmin123")}
                            className="text-xs bg-primary/20 hover:bg-primary/30 px-2 py-1 rounded transition-colors"
                        >
                            Try this
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <p>
                            <strong>Salesman:</strong> abc@example.com / abc123
                        </p>
                        <button
                            onClick={() => onFillCredentials("abc@example.com", "abc123")}
                            className="text-xs bg-primary/20 hover:bg-primary/30 px-2 py-1 rounded transition-colors"
                        >
                            Try this
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    © 2024 Pharmacino ERP. All rights reserved.
                </p>
            </div>
        </div>
    );
}