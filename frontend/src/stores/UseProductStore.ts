import { create } from "zustand";
import Product from "@/types/Product";

interface ProductState {
    products: Product[];
    page: number;
    hasMore: boolean;
    fetchProducts: () => Promise<void>;
    addAdjustment: (productId: number, quantity: number) => void;
    deleteAdjustment: (productId: number, quantity: number) => void;
    editAdjustment: (adjustmentId: number, productId: number, oldQty: number, newQty: number) => void;
}

export const UseProductStore = create<ProductState>((set, get) => ({
    products: [],
    page: 1,
    hasMore: true,

    fetchProducts: async () => {
        const { page, products } = get();
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/products?page=${page}&limit=8`);
        const data = await response.json();

        set({
            products: [...products, ...data.data],
            page: page + 1,
            hasMore: data.data.length > 0, 
        });
    },

    addAdjustment: (productId, quantity) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, stock: product.stock + quantity } : product
      ),
    }));
  },
    
    deleteAdjustment: (productId, quantity) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, stock: product.stock - quantity } : product
      ),
    }));
  },

    editAdjustment: (adjustmentId, productId, oldQty, newQty) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, stock: product.stock - oldQty + newQty } : product
      ),
    }));
  },

}));

