import { createSlice } from "@reduxjs/toolkit";

const configuratoreSlice = createSlice({
  name: "configuratore",
  initialState: {
    materiale: null,
    colore: null,
    capoId: null,
  },
  reducers: {
    impostaMateriale: (state, action) => {
      state.materiale = action.payload;
    },
    impostaColore: (state, action) => {
      state.colore = action.payload;
    },
    impostaCapo: (state, action) => {
      state.capoId = action.payload;
    },
  },
});

export const { impostaMateriale, impostaColore, impostaCapo } =
  configuratoreSlice.actions;
export default configuratoreSlice.reducer;
