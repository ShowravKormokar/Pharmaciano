import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchOrganizationsService,
    createOrganizationService,
    updateOrganizationService,
    deleteOrganizationService,
} from "@/services/organization.service";
import type { OrganizationItem } from "@/types/organization";
import { toast } from "sonner";

interface OrganizationState {
    organizations: OrganizationItem[];
    loading: boolean;
    error: string | null;

    form: {
        name: string;
        tradeLicenseNo: string;
        drugLicenseNo: string;
        vatRegistrationNo: string;
        address: string;
        contactPhone: string;
        contactEmail: string;
        subscriptionPlan: string;
        isActive: boolean;
    };

    fetchOrganizations: () => Promise<void>;
    createOrganization: () => Promise<boolean>;
    updateOrganization: (id: string) => Promise<boolean>;
    deleteOrganization: (id: string) => Promise<boolean>;
    setForm: (data: Partial<OrganizationState["form"]>) => void;
    resetForm: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
    persist(
        (set, get) => ({
            organizations: [],
            loading: false,
            error: null,

            form: {
                name: "",
                tradeLicenseNo: "",
                drugLicenseNo: "",
                vatRegistrationNo: "",
                address: "",
                contactPhone: "",
                contactEmail: "",
                subscriptionPlan: "FREE",
                isActive: true,
            },

            setForm: (data) =>
                set((state) => ({
                    form: { ...state.form, ...data },
                })),

            resetForm: () =>
                set({
                    form: {
                        name: "",
                        tradeLicenseNo: "",
                        drugLicenseNo: "",
                        vatRegistrationNo: "",
                        address: "",
                        contactPhone: "",
                        contactEmail: "",
                        subscriptionPlan: "FREE",
                        isActive: true,
                    },
                }),

            fetchOrganizations: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetchOrganizationsService();
                    set({ organizations: res.data.organization });
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to fetch organizations";
                    set({ error: msg });
                    toast.error(msg);
                } finally {
                    set({ loading: false });
                }
            },

            createOrganization: async () => {
                set({ loading: true, error: null });
                try {
                    const {
                        name,
                        tradeLicenseNo,
                        drugLicenseNo,
                        vatRegistrationNo,
                        address,
                        contactPhone,
                        contactEmail,
                        subscriptionPlan,
                        isActive,
                    } = get().form;

                    if (!name || !contactPhone || !contactEmail || !subscriptionPlan) {
                        throw new Error("Name, contact, and subscription plan are required.");
                    }

                    const payload = {
                        name,
                        tradeLicenseNo: tradeLicenseNo || undefined,
                        drugLicenseNo: drugLicenseNo || undefined,
                        vatRegistrationNo: vatRegistrationNo || undefined,
                        address: address || undefined,
                        contact: {
                            phone: contactPhone,
                            email: contactEmail,
                        },
                        subscriptionPlan,
                        isActive,
                    };

                    const res = await createOrganizationService(payload);
                    toast.success(res.message || "Organization created successfully", { duration: 3000 });
                    await get().fetchOrganizations();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create organization";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateOrganization: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const {
                        name,
                        tradeLicenseNo,
                        drugLicenseNo,
                        vatRegistrationNo,
                        address,
                        contactPhone,
                        contactEmail,
                        subscriptionPlan,
                        isActive,
                    } = get().form;

                    if (!name || !contactPhone || !contactEmail || !subscriptionPlan) {
                        throw new Error("Name, contact, and subscription plan are required.");
                    }

                    const payload = {
                        name,
                        tradeLicenseNo: tradeLicenseNo || undefined,
                        drugLicenseNo: drugLicenseNo || undefined,
                        vatRegistrationNo: vatRegistrationNo || undefined,
                        address: address || undefined,
                        contact: {
                            phone: contactPhone,
                            email: contactEmail,
                        },
                        subscriptionPlan,
                        isActive,
                    };

                    const res = await updateOrganizationService(id, payload);
                    toast.success(res.message || "Organization updated successfully", { duration: 3000 });
                    await get().fetchOrganizations();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || "Failed to update organization";
                    set({ error: msg });
                    toast.error(msg, { duration: 3000 });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteOrganization: async (id: string) => {
                try {
                    const res = await deleteOrganizationService(id);
                    toast.success(res.message || "Organization deleted successfully", { duration: 3000 });
                    set((state) => ({
                        organizations: state.organizations.filter((org) => org._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    const msg = err?.response?.data?.message || "Failed to delete organization";
                    toast.error(msg, { duration: 3000 });
                    return false;
                }
            },
        }),
        {
            name: "organization-store",
            partialize: (state) => ({ form: state.form }),
        }
    )
);