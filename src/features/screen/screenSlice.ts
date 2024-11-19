import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScreenState {
  currentScreen: string;
}

const initialState: ScreenState = {
  currentScreen: "Home",
};

const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<string>) {
      state.currentScreen = action.payload;
    },
  },
});

export const { setScreen } = screenSlice.actions;
export default screenSlice.reducer;
