import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchUsersService,
    createUserService,
    updateUserService,
    deleteUserService,
} from "@/services/user.service";
import type { UserItem } from "@/types/user";
import { toast } from "sonner";

interface UserState {
    users: UserItem[];
    loading: boolean;
    error: string | null;

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
                    const msg = err?.response?.data?.message || "Failed to fetch users";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            createUser: async () => {
                set({ loading: true, error: null });
                try {
                    const { email, password, name, role, orgName, branchName, warehouseName, phone, isActive } = get().form;
                    if (!email || !password || !name || !role || !orgName || !branchName) {
                        throw new Error("Required fields missing");
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
                    const res = await createUserService(payload);
                    toast.success(res.message || "User created successfully", { duration: 3000 });
                    await get().fetchUsers();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create user";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
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
                        throw new Error("Required fields missing");
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

                    const res = await updateUserService(id, payload);
                    toast.success(res.message || "User updated successfully", { duration: 3000 });
                    await get().fetchUsers();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update user";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteUser: async (id: string) => {
                try {
                    const res = await deleteUserService(id);
                    toast.success(res.message || "User deleted successfully", { duration: 3000 });
                    set((state) => ({
                        users: state.users.filter((u) => u._id !== id),
                        error: null,
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete user";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "user-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);