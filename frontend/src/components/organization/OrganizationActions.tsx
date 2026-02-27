"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganizationStore } from "@/store/organization.store";
import { OrganizationItem } from "@/types/organization";

interface Props {
    organization: OrganizationItem;
}

export default function OrganizationActions({ organization }: Props) {
    const router = useRouter();
    const deleteOrganization = useOrganizationStore((state) => state.deleteOrganization);
    const setForm = useOrganizationStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: organization.name,
            tradeLicenseNo: organization.tradeLicenseNo || "",
            drugLicenseNo: organization.drugLicenseNo || "",
            vatRegistrationNo: organization.vatRegistrationNo || "",
            address: organization.address || "",
            contactPhone: organization.contact.phone,
            contactEmail: organization.contact.email,
            subscriptionPlan: organization.subscriptionPlan,
            isActive: organization.isActive,
        });
        router.push(`/dashboard/organizations/edit/${organization._id}`);
    };

    const handleView = () => {
        router.push(`/dashboard/organizations/view/${organization._id}`);
    };

    const handleDelete = async (id: string) => {
        const success = await deleteOrganization(id);
        if (!success) {
            alert("Failed to delete organization. Please try again.");
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleView} title="View" className="border-[0.1rem] rounded-md">
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit} title="Edit">
                <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Organization?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the organization.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(organization._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}