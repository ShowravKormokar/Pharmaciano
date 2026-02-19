"use client";

import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, User, Mail, Calendar, CheckCircle, Building, MapPin, Key, Clock } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function ProfileDetails() {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Spinner variant="bars" />
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-600">Loading...</h1>
                        {/* <p className="text-gray-500">Is still </p> */}
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 pb-8 max-w-6xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                <p className="text-gray-600">Detailed information about your account</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Basic account details and identification
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-lg font-semibold">{user.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                                    <p className="text-lg font-semibold flex items-center gap-2">
                                        {/* <Mail className="h-4 w-4" /> */}
                                        {user.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">User ID</label>
                                    <p className="text-sm font-mono text-gray-600">{user._id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${user.isActive ? 'text-green-500' : 'text-red-500'}`} />
                                        <Badge variant={user.isActive ? "default" : "destructive"}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role & Permissions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Role & Permissions
                            </CardTitle>
                            <CardDescription>
                                {user.roleId.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-500">Role</label>
                                <div className="mt-1">
                                    <Badge variant="secondary" className="text-lg px-3 py-1">
                                        {user.roleId.name}
                                    </Badge>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div>
                                <label className="text-sm font-medium text-gray-500 mb-2 block">Permissions</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {user.roleId.permissions?.map((permission: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-2 border-2 rounded-md"
                                        >
                                            <Key className="h-3 w-3 text-gray-400" />
                                            <span className="text-sm font-medium">{permission}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Total: {user.roleId.permissions?.length || 0} permissions
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Side Info */}
                <div className="space-y-6">
                    {/* Organization & Branch Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Organization
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Organization</label>
                                <p className="text-lg font-semibold">
                                    {user.organizationId?.name || "Not Assigned"}
                                </p>
                                {user.organizationId?.address && (
                                    <p className="text-sm text-gray-600">{user.organizationId.address}</p>
                                )}
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Branch
                                </label>
                                <p className="text-lg font-semibold">
                                    {user.branchId?.name || "Not Assigned"}
                                </p>
                                {user.branchId?.address && (
                                    <p className="text-sm text-gray-600">{user.branchId.address}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity & Timestamps Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Login</label>
                                <p className="text-lg font-semibold">
                                    {user.lastLogin || "Never logged in"}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-gray-500">Account Created</label>
                                <p className="text-sm">
                                    {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="text-sm">
                                    {user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Created By Card (if available) */}
                    {user.createdBy && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Created By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Name</label>
                                        <p className="font-semibold">{user.createdBy.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="font-semibold">{user.createdBy.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {user.roleId.permissions?.length || 0}
                                    </p>
                                    <p className="text-sm text-blue-500">Permissions</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">
                                        {user.isActive ? "Active" : "Inactive"}
                                    </p>
                                    <p className="text-sm text-green-500">Status</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Additional Info Section */}
            {/* <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Organization Name</label>
                            <p className="font-semibold">{user.orgName || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Branch Name</label>
                            <p className="font-semibold">{user.branchName || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Version</label>
                            <p className="font-semibold">{user.__v !== undefined ? `v${user.__v}` : "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card> */}

            {/* Raw JSON Data (for debugging) */}
            <details className="mt-8">
                <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
                    View Raw Data
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded-md text-xs overflow-auto max-h-64">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </details>
        </div>
    );
};