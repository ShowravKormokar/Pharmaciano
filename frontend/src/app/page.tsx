"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function HomePage() {
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn) {
            router.replace("/dashboard");
        } else {
            router.replace("/login");
        }
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Spinner variant="bars" />
                <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    return null;
};