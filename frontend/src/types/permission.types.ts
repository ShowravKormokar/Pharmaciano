export type Permission = string;

export interface Role {
    name: string;
    description?: string;
    permissions: Permission[];
}

export interface UserAuthProfile {
    _id: string;
    email: string;
    name: string;
    role: Role;
}