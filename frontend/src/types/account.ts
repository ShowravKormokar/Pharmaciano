export interface AccountItem {
    _id: string;
    name: string;
    type: 'asset' | 'liability' | 'income' | 'expense' | 'equity';
    code: string;
    parentId?: {
        name: string;
        type: string;
        code: string;
    } | null;
    organizationId?: {
        name: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AccountsApiResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        count: number;
    };
    total: number;
    active: number;
    inActive: number;
    data: {
        accounts: AccountItem[];
    };
}

export interface AccountApiResponse {
    success: boolean;
    message: string;
    data: {
        account: AccountItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}

export interface CreateAccountPayload {
    name: string;
    type: string;
    code: string;
    isActive?: boolean;
    organizationName?: string;
}

export interface UpdateAccountPayload {
    name: string;
    type: string;
    code: string;
    isActive?: boolean;
    organizationName?: string;
}