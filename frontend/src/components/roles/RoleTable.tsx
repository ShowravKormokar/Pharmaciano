"use client";

import { RoleItem } from "@/services/role.service";
import RoleActions from "./RoleActions";

interface Props {
    roles: RoleItem[];
}

export default function RoleTable({ roles }: Props) {
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
                    {roles.map((role) => (
                        <tr key={role._id} className="border-b hover:bg-muted/10">
                            <td className="p-4 font-medium">{role.name}</td>
                            <td className="p-4">{role.description}</td>
                            <td className="p-4 flex flex-wrap gap-2">
                                {role.permissions.map((p) => (
                                    <span
                                        key={p}
                                        className="rounded-full bg-primary/10 px-3 py-1 text-xs"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </td>
                            <td className="p-4 text-right">
                                <RoleActions role={role} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};