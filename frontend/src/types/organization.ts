export interface ContactInfo {
    phone: string;
    email: string;
}

export interface OrganizationItem {
    _id: string;
    name: string;
    tradeLicenseNo?: string;
    drugLicenseNo?: string;
    vatRegistrationNo?: string;
    address?: string;
    contact: ContactInfo;
    subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM'; // adjust as needed
    isActive: boolean;
    createdBy?: {
        _id: string;
        name: string;
        email: string;
    } | string; // could be ID or object
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationsApiResponse {
    success: boolean;
    message: string;
    data: {
        organization: OrganizationItem[];
    };
}

export interface OrganizationApiResponse {
    success: boolean;
    message: string;
    data: OrganizationItem;
}