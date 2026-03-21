import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchRolesService,
    createRoleService,
    updateRoleService,
    deleteRoleService,
    fetchFeaturesService,
    fetchRoleByIdService,
} from "@/services/role.service";
import type { RoleItem, FeatureItem } from "@/types/role";
import { toast } from "sonner";

interface RoleState {
    roles: RoleItem[];
    features: FeatureItem[];
    loading: boolean;
    error: string | null;

    form: {
        name: string;
        description: string;
        permissions: string[];
        isActive: boolean;
    };

    fetchRoles: () => Promise<void>;
    fetchFeatures: () => Promise<void>;
    fetchRoleById: (id: string) => Promise<RoleItem | null>;
    createRole: () => Promise<boolean>;
    updateRole: (id: string) => Promise<boolean>;
    deleteRole: (id: string) => Promise<boolean>;

    setForm: (data: Partial<RoleState["form"]>) => void;
    resetForm: () => void;
}

export const useRoleStore = create<RoleState>()(
    persist(
        (set, get) => ({
            roles: [],
            features: [],
            loading: false,
            error: null,

            form: {
                name: "",
                description: "",
                permissions: [],
                isActive: true,
            },

            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),

            resetForm: () =>
                set({
                    form: { name: "", description: "", isActive: true, permissions: [] },
                }),

            fetchRoles: async () => {
                set({ loading: true, error: null });
                try {
                    const roles = await fetchRolesService();
                    set({ roles });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch roles";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            fetchFeatures: async () => {
                set({ loading: true });
                try {
                    const features = await fetchFeaturesService();
                    set({ features });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch features";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            fetchRoleById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const role = await fetchRoleByIdService(id);
                    // Optionally update the roles list with this fresh data
                    set((state) => ({
                        roles: state.roles.map(r => r._id === id ? role : r),
                        loading: false
                    }));
                    return role;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch role";
                    set({ error: msg, loading: false });
                    toast.error(msg);
                    return null;
                }
            },

            createRole: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, description, permissions, isActive } = get().form;

                    if (!name || permissions.length === 0) {
                        throw new Error("Role name and at least one permission are required.");
                    }

                    const payload = {
                        name: name.toUpperCase(),
                        description,
                        permissions: Array.from(new Set(permissions)),
                        isActive,
                    };

                    const res = await createRoleService(payload);
                    toast.success(res.data?.message || "Role created successfully", { duration: 3000 });
                    await get().fetchRoles();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create role";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateRole: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { name, description, permissions, isActive } = get().form;

                    if (!name || permissions.length === 0) {
                        throw new Error("Role name and at least one permission are required.");
                    }

                    const payload = {
                        name: name.toUpperCase(),
                        description,
                        permissions: Array.from(new Set(permissions)),
                        isActive,
                    };

                    const res = await updateRoleService(id, payload);
                    toast.success(res.data?.message || "Role updated successfully", { duration: 3000 });
                    await get().fetchRoles();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update role";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteRole: async (id: string) => {
                try {
                    const res = await deleteRoleService(id);
                    toast.success(res.data?.message || "Role deleted successfully", { duration: 3000 });
                    set((state) => ({
                        roles: state.roles.filter((r) => r._id !== id),
                        error: null,
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete role";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "role-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);