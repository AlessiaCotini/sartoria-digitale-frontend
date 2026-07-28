import { createSlice } from "@reduxjs/toolkit";
import { MATERIALI } from "../data/materiali";

const materialeIniziale = MATERIALI[0];

const configuratoreSlice = createSlice({
  name: "configuratore",
  initialState: {
    materiale: materialeIniziale.nome,
    colore: materialeIniziale.colori[0].nome,
    capoId: null,
  },
  reducers: {
    impostaMateriale: (state, action) => {
      const nuovoMateriale = MATERIALI.find((m) => m.nome === action.payload);
      if (!nuovoMateriale) return;

      const coloreAncoraValido = nuovoMateriale.colori.some(
        (c) => c.nome === state.colore,
      );

      state.materiale = nuovoMateriale.nome;
      // se il colore che avevi scelto esiste anche nella palette del
      // nuovo materiale lo teniamo, altrimenti torniamo al primo disponibile
      state.colore = coloreAncoraValido
        ? state.colore
        : nuovoMateriale.colori[0].nome;
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
