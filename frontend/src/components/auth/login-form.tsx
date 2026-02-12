'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { loginService } from "@/services/auth.service";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await loginService(formData);

            const { token } = res.data;

            if (!token) {
                throw new Error("Invalid login response");
            }

            // Store token for API usage (For dummy now)
            if (rememberMe) {
                localStorage.setItem("accessToken", token);
                // persistent cookie (1 day)
                document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;
            } else {
                sessionStorage.setItem("accessToken", token);
                // session cookie (removed when tab closes)
                document.cookie = `auth-token=${token}; path=/; SameSite=Lax`;
            }


            // Store token in cookie for middleware (NOT HttpOnly)
            document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;

            window.location.href = "/dashboard";
        } catch (error: any) {
            console.error("LOGIN ERROR:", error);
            alert(error?.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-center">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10 h-11"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <Link
                                href="#"
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="pl-10 pr-10 h-11"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm font-normal cursor-pointer text-muted-foreground"
                            >
                                Remember me
                            </Label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
};