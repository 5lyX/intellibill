import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Product = {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  tax: number;
  taxPercentage: number;
  priceWithTax: number;
  discount: number;
};

type ProductState = Product[];

const initialState: ProductState = [];

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product | Product[]>) {
      const productsToAdd = Array.isArray(action.payload)
        ? action.payload.flat()
        : [action.payload];
      state.push(...productsToAdd);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      return state.filter((product) => product.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productSlice.actions;
export const selectProducts = (state: any) => state.products;
export default productSlice.reducer;
