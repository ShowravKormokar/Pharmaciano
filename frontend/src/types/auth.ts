export interface LoginPayload {
    email: string;
    password: string;
}

export interface Role {
    name: string;
    description: string;
    permissions: string[];
}

export interface CreatedBy {
    email: string;
    name: string;
}

export interface UserProfile {
    _id: string;
    email: string;
    name: string;
    orgName: string | null;
    branchName: string | null;
    roleId: Role;
    organization: any | null;
    branch: any | null;
    isActive: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    createdBy: CreatedBy;
}

export interface ProfileApiResponse {
    success: boolean;
    data: {
        profile: UserProfile;
    };
}

export interface LoginUser {
    id: string;
    email: string;
    name: string;
    role: string;
    lastLogin: string;
}

export interface LoginResponseData {
    token: string;
    user: UserProfile;
}

export interface LoginApiResponse {
    success: boolean;
    message: string;
    data: LoginResponseData;
}