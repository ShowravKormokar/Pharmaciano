import dynamic from 'next/dynamic'
import { DemoCredentials } from "@/components/auth/demo-credentials";
// import { LoginForm } from "@/components/ui/auth/login-form";
import { LoginHero } from "@/components/auth/login-hero";
import { ModeToggle } from "@/components/ui/modeToggle";
import { Spinner } from '@/components/ui/shadcn-io/spinner';


const LoginForm = dynamic(() => import('@/components/auth/login-form'), {
    loading: () => (
        <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4">
                <Spinner variant={"bars"} />
            </div>
            <p className="text-muted-foreground"> Loading...</p>
        </div>
    ),
    // ssr: false
});

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex relative">
            {/* Mode Toggle - Fixed Position */}
            <div className="fixed top-4 left-4 z-50">
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
};