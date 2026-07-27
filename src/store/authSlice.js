import { createSlice } from "@reduxjs/toolkit";

const misureIniziali = {
  altezza: "",
  peso: "",
  torace: "",
  vita: "",
  fianchi: "",
  spalle: "",
  manica: "",
  gamba: "",
  collo: "",
  bicipite: "",
  polso: "",
  busto: "",
  coscia: "",
  ginocchio: "",
  caviglia: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    utente: null,
    misure: misureIniziali,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.utente = action.payload?.utente ?? null;
      // se la registrazione passa già le misure le usiamo,
      // altrimenti restano quelle vuote di default
      state.misure = action.payload?.misure ?? misureIniziali;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.utente = null;
      state.misure = misureIniziali;
    },
    aggiornaMisure: (state, action) => {
      state.misure = { ...state.misure, ...action.payload };
    },
  },
});

export const { login, logout, aggiornaMisure } = authSlice.actions;
export default authSlice.reducer;
