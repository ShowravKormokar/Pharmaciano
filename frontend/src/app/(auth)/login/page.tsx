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
                </div>
            </div>

            <LoginHero />
        </div>
    );
}