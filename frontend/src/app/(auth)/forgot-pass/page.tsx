"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, ShieldAlert } from "lucide-react";

export default function ForgetPasswordPage() {
    const router = useRouter();
    return (
        <div className="flex items-center justify-center min-h-[80vh] p-6">
            <Card className="w-full max-w-md shadow-md border">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center">
                        <ShieldAlert className="h-10 w-10 text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Forgot Password?
                    </CardTitle>

                    <CardDescription className="text-xl font-bold">
                        Password recovery is managed by the system administrator
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        If you have forgotten your password, please contact your
                        administrative or IT team to reset your account securely.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                        <Mail className="h-4 w-4" />
                        support@pharmaciano.com
                    </div>
                    <div className="p-6">
                        <Button variant="outline" onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};