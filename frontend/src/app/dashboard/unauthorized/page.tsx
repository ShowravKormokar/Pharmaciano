import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center px-4">
            <ShieldX className="h-16 w-16 text-destructive" />
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground max-w-md">
                You don't have permission to view this page. Contact your administrator
                if you believe this is a mistake.
            </p>
            <Button asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    );
}