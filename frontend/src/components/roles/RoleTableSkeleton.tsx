"use client";

export default function RoleTableSkeleton() {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                    <tr>
                        <th className="p-4 text-left">Role Name</th>
                        <th className="p-4 text-left">Description</th>
                        <th className="p-4 text-left">Permissions</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {[1, 2, 3, 4].map((row) => (
                        <tr key={row} className="border-b">
                            <td className="p-4">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            </td>
                            <td className="p-4">
                                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="h-8 w-16 bg-muted animate-pulse rounded ml-auto" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};