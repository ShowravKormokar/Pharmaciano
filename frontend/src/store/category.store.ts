import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchCategoriesService,
    fetchCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from "@/services/category.service";
import type { CategoryItem } from "@/types/category";
import { toast } from "sonner";

interface CategoryState {
    categories: CategoryItem[];
    loading: boolean;
    error: string | null;

    form: {
        name: string;
        description: string;
        isActive: boolean;
    };

    fetchCategories: () => Promise<void>;
    fetchCategoryById: (id: string) => Promise<CategoryItem | null>;
    createCategory: () => Promise<boolean>;
    updateCategory: (id: string) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
    setForm: (data: Partial<CategoryState["form"]>) => void;
    resetForm: () => void;
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set, get) => ({
            categories: [],
            loading: false,
            error: null,

            form: {
                name: "",
                description: "",
                isActive: true,
            },

            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),

            resetForm: () =>
                set({
                    form: { name: "", description: "", isActive: true },
                }),

            fetchCategories: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchCategoriesService();
                    set({ categories: res.data.category });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch categories";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            fetchCategoryById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchCategoryByIdService(id);
                    return res.data.category;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch category";
                    set({ error: msg });
                    toast.error(msg);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            createCategory: async () => {
                set({ loading: true, error: null });
                try {
                    const { name, description } = get().form;
                    if (!name) {
                        throw new Error("Category name is required");
                    }
                    const payload = { name, description: description || undefined };
                    const res = await createCategoryService(payload);
                    toast.success(res.message || "Category created successfully", {
                        duration: 3000,
                    });
                    await get().fetchCategories();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create category";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateCategory: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const { name, description } = get().form;
                    if (!name) {
                        throw new Error("Category name is required");
                    }
                    const payload = { name, description: description || undefined };
                    const res = await updateCategoryService(id, payload);
                    toast.success(res.message || "Category updated successfully", {
                        duration: 3000,
                    });
                    await get().fetchCategories();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update category";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteCategory: async (id: string) => {
                try {
                    const res = await deleteCategoryService(id);
                    toast.success(res.message || "Category deleted successfully", {
                        duration: 3000,
                    });
                    set((state) => ({
                        categories: state.categories.filter((c) => c._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete category";
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "category-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);