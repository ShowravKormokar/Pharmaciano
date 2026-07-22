"use client";

import { useState } from 'react';
import { DemoCredentials } from "@/components/auth/demo-credentials";
import { LoginHero } from "@/components/auth/login-hero";
import { ModeToggle } from "@/components/ui/modeToggle";
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleFillCredentials = (email: string, password: string) => {
        setFormData({ email, password });
    };

    return (
        <div className="min-h-screen w-full flex relative">
            <div className="fixed top-4 left-4 z-50">
                <ModeToggle />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <LoginForm formData={formData} setFormData={setFormData} />
                    <DemoCredentials onFillCredentials={handleFillCredentials} />
                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            © 2026 Pharmacino ERP. All rights reserved.
                        </p>
                        {/* <p className="mt-1 text-[11px] text-muted-foreground/80">
                            Developed by Engineering Boys
                        </p> */}
                        <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.15em] bg-muted text-muted-foreground px-2 py-1 rounded-lg inline-block">
                            Version 1.0.0 · Academic Edition
                        </p>
                    </div>
                </div>
            </div>

            <LoginHero />
        </div>
    );
}