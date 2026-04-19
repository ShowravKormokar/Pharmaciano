export interface SaleItem {
    _id: string;
    invoiceNo: string;
    organizationId: { name: string; address: string; contact: { phone: string; email: string } };
    branchId: { name: string; address: string; contact: { phone: string; email: string } };
    cashierId: { name: string; email: string; phone?: string };
    customerName?: string;
    customerPhone?: string;
    items: SaleItemDetail[];
    subtotal: number;
    discount: number;
    tax: number;
    totalAmount: number;
    paymentMethod: 'cash' | 'card' | 'mobile' | 'bank_transfer';
    status?: string; // backend may not include status; we can derive from items stock?
    createdAt: string;
    updatedAt: string;
}

export interface SaleItemDetail {
    medicineId?: {
        name: string;
        genericName?: string;
        strength?: string;
        unit?: string;
        unitPrice?: number;
    };
    medicineName: string;
    batchNo: string;
    quantity: number;
    sellingPrice: number;
    purchasePrice?: number;
    _id?: string;
}

export interface CreateSalePayload {
    customerName?: string;
    customerPhone?: string;
    discount: number;
    tax: number;
    paymentMethod: string;
    organizationName?: string;
    branchName?: string;
    items: Array<{
        medicineName: string;
        batchNo: string;
        quantity: number;
        sellingPrice: number;
    }>;
}

export interface UpdateSalePayload {
    customerName?: string;
    customerPhone?: string;
    discount?: number;
    tax?: number;
    paymentMethod?: string;
    organizationName?: string;
    branchName?: string;
    items?: Array<{
        medicineName: string;
        batchNo: string;
        quantity: number;
        sellingPrice?: number;
    }>;
}

export interface SalesApiResponse {
    success: boolean;
    message: string;
    total: number;
    active: number;
    expired: number;
    meta: {
        page: number;
        limit: number;
        count: number;
    };
    data: {
        sales: SaleItem[];
    };
}

export interface SingleSaleApiResponse {
    success: boolean;
    message: string;
    data: {
        sale: SaleItem;
    };
}

// For draft sale data
export interface DraftSale {
    id: string;                 // client‑generated unique ID
    createdAt: number;          // timestamp for sorting
    customerName: string;
    customerPhone: string;
    discount: number;
    tax: number;
    paymentMethod: string;
    cart: Array<{
        medicineName: string;
        batchNo: string;
        quantity: number;
        sellingPrice: number;
    }>;
}

export interface CartItem {
    medicineName: string;
    batchNo: string;
    quantity: number;
    sellingPrice: number;
}

export interface BasicApiResponse {
    success: boolean;
    message: string;
    id?: string;
    invoiceNo?: string;
}