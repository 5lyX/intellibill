import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Invoice = {
  id: string;
  customerName: string;
  date: string;
  productName: string;
  quantity: number;
  serialNumber: string;
  tax: number;
  taxPercentage: number;
  totalAmount: number;
};

type InvoiceState = Invoice[];

const initialState: InvoiceState = [];

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice | Invoice[]>) => {
      const invoicesToAdd = Array.isArray(action.payload)
        ? action.payload.flat()
        : [action.payload];
      state.push(...invoicesToAdd);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
  },
});

export const { addInvoice, updateInvoice, deleteInvoice } =
  invoiceSlice.actions;
export const selectInvoices = (state: any) => state.invoices;
export default invoiceSlice.reducer;
