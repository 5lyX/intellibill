import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Customer = {
  id: string;
  customerName: string;
  phoneNumber: string;
  totalPurchaseAmount: number;
};

type CustomerState = Customer[];

const initialState: CustomerState = [];

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer | Customer[]>) => {
      const customersToAdd = Array.isArray(action.payload)
        ? action.payload.flat()
        : [action.payload];
      state.push(...customersToAdd);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.findIndex(
        (customer) => customer.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      return state.filter((customer) => customer.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } =
  customersSlice.actions;
export const selectCustomers = (state: any) => state.customers;
export default customersSlice.reducer;
