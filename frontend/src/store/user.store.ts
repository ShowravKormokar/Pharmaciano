import { create } from "zustand";
import { fetchUsersService } from "@/services/user.service";
import type { UserItem } from "@/types/user";

interface UserState {
    users: UserItem[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    removeUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        try {
            set({ loading: true, error: null });
            const res = await fetchUsersService();
            set({ users: res.data.users });
        } catch (err: any) {
            set({ error: err?.message || "Failed to fetch users" });
        } finally {
            set({ loading: false });
        }
    },

    removeUser: (id) =>
        set((state) => ({
            users: state.users.filter((u) => u._id !== id),
        })),
}));