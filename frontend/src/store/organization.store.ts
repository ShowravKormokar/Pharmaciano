// store/organization.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchOrganizationsService,
    createOrganizationService,
    updateOrganizationService,
    deleteOrganizationService,
} from "@/services/organization.service";
import type { OrganizationItem } from "@/types/organization";

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
                    set({ error: err?.response?.data?.message || "Failed to fetch organizations" });
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
                        set({ error: "Name, contact, and subscription plan are required." });
                        return false;
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

                    await createOrganizationService(payload);
                    await get().fetchOrganizations();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to create organization" });
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
                        set({ error: "Name, contact, and subscription plan are required." });
                        return false;
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

                    await updateOrganizationService(id, payload);
                    await get().fetchOrganizations();
                    get().resetForm();
                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to update organization" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            deleteOrganization: async (id: string) => {
                try {
                    await deleteOrganizationService(id);
                    set((state) => ({
                        organizations: state.organizations.filter((org) => org._id !== id),
                    }));
                    return true;
                } catch (err: any) {
                    set({ error: err?.response?.data?.message || "Failed to delete organization" });
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