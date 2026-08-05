import { createSlice } from "@reduxjs/toolkit";

const configuratoreSlice = createSlice({
  name: "configuratore",
  initialState: {
    materiale: null,
    colore: null,
    capoId: null,
    accessorioId: null,
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
      state.accessorioId = null;
    },
    impostaAccessorio: (state, action) => {
      state.accessorioId = action.payload;
      state.capoId = null;
    },
  },
});

export const {
  impostaMateriale,
  impostaColore,
  impostaCapo,
  impostaAccessorio,
} = configuratoreSlice.actions;
export default configuratoreSlice.reducer;
