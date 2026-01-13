"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth-token="));

        if (token) {
            router.replace("/dashboard");
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Spinner variant="bars" />
            <p className="mt-4 text-muted-foreground">
                Checking authentication...
            </p>
        </div>
    );
}