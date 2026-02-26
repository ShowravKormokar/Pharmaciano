import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchUsersService,
    createUserService,
    updateUserService,
    deleteUserService,
} from "@/services/user.service";
import type { UserItem } from "@/types/user";

interface UserState {
    users: UserItem[];
    loading: boolean;
    error: string | null;

    // Form state for create/edit
    form: {
        email: string;
        password: string;
        name: string;
        role: string;
        orgName: string;
        branchName: string;
        warehouseName: string;
        phone: string;
        isActive: boolean;
    };

    // Actions
    fetchUsers: () => Promise<void>;
    createUser: () => Promise<boolean>;
    updateUser: (id: string) => Promise<boolean>;
    deleteUser: (id: string) => Promise<boolean>;
    setForm: (data: Partial<UserState["form"]>) => void;
    resetForm: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            users: [],
            loading: false,
            error: null,

            form: {
                email: "",
                password: "",
                name: "",
                role: "",
                orgName: "",
                branchName: "",
                warehouseName: "",
                phone: "",
                isActive: true,
            },

            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),

            resetForm: () =>
                set({
                    form: {
                        email: "",
                        password: "",
                        name: "",
                        role: "",
                        orgName: "",
                        branchName: "",
                        warehouseName: "",
                        phone: "",
                        isActive: true,
                    },
                }),

            fetchUsers: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchUsersService();
                    set({ users: res.data.users });
                } catch (err: any) {
                    set({ error: err?.message || "Failed to fetch users" });
                } finally {
                    set({ loading: false });
                }
            },

            createUser: async () => {
                set({ loading: true, error: null });
                try {
                    const { email, password, name, role, orgName, branchName, warehouseName, phone, isActive } = get().form;
                    if (!email || !password || !name || !role || !orgName || !branchName) {
                        set({ error: "Required fields missing" });
                        return false;
                    }
                    const payload = {
                        email,
                        password,
                        name,
                        role,
                        orgName,
                        branchName,
                        isActive,
                        ...(phone && { phone }),
                        ...(warehouseName && { warehouseName }),
                    };
                    await createUserService(payload);
                    await get().fetchUsers(); // refresh list
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to create user" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateUser: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { email, password, name, role, orgName, branchName, warehouseName, phone, isActive } = get().form;
                    if (!email || !name || !role || !orgName || !branchName) {
                        set({ error: "Required fields missing" });
                        return false;
                    }
                    const payload: any = {
                        email,
                        name,
                        role,
                        orgName,
                        branchName,
                    };
                    if (password) payload.password = password;
                    if (isActive !== undefined) payload.isActive = isActive;
                    if (phone) payload.phone = phone;
                    if (warehouseName) payload.warehouseName = warehouseName;

                    await updateUserService(id, payload);
                    await get().fetchUsers();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to update user" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteUser: async (id: string) => {
                try {
                    await deleteUserService(id);
                    set((state) => ({
                        users: state.users.filter((u) => u._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to delete user" });
                    return false;
                }
            },
        }),
        {
            name: "user-store",
            partialize: (state) => ({ form: state.form }), // persist form only
        }
    )
);