import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import screenReducer from "../features/screen/screenSlice";
import customersReducer from "../features/customerScreen/customerSlice";
import productsReducer from "../features/productScreen/productSlice";
import invoicesReducer from "../features/invoiceScreen/invoiceSlice";

export const store = configureStore({
  reducer: {
    screen: screenReducer,
    customers: customersReducer,
    products: productsReducer,
    invoices: invoicesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
