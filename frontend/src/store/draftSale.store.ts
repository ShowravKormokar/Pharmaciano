import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DraftSale } from "@/types/sale";
import { useSaleStore } from "./sale.store";

interface DraftSaleState {
    drafts: DraftSale[];
    activeDraftId: string | null;
    createDraft: () => void;
    loadDraft: (id: string) => void;
    updateCurrentDraft: () => void;   // saves current form state to active draft
    deleteDraft: (id: string) => void;
    completeCurrentDraft: () => Promise<void>;
}

export const useDraftSaleStore = create<DraftSaleState>()(
    persist(
        (set, get) => ({
            drafts: [],
            activeDraftId: null,

            createDraft: () => {
                const newId = `draft_${Date.now()}`;
                const newDraft: DraftSale = {
                    id: newId,
                    createdAt: Date.now(),
                    customerName: "",
                    customerPhone: "",
                    discount: 0,
                    tax: 0,
                    paymentMethod: "cash",
                    cart: [],
                };
                set({
                    drafts: [...get().drafts, newDraft],
                    activeDraftId: newId,
                });
                // Reset the current sale form
                const { resetForm, clearCart } = useSaleStore.getState();
                resetForm();
                clearCart();
            },

            loadDraft: (id: string) => {
                const draft = get().drafts.find(d => d.id === id);
                if (draft) {
                    set({ activeDraftId: id });
                    // Sync to main sale store
                    // const { setForm, setCart } = useSaleStore.getState();
                    // setForm({
                    //     customerName: draft.customerName,
                    //     customerPhone: draft.customerPhone,
                    //     discount: draft.discount,
                    //     tax: draft.tax,
                    //     paymentMethod: draft.paymentMethod,
                    // });
                    // setCart(draft.cart);
                    const saleState = useSaleStore.getState();
                    saleState.customerName = draft.customerName;
                    saleState.customerPhone = draft.customerPhone;
                    saleState.discount = draft.discount;
                    saleState.tax = draft.tax;
                    saleState.paymentMethod = draft.paymentMethod;
                    saleState.setCart(draft.cart);
                }
            },

            updateCurrentDraft: () => {
                const { activeDraftId, drafts } = get();
                if (!activeDraftId) return;
                const current = useSaleStore.getState();
                const updatedDraft: DraftSale = {
                    id: activeDraftId,
                    createdAt: drafts.find(d => d.id === activeDraftId)?.createdAt || Date.now(),
                    customerName: current.customerName,
                    customerPhone: current.customerPhone,
                    discount: current.discount,
                    tax: current.tax,
                    paymentMethod: current.paymentMethod,
                    cart: current.cart,
                };
                set({
                    drafts: drafts.map(d => d.id === activeDraftId ? updatedDraft : d),
                });
            },

            deleteDraft: (id: string) => {
                set((state) => ({
                    drafts: state.drafts.filter(d => d.id !== id),
                    activeDraftId: state.activeDraftId === id ? null : state.activeDraftId,
                }));
                // If no active draft left, reset the current sale form
                if (get().activeDraftId === null) {
                    const { resetForm, clearCart } = useSaleStore.getState();
                    resetForm();
                    clearCart();
                }
            },

            completeCurrentDraft: async () => {
                const { activeDraftId } = get();
                if (!activeDraftId) return;
                const success = await useSaleStore.getState().createSale();
                if (success) {
                    get().deleteDraft(activeDraftId);
                }
            },
        }),
        {
            name: "draft-sale-store",
            partialize: (state) => ({ drafts: state.drafts, activeDraftId: state.activeDraftId }),
        }
    )
);