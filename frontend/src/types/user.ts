export interface UserRole {
    name: string;
    permissions: string[];
}

export interface OrganizationInfo {
    name: string;
    address: string;
}

export interface BranchInfo {
    name: string;
    address: string;
}

export interface UserItem {
    _id: string;
    email: string;
    name: string;
    roleId: UserRole;
    organizationId: OrganizationInfo;
    branchId: BranchInfo;
    phone?: string;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UsersApiResponse {
    success: boolean;
    length: number;
    data: {
        users: UserItem[];
    };
}