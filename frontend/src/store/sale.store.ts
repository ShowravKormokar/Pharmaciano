import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    fetchSalesService,
    fetchSaleByIdService,
    createSaleService,
    updateSaleService,
    deleteSaleService,
    generateInvoicePdfService,
} from "@/services/sale.service";
import type { SaleItem, CreateSalePayload, UpdateSalePayload, CartItem } from "@/types/sale";
import { toast } from "sonner";

interface SaleState {
    sales: SaleItem[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        count: number;
    };

    // POS cart (unchanged)
    cart: Array<{
        medicineName: string;
        batchNo: string;
        quantity: number;
        sellingPrice: number;
    }>;
    customerName: string;
    customerPhone: string;
    discount: number;
    tax: number;
    paymentMethod: string;

    fetchSales: (page?: number, limit?: number, search?: string) => Promise<void>;
    fetchSaleById: (id: string) => Promise<SaleItem | null>;
    createSale: () => Promise<boolean>;
    updateSale: (id: string) => Promise<boolean>;
    deleteSale: (id: string) => Promise<boolean>;
    generateInvoicePdf: (id: string) => Promise<void>;
    resetForm: () => void;
    loadSaleIntoForm: (sale: SaleItem) => void;

    // Cart actions (unchanged)
    setCart: (cart: CartItem[]) => void;
    addToCart: (item: Omit<SaleState['cart'][0], 'quantity'>, quantity: number) => void;
    removeFromCart: (batchNo: string) => void;
    updateCartQuantity: (batchNo: string, quantity: number) => void;
    clearCart: () => void;
    setCustomer: (data: { customerName?: string; customerPhone?: string }) => void;
    setDiscount: (discount: number) => void;
    setTax: (tax: number) => void;
    setPaymentMethod: (method: string) => void;
}

export const useSaleStore = create<SaleState>()((set, get) => ({
    sales: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        count: 0,
    },
    cart: [],
    customerName: "",
    customerPhone: "",
    discount: 0,
    tax: 0,
    paymentMethod: "cash",

    fetchSales: async (page = 1, limit = 10, search = "") => {
        set({ loading: true, error: null });
        try {
            const res = await fetchSalesService(page, limit, search);
            set({
                sales: res.data.sales,
                pagination: {
                    page: res.meta.page,
                    limit: res.meta.limit,
                    total: res.total,
                    count: res.meta.count,
                },
            });
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to fetch sales";
            set({ error: msg });
            toast.error(msg);
        } finally {
            set({ loading: false });
        }
    },

    fetchSaleById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await fetchSaleByIdService(id);
            return res.data.sale;
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to fetch sale";
            set({ error: msg });
            toast.error(msg);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    createSale: async () => {
        set({ loading: true, error: null });
        try {
            const { cart, customerName, customerPhone, discount, tax, paymentMethod } = get();
            if (cart.length === 0) {
                throw new Error("Cart is empty");
            }
            const payload: CreateSalePayload = {
                customerName: customerName || undefined,
                customerPhone: customerPhone || undefined,
                discount,
                tax,
                paymentMethod,
                items: cart.map((item) => ({
                    medicineName: item.medicineName,
                    batchNo: item.batchNo,
                    quantity: item.quantity,
                    sellingPrice: item.sellingPrice,
                })),
            };
            const res = await createSaleService(payload);
            toast.success(res.message || "Sale created successfully", { duration: 3000 });
            get().clearCart(); // reset cart after successful sale
            return true;
        } catch (err: any) {
            const msg = err?.response?.data?.message || err.message || "Failed to create sale";
            const errors = err?.response?.data?.errors;
            const fullMsg = errors ? `${msg} - ${errors.map((e: any) => e.message).join(", ")}` : msg;
            set({ error: fullMsg });
            toast.error(fullMsg, { duration: 3000 });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateSale: async (id) => {
        set({ loading: true, error: null });
        try {
            const { cart, customerName, customerPhone, discount, tax, paymentMethod } = get();
            const payload: UpdateSalePayload = {
                customerName: customerName || undefined,
                customerPhone: customerPhone || undefined,
                discount,
                tax,
                paymentMethod,
                items: cart.map((item) => ({
                    medicineName: item.medicineName,
                    batchNo: item.batchNo,
                    quantity: item.quantity,
                    sellingPrice: item.sellingPrice,
                })),
            };
            const res = await updateSaleService(id, payload);
            toast.success(res.message || "Sale updated successfully", { duration: 3000 });
            return true;
        } catch (err: any) {
            const msg = err?.response?.data?.message || err.message || "Failed to update sale";
            set({ error: msg });
            toast.error(msg, { duration: 3000 });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    resetForm: () =>
        set({
            cart: [],
            customerName: "",
            customerPhone: "",
            discount: 0,
            tax: 0,
            paymentMethod: "cash",
        }),

    loadSaleIntoForm: (sale: SaleItem) =>
        set({
            cart: sale.items.map(item => ({
                medicineName: item.medicineName,
                batchNo: item.batchNo,
                quantity: item.quantity,
                sellingPrice: item.sellingPrice,
            })),
            customerName: sale.customerName || "",
            customerPhone: sale.customerPhone || "",
            discount: sale.discount,
            tax: sale.tax,
            paymentMethod: sale.paymentMethod,
        }),

    deleteSale: async (id) => {
        try {
            const res = await deleteSaleService(id);
            toast.success(res.message || "Sale deleted successfully", { duration: 3000 });
            set((state) => ({
                sales: state.sales.filter((s) => s._id !== id),
                error: null,
            }));
            return true;
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to delete sale";
            set({ error: msg });
            toast.error(msg, { duration: 3000 });
            return false;
        }
    },

    generateInvoicePdf: async (id: string) => {
        set({ loading: true });
        try {
            const blob = await generateInvoicePdfService(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Invoice downloaded successfully");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to generate invoice";
            toast.error(msg);
        } finally {
            set({ loading: false });
        }
    },

    // Cart actions
    setCart: (cart) => set({ cart }),

    addToCart: (item, quantity) => {
        set((state) => {
            const existing = state.cart.find((i) => i.batchNo === item.batchNo);
            if (existing) {
                return {
                    cart: state.cart.map((i) =>
                        i.batchNo === item.batchNo
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    ),
                };
            }
            return {
                cart: [...state.cart, { ...item, quantity }],
            };
        });
    },
    removeFromCart: (batchNo) => {
        set((state) => ({
            cart: state.cart.filter((i) => i.batchNo !== batchNo),
        }));
    },
    updateCartQuantity: (batchNo, quantity) => {
        set((state) => ({
            cart: state.cart.map((i) =>
                i.batchNo === batchNo ? { ...i, quantity } : i
            ),
        }));
    },
    clearCart: () => set({ cart: [] }),
    setCustomer: (data) => set((state) => ({ ...state, ...data })),
    setDiscount: (discount) => set({ discount }),
    setTax: (tax) => set({ tax }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
})
);