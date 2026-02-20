export interface RoleItem {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];

    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;

    createdBy?: {
        _id: string;
        email: string;
        name: string;
    };
}

export interface FeatureItem {
    _id: string;
    name: string;
    category: string;
    isActive: boolean;
}

export interface RolesApiResponse {
    success: boolean;
    message: string;
    data: {
        roles: RoleItem[];
    };
}

export interface FeaturesApiResponse {
    success: boolean;
    message: string;
    data: {
        features: FeatureItem[];
    };
}

export interface GetRoleResponse {
    success: boolean;
    message: string;
    data: RoleItem;
}