import { raggioTorace } from "./tessuto";

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

// eccezioni: alcuni modelli non seguono il default della categoria
const ECCEZIONI_MODELLO = {
  Smanicata: "nessuna",
  Canotta: "nessuna",
};

export function lunghezzaManica(categoria, modello) {
  if (ECCEZIONI_MODELLO[modello]) return ECCEZIONI_MODELLO[modello];
  return MANICA_PER_CATEGORIA[categoria] || "nessuna";
}

export const COLONNE_MANICA = 10;
export const RIGHE_MANICA = 6;

// frazioni standard di statura (0 = piedi, 1 = cima testa): spalla, gomito, polso
const FRAZIONE_SPALLA = 0.82;
const FRAZIONE_FINE = {
  corta: 0.63, // gomito
  lunga: 0.485, // polso
};

// raggi di riferimento ricavati da circonferenze medie (bicipite/gomito/polso),
// stessa logica usata in tessuto.js: raggio = circonferenza / (2π)
const RAGGIO_BICIPITE = 28 / (2 * Math.PI) / 100;
const RAGGIO_FINE = {
  corta: 24 / (2 * Math.PI) / 100,
  lunga: 16 / (2 * Math.PI) / 100,
};

export function creaManica(corpo, proporzioni, lato, lunghezza) {
  const segno = lato === "destra" ? 1 : -1;
  const xSpalla = segno * raggioTorace(FRAZIONE_SPALLA, proporzioni);

  const ySpalla = corpo.yPiedi + corpo.altezzaModello * FRAZIONE_SPALLA;
  const yFine = corpo.yPiedi + corpo.altezzaModello * FRAZIONE_FINE[lunghezza];

  const raggioSpalla = RAGGIO_BICIPITE * proporzioni.scalaSpalle;
  const raggioFine = RAGGIO_FINE[lunghezza] * proporzioni.scalaSpalle;

  const posizioni = new Float32Array(COLONNE_MANICA * RIGHE_MANICA * 3);
  const uv = new Float32Array(COLONNE_MANICA * RIGHE_MANICA * 2);

  for (let riga = 0; riga < RIGHE_MANICA; riga++) {
    const t = riga / (RIGHE_MANICA - 1);
    const y = ySpalla - t * (ySpalla - yFine);
    const raggio = raggioSpalla + (raggioFine - raggioSpalla) * t;

    for (let colonna = 0; colonna < COLONNE_MANICA; colonna++) {
      const i = riga * COLONNE_MANICA + colonna;
      const angolo = (colonna / COLONNE_MANICA) * Math.PI * 2;

      posizioni[i * 3] = xSpalla + raggio * Math.cos(angolo);
      posizioni[i * 3 + 1] = y;
      posizioni[i * 3 + 2] = raggio * Math.sin(angolo);

      uv[i * 2] = colonna / (COLONNE_MANICA - 1);
      uv[i * 2 + 1] = 1 - t;
    }
  }

  const indici = [];
  for (let riga = 0; riga < RIGHE_MANICA - 1; riga++) {
    for (let colonna = 0; colonna < COLONNE_MANICA; colonna++) {
      const a = riga * COLONNE_MANICA + colonna;
      const b = riga * COLONNE_MANICA + ((colonna + 1) % COLONNE_MANICA);
      const c = a + COLONNE_MANICA;
      const d = b + COLONNE_MANICA;
      indici.push(a, c, b);
      indici.push(b, c, d);
    }
  }

  return { posizioni, uv, indici };
}
