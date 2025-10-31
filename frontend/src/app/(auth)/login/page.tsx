import { DemoCredentials } from "@/components/ui/auth/demo-credentials";
import { LoginForm } from "@/components/ui/auth/login-form";
import { LoginHero } from "@/components/ui/auth/login-hero";
import { ModeToggle } from "@/components/ui/modeToggle";


export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex relative">
            {/* Mode Toggle - Fixed Position */}
            <div className="fixed top-4 left-4 z-50 ">
                <ModeToggle />
            </div>

            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <LoginForm />
                    <DemoCredentials />
                </div>
            </div>

            {/* Right Side - Hero Section */}
            <LoginHero />
        </div>
    )
}