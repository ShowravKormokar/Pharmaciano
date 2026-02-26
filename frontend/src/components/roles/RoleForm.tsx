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
    onSuccess?: () => void;
}

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
        resetForm,
    } = useRoleStore();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchFeatures();
    }, []);

    const groupedFeatures = useMemo(() => {
        return features.reduce((acc: any, feature: any) => {
            if (!feature.isActive) return acc;
            if (!acc[feature.category]) acc[feature.category] = [];
            acc[feature.category].push(feature);
            return acc;
        }, {});
    }, [features]);

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);
        setErrorMsg(null);

        // Backend requires uppercase
        setForm({ name: form.name.toUpperCase() });

        try {
            const success = roleId
                ? await updateRole(roleId)
                : await createRole();

            if (success) {
                setMessage(roleId ? "Role updated successfully." : "Role created successfully.");
                if (!roleId) resetForm();

                // ✅ Call onSuccess after showing message (optional)
                // if (onSuccess) {
                //     setTimeout(() => {
                //         onSuccess();
                //     }, 1500);
                // }
            } else {
                setErrorMsg("Something went wrong.");
            }
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || "Server error");
        }

        setLoading(false);
    };

    if (!features.length) {
        return <p className="text-sm text-muted-foreground">Loading permissions...</p>;
    }

    return (
        <div className="space-y-6">
            {/* ===== ALERT MESSAGE ===== */}
            {message && (
                <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                    {message}
                </div>
            )}
            {errorMsg && (
                <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                    {errorMsg}
                </div>
            )}

            {/* ================= BASIC INFO ================= */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Role Name (UPPERCASE)"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ name: e.target.value.toUpperCase() })
                        }
                    />

                    <Textarea
                        placeholder="Role Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ description: e.target.value })
                        }
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
                            const base = features[0].name.split(":")[0];
                            const managePermission = `${base}:manage`;
                            const isExpanded = expanded[category] || false;
                            const hasManage =
                                form.permissions.includes(managePermission);

                            return (
                                <div
                                    key={category}
                                    className="border rounded-xl p-4 bg-muted/20"
                                >
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

                                    {isExpanded && (
                                        <div className="mt-4 space-y-4">
                                            {/* ===== MANAGE ===== */}
                                            <label className="flex items-center gap-2 font-semibold text-primary">
                                                <input
                                                    type="checkbox"
                                                    checked={hasManage}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            // remove granular permissions of this base
                                                            const filtered = form.permissions.filter(
                                                                (p) => !p.startsWith(`${base}:`)
                                                            );
                                                            setForm({
                                                                permissions: [...filtered, managePermission],
                                                            });
                                                        } else {
                                                            setForm({
                                                                permissions: form.permissions.filter(
                                                                    (p) => p !== managePermission
                                                                ),
                                                            });
                                                        }
                                                    }}
                                                />
                                                {managePermission} (Full Access)
                                            </label>

                                            {/* ===== GRANULAR ===== */}
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
                                                                disabled={hasManage}
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setForm({
                                                                            permissions: [
                                                                                ...form.permissions,
                                                                                permission,
                                                                            ],
                                                                        });
                                                                    } else {
                                                                        setForm({
                                                                            permissions:
                                                                                form.permissions.filter(
                                                                                    (p) => p !== permission
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

            {/* ================= BUTTONS ================= */}
            <div className="flex gap-3">
                <Button
                    className="w-1/2"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : roleId
                            ? "Update Role"
                            : "Create Role"}
                </Button>

                {!roleId && (
                    <Button
                        className="w-1/2"
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};