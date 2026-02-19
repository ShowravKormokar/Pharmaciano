import { create } from "zustand";
import { fetchRolesService, RoleItem, deleteRoleService } from "@/services/role.service";

interface RoleState {
    roles: RoleItem[];
    loading: boolean;
    error: string | null;
    fetchRoles: () => Promise<void>;
    removeRole: (id: string) => void;
    deleteRole: (id: string) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
    roles: [],
    loading: false,
    error: null,

    fetchRoles: async () => {
        try {
            set({ loading: true, error: null });
            const res = await fetchRolesService();
            set({ roles: res.data.roles });
        } catch (err: any) {
            set({ error: err?.message || "Failed to fetch roles" });
        } finally {
            set({ loading: false });
        }
    },

    removeRole: (id) =>
        set((state) => ({
            roles: state.roles.filter((r) => r._id !== id),
        })),

    deleteRole: async (id) => {
        try {
            await deleteRoleService(id);
            set((state) => ({
                roles: state.roles.filter((r) => r._id !== id),
            }));
        } catch (err: any) {
            console.error("Failed to delete role:", err);
        }
    },
}));