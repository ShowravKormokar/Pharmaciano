export interface BranchContact {
    phone: string;
    email: string;
}

export interface BranchItem {
    _id: string;
    name: string;
    address: string;
    contact: BranchContact;
    orgName?: string;          // for create/update requests
    organizationId?: {
        _id: string;
        name: string;
    };
    isActive: boolean;
    createdBy?: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface BranchesApiResponse {
    success: boolean;
    message: string;
    length?: number;
    data: {
        branch: BranchItem[];
    };
}

export interface BranchApiResponse {
    success: boolean;
    message: string;
    data: {
        branch: BranchItem;
    };
}