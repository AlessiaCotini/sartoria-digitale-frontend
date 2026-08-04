export const FRAZIONE_SPALLA_MESH = 0.82;
const MARGINE_COLLO = 0.05;
export const FRAZIONE_COLLO_MESH = FRAZIONE_SPALLA_MESH + MARGINE_COLLO;

const MANICA_PER_CATEGORIA = {
  Camicie: "lunga",
  Magliette: "corta",
  Cardigan: "lunga",
  Giacche: "lunga",
  Completi: "lunga",
  Abiti: "nessuna",
  Gonne: "nessuna",
  Pantaloni: "nessuna",
};

const ECCEZIONI_MODELLO = {
  Smanicata: "nessuna",
  Canotta: "nessuna",
};

export function lunghezzaManica(categoria, modello) {
  if (ECCEZIONI_MODELLO[modello]) return ECCEZIONI_MODELLO[modello];
  return MANICA_PER_CATEGORIA[categoria] || "nessuna";
}

const COPERTURA_BRACCIO = {
  corta: 0.35,
  lunga: 1,
};

// fino a che altezza scende la manica lungo il braccio (stessa idea di ieri,
// ma qui serve solo per sapere DOVE dipingere, non per creare geometria)
export function frazioneFineManica(proporzioni, lunghezza) {
  const copertura = COPERTURA_BRACCIO[lunghezza] ?? 0;
  const frazione =
    FRAZIONE_SPALLA_MESH - proporzioni.frazioneBraccio * copertura;
  return Math.max(
    proporzioni.frazioneGinocchio,
    Math.min(frazione, FRAZIONE_SPALLA_MESH - 0.05),
  );
}
