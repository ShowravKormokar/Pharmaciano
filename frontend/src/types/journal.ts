export interface JournalItem {
    _id: string;
    organizationId: { name: string } | string;
    branchId: { name: string } | string;
    debitAccountId: {
        _id: string;
        name: string;
        code: string;
        type: string;
    } | string;
    creditAccountId: {
        _id: string;
        name: string;
        code: string;
        type: string;
    } | string;
    amount: number;
    referenceType: 'Sale' | 'Purchase' | 'Expense' | 'Drawing' | 'Capital' | 'Manual';
    referenceId?: string;
    note?: string;
    isReversed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface JournalsApiResponse {
    success: boolean;
    message: string;
    total: number;
    totalReversals: number;
    totalUnreversals: number;
    meta: {
        page: number;
        limit: number;
        count: number;
    };
    data: {
        journal: JournalItem[];
    };
}

export interface JournalApiResponse {
    success: boolean;
    message: string;
    data: {
        journal: JournalItem;
    };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}

export interface CreateJournalPayload {
    debitAccountId: string;
    creditAccountId: string;
    amount: number;
    referenceType: string;
    referenceId?: string;
    note?: string;
    organizationName?: string;
    branchName?: string;
}

export interface ReverseJournalPayload {
    // no body required, just POST to /reverse
}