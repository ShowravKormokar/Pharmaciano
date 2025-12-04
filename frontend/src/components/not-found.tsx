'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NotFound() {
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-foreground mb-2">404</h1>
                    <h2 className="text-xl font-semibold text-muted-foreground mb-4">
                        Page Not Found
                    </h2>

                    {/* Error Message */}
                    <p className="text-muted-foreground mb-6">
                        The page <span className="font-mono text-foreground bg-muted px-2 py-1 rounded">{pathname}</span> could not be found.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">
                                <Home className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>

                    {/* Help Text */}
                    <p className="text-sm text-muted-foreground mt-6">
                        If you believe this is an error, please contact support.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
};