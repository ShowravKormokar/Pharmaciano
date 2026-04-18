export interface PurchaseItem {
    _id: string;
    organizationId: { name: string; address?: string; contact?: any };
    branchId: { name: string; address?: string; contact?: any };
    supplierId: {
        name: string;
        contactPerson?: string;
        phone?: string;
        email?: string;
        address?: string;
    };
    warehouseId: { name: string; location?: string };
    purchaseNo: string;
    status: 'pending' | 'approved' | 'received' | 'cancelled';
    items: PurchaseItemDetail[];
    subtotal: number;
    discount: number;
    tax: number;
    totalAmount: number;
    paymentStatus: 'unpaid' | 'partial' | 'paid';
    paidAmount: number;
    dueAmount: number;
    approvedBy?: { name: string; email: string };
    createdAt: string;
    updatedAt: string;
}

export interface PurchaseItemDetail {
    medicineId?: {
        name: string;
        genericName?: string;
        strength?: string;
        unit?: string;
        unitPrice?: number;
    };
    medicineName: string;
    batchNo?: string;
    expiryDate?: string;
    quantity: number;
    purchasePrice: number;
    totalCost: number;
}

export interface CreatePurchasePayload {
    supplier: string;
    warehouseName: string;
    items: Array<{ medicineName: string; quantity: number }>;
    paymentStatus?: string;
    paidAmount?: number;
    organizationName?: string;
    branchName?: string;
}

export interface UpdatePurchasePayload {
    supplier?: string;
    warehouseName?: string;
    items?: Array<{ medicineName: string; quantity: number }>;
    paymentStatus?: string;
    paidAmount?: number;
    discount?: number;
    tax?: number;
    organizationName?: string;
    branchName?: string;
}

export interface ReceivePurchasePayload {
    items: Array<{
        medicineName: string;
        batchNo: string;
        expiryDate: string;
        purchasePrice: number;
    }>;
    paymentStatus?: string;
    paidAmount?: number;
    discount?: number;
    tax?: number;
}

export interface PurchasesApiResponse {
    success: boolean;
    message: string;
    meta: { page: number; limit: number; count: number };
    total: number;
    pending: number;
    approved: number;
    received: number;
    data: { purchase: PurchaseItem[] };
}

export interface PurchaseApiResponse {
    success: boolean;
    message: string;
    data: { purchase: PurchaseItem };
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
}