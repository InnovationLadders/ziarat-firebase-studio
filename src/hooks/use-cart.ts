
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, SelectedOption } from '@/lib/types';

export type CartItem = {
  product: Product;
  quantity: number;
  selectedOptions?: SelectedOption[];
  finalPrice?: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedOptions?: SelectedOption[], finalPrice?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
};

// Helper to generate a unique ID for a cart item based on product ID and options
const getCartItemId = (product: Product, options?: SelectedOption[]): string => {
    if (!options || options.length === 0) {
        return product.id;
    }
    // Ensure options are sorted for consistent ID generation
    const sortedOptions = [...options].sort((a, b) => a.optionName.localeCompare(b.optionName));
    const optionString = sortedOptions.map(opt => `${opt.optionName}:${opt.choiceName}`).join('|');
    return `${product.id}-${optionString}`;
}


export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, selectedOptions = [], finalPrice) => {
        const cartItemId = getCartItemId(product, selectedOptions);
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => getCartItemId(item.product, item.selectedOptions) === cartItemId
        );
        
        if (existingItemIndex !== -1) {
          const updatedItems = [...currentItems];
          const existingItem = updatedItems[existingItemIndex];
          updatedItems[existingItemIndex] = {
             ...existingItem,
             quantity: existingItem.quantity + quantity,
          };
          set({ items: updatedItems });
        } else {
          set({
            items: [...currentItems, { product, quantity, selectedOptions, finalPrice: finalPrice || product.price }],
          });
        }
      },
      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) => getCartItemId(item.product, item.selectedOptions) !== cartItemId),
        });
      },
      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) {
            get().removeItem(cartItemId);
            return;
        }
        set({
            items: get().items.map((item) =>
                getCartItemId(item.product, item.selectedOptions) === cartItemId ? { ...item, quantity } : item
            ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
