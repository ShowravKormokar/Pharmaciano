'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react'

export default function LoginPage() {

    // 🚨Data handling operation is dummy for now! So ignore this. Focus on now only create UI🚨

    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            const { email, password } = formData

            // Demo authentication logic
            if (email === 'admin@pharmacare.com' && password === 'admin123') {
                console.log('Admin login successful')
                // Redirect to dashboard
                window.location.href = '/'
            } else if (email === 'salesman@pharmacare.com' && password === 'salesman123') {
                console.log('Salesman login successful')
                // Redirect to dashboard
                window.location.href = '/'
            } else {
                console.log('Login failed: Invalid credentials')
                alert('Invalid email or password. Please try again.')
            }

            setIsLoading(false)
        }, 1500)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">

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
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                                            href="/forgot-password"
                                            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm font-normal cursor-pointer"
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
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>

                            {/* Demo Credentials Hint */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    Demo Credentials
                                </h4>
                                <div className="text-xs text-blue-700 space-y-1">
                                    <p><strong>Admin:</strong> admin@pharmacare.com / admin123</p>
                                    <p><strong>Salesman:</strong> salesman@pharmacare.com / salesman123</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            © 2024 PharmaCare ERP. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Background Image/Graphics */}
            <div className="hidden lg:flex flex-1 relative bg-gradient(135deg from-blue-600 via-blue-700 to-blue-800)">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    {/* Logo and Brand */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center mb-4">
                            <div className="bg-blue-600 p-3 rounded-xl">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Pharmaciano ERP</h1>
                        <p className="text-gray-600 mt-2">Pharmacy Management System</p>
                    </div>

                    <div className="max-w-lg">
                        <h2 className="text-4xl font-bold mb-6">
                            Streamline Your Pharmacy Operations
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Manage inventory, process sales, track analytics, and handle accounting
                            all in one powerful ERP system designed for modern pharmacies.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-blue-100">Real-time inventory management</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-blue-100">Multi-branch support</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-blue-100">Advanced analytics & reporting</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-blue-100">Secure role-based access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}