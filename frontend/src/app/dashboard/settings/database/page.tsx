"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { downloadDatabaseBackupService } from "@/services/database.service";

export default function DatabaseBackupPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const [isDownloading, setIsDownloading] = useState(false);

    // Redirect if not super admin
    if (!authLoading && (!isAuthenticated || !isSuper)) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                        <ShieldAlert className="h-16 w-16 text-red-500" />
                        <h2 className="text-xl font-semibold">Access Denied</h2>
                        <p className="text-muted-foreground text-center">
                            This page is only accessible to Super Administrators.
                        </p>
                        <Button variant="outline" onClick={() => router.push("/dashboard")}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleBackup = async () => {
        setIsDownloading(true);
        try {
            const blob = await downloadDatabaseBackupService();
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `database-backup-${new Date().toISOString().slice(0, 19)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Database backup downloaded successfully");
        } catch (err: any) {
            // Try to read error message from blob response if possible
            let errorMsg = "Failed to download backup";
            if (err.response?.data instanceof Blob) {
                const text = await err.response.data.text();
                try {
                    const json = JSON.parse(text);
                    errorMsg = json.message || errorMsg;
                } catch {
                    errorMsg = text || errorMsg;
                }
            } else {
                errorMsg = err?.response?.data?.message || err?.message || errorMsg;
            }
            toast.error(errorMsg);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Database Backup</CardTitle>
                    <CardDescription>
                        Export your entire database as a JSON file. This operation is only available to Super Administrators.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">
                            <strong>Note:</strong> The backup includes all collections (users, sales, purchases, inventory, accounts, etc.). The file is downloaded as a JSON archive.
                        </p>
                    </div>
                    <Button
                        onClick={handleBackup}
                        disabled={isDownloading}
                        className="w-full"
                        size="lg"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? "Generating backup..." : "Download Database Backup"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}