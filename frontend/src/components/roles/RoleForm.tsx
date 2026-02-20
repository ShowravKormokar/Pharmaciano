"use client";

import { useEffect, useMemo, useState } from "react";
import { useRoleStore } from "@/store/role.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
    roleId?: string;
}

/**
 * All possible granular actions
 */
const ACTIONS = [
    "read",
    "create",
    "update",
    "delete",
    "view",
    "list",
    "process",
    "return",
    "adjust",
    "import",
    "export",
    "approve",
    "transfer",
    "predict",
    "recommend",
];

export default function RoleForm({ roleId }: Props) {
    const {
        form,
        setForm,
        createRole,
        updateRole,
        features,
        fetchFeatures,
    } = useRoleStore();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchFeatures();
    }, []);

    /**
     * Group features by category (only active)
     */
    const groupedFeatures = useMemo(() => {
        return features.reduce((acc: any, feature: any) => {
            if (!feature.isActive) return acc;

            if (!acc[feature.category]) {
                acc[feature.category] = [];
            }

            acc[feature.category].push(feature);
            return acc;
        }, {});
    }, [features]);

    const handleSubmit = async () => {
        if (roleId) {
            await updateRole(roleId);
        } else {
            await createRole();
        }
    };

    return (
        <div className="space-y-6">
            {/* ================= BASIC INFO ================= */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Role Name"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />

                    <Textarea
                        placeholder="Role Description"
                        value={form.description}
                        onChange={(e) => setForm({ description: e.target.value })}
                    />
                </CardContent>
            </Card>

            {/* ================= PERMISSIONS ================= */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>Permissions</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {Object.entries(groupedFeatures).map(
                        ([category, features]: any) => {
                            const base = features[0].name.split(":")[0]; // accounting
                            const managePermission = `${base}:manage`;
                            const allPermissions = ACTIONS.map(
                                (a) => `${base}:${a}`
                            );

                            const isExpanded = expanded[category] || false;
                            const hasManage =
                                form.permissions.includes(managePermission);

                            return (
                                <div
                                    key={category}
                                    className="border rounded-xl p-4 bg-muted/20"
                                >
                                    {/* ===== CATEGORY HEADER ===== */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpanded((prev) => ({
                                                ...prev,
                                                [category]: !prev[category],
                                            }))
                                        }
                                        className="flex items-center justify-between w-full font-semibold"
                                    >
                                        <span>{category}</span>
                                        {isExpanded ? (
                                            <ChevronDown size={18} />
                                        ) : (
                                            <ChevronRight size={18} />
                                        )}
                                    </button>

                                    {/* ===== EXPANDABLE CONTENT ===== */}
                                    {isExpanded && (
                                        <div className="mt-4 space-y-4">
                                            {/* ===== MANAGE (FULL ACCESS) ===== */}
                                            <label className="flex items-center gap-2 font-semibold text-primary">
                                                <input
                                                    type="checkbox"
                                                    checked={hasManage}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setForm({
                                                                permissions: [
                                                                    ...new Set([
                                                                        ...form.permissions,
                                                                        managePermission,
                                                                        ...allPermissions,
                                                                    ]),
                                                                ],
                                                            });
                                                        } else {
                                                            setForm({
                                                                permissions:
                                                                    form.permissions.filter(
                                                                        (p) =>
                                                                            p !== managePermission &&
                                                                            !allPermissions.includes(p)
                                                                    ),
                                                            });
                                                        }
                                                    }}
                                                />
                                                {base}:manage (Full Access)
                                            </label>

                                            {/* ===== GRANULAR ACTIONS ===== */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {ACTIONS.map((action) => {
                                                    const permission = `${base}:${action}`;
                                                    const isChecked =
                                                        form.permissions.includes(permission);

                                                    return (
                                                        <label
                                                            key={permission}
                                                            className="flex items-center gap-2 text-sm border rounded-lg p-2 hover:bg-muted/50 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        const updated = [
                                                                            ...form.permissions,
                                                                            permission,
                                                                        ];

                                                                        const allSelected =
                                                                            allPermissions.every((p) =>
                                                                                updated.includes(p)
                                                                            );

                                                                        setForm({
                                                                            permissions: allSelected
                                                                                ? [
                                                                                    ...new Set([
                                                                                        ...updated,
                                                                                        managePermission,
                                                                                    ]),
                                                                                ]
                                                                                : updated,
                                                                        });
                                                                    } else {
                                                                        setForm({
                                                                            permissions:
                                                                                form.permissions.filter(
                                                                                    (p) =>
                                                                                        p !== permission &&
                                                                                        p !== managePermission
                                                                                ),
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            {action}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    )}
                </CardContent>
            </Card>

            {/* ================= SUBMIT ================= */}
            <Button className="w-full" onClick={handleSubmit}>
                {roleId ? "Update Role" : "Create Role"}
            </Button>
        </div>
    );
};