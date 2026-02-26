import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchRolesService,
    createRoleService,
    updateRoleService,
    deleteRoleService,
    fetchFeaturesService,
} from "@/services/role.service";
import type { RoleItem, FeatureItem } from "@/types/role";

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
                const roles = await fetchRolesService();
                set({ roles });
            },

            fetchFeatures: async () => {
                set({ loading: true });
                try {
                    const features = await fetchFeaturesService();
                    set({ features });
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to fetch features" });
                } finally {
                    set({ loading: false });
                }
            },

            createRole: async () => {
                try {
                    const { name, description, permissions, isActive } = get().form;

                    if (!name || permissions.length === 0) {
                        set({ error: "Role name and at least one permission are required." });
                        return false;
                    }

                    // Ensure uppercase
                    const payload = {
                        name: name.toUpperCase(),
                        description,
                        // Only include unique permissions
                        permissions: Array.from(new Set(permissions)),
                        isActive,
                    };

                    const res = await createRoleService(payload);

                    // Optional: can show backend message
                    set({ error: null });
                    await get().fetchRoles();
                    get().resetForm();

                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Server error" });
                    return false;
                }
            },

            updateRole: async (id: string) => {
                try {
                    const { name, description, permissions, isActive } = get().form;

                    if (!name || permissions.length === 0) {
                        set({ error: "Role name and at least one permission are required." });
                        return false;
                    }

                    const payload = {
                        name: name.toUpperCase(),
                        description,
                        permissions: Array.from(new Set(permissions)),
                        isActive,
                    };

                    const res = await updateRoleService(id, payload);

                    set({ error: null });
                    await get().fetchRoles();
                    get().resetForm();

                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Server error" });
                    return false;
                }
            },

            deleteRole: async (id: string) => {
                try {
                    await deleteRoleService(id);
                    // Remove from local state only after successful API call
                    set((state) => ({
                        roles: state.roles.filter((r) => r._id !== id),
                        error: null,
                    }));
                    return true;
                } catch (err: any) {
                    const errorMsg = err?.response?.data?.message || "Failed to delete role";
                    set({ error: errorMsg });
                    return false;
                }
            },
        }),
        {
            name: "role-store", // localStorage key
            partialize: (state) => ({ form: state.form }), // persist only form
        }
    )
);