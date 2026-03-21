"use client";

import { useEffect, useMemo, useState } from "react";
import { useRoleStore } from "@/store/role.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

export default function RoleForm({ roleId, onSuccess }: Props) {
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
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);
        // Backend requires uppercase
        setForm({ name: form.name.toUpperCase() });

        const success = roleId ? await updateRole(roleId) : await createRole();

        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    if (!features.length) {
        return <p className="text-sm text-muted-foreground">Loading permissions...</p>;
    }

    return (
        <div className="space-y-6">
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
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) => setForm({ isActive: checked })}
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>
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
                    disabled={submitting}
                >
                    {submitting
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
                        disabled={submitting}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}