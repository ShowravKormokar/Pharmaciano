'use client';
import { PermissionGuard } from "@/hooks/guards/PermissionGuard";
import { RouteGuard } from "@/hooks/guards/RouteGuard";
import { Users } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold ">Users Management</h1>
                    <p className=" mt-1">
                        Manage organization users and permissions
                    </p>
                </div>
                <PermissionGuard permission="user:create">
                    <button onClick={() => console.log("Add user")} className="px-4 py-2 rounded-lg border transition-colors cursor-pointer border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground">
                        Add User
                    </button>
                </PermissionGuard>
                {/* <RouteGuard permission="user:create">
                    <button onClick={() => console.log("Add user")} className="px-4 py-2 rounded-lg border transition-colors cursor-pointer border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground">
                        Add User
                    </button>
                </RouteGuard> */}
            </div>

            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Users List</h2>
                    <div className="space-y-4">
                        {/* Demo user list */}
                        {[
                            { name: 'Admin User', email: 'admin@pharmacare.com', role: 'Admin', status: 'Active' },
                            { name: 'Sales Manager', email: 'sales@pharmacare.com', role: 'Salesman', status: 'Active' },
                            { name: 'John Doe', email: 'john@pharmacare.com', role: 'Staff', status: 'Inactive' }
                        ].map((user, index) => (
                            <div key={index} className="flex items-center justify-between lg:p-4 p-3 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="lg:w-10 w-8 h-10 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 " />
                                    </div>
                                    <div>
                                        <p className="font-medium ">{user.name}</p>
                                        <p className="text-sm ">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex lg:flex-row flex-col items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                    <span className="text-sm py-1 rounded">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}