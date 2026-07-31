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

// quanto della lunghezza reale del braccio copre ciascun tipo di manica:
// corta arriva a circa un terzo del braccio, lunga fino al polso
const COPERTURA_BRACCIO = {
  corta: 0.35,
  lunga: 1,
};

// raggi di riferimento (circonferenza/2π), scalati poi con le circonferenze
// reali della persona (scalaBicipite/scalaPolso) invece che con le spalle
const RAGGIO_BICIPITE_RIFERIMENTO = 28 / (2 * Math.PI) / 100;
const RAGGIO_FINE_RIFERIMENTO = {
  corta: 26 / (2 * Math.PI) / 100,
  lunga: 16 / (2 * Math.PI) / 100,
};

const MARGINE_SPALLA = 0.03;

function frazioneFineManica(proporzioni, lunghezza) {
  const copertura = COPERTURA_BRACCIO[lunghezza] ?? 0;
  const frazione =
    proporzioni.frazioneSpalle - proporzioni.frazioneBraccio * copertura;
  return Math.max(
    proporzioni.frazioneGinocchio,
    Math.min(frazione, proporzioni.frazioneSpalle - 0.05),
  );
}

export function creaManica(corpo, proporzioni, xSpalla, lunghezza) {
  const ySpalla =
    corpo.yPiedi + corpo.altezzaModello * proporzioni.frazioneSpalle;
  const yFine =
    corpo.yPiedi +
    corpo.altezzaModello * frazioneFineManica(proporzioni, lunghezza);

  const raggioSpalla =
    RAGGIO_BICIPITE_RIFERIMENTO * proporzioni.scalaBicipite + MARGINE_SPALLA;
  const raggioFineBase =
    lunghezza === "lunga"
      ? RAGGIO_FINE_RIFERIMENTO.lunga * proporzioni.scalaPolso
      : RAGGIO_FINE_RIFERIMENTO.corta * proporzioni.scalaBicipite;

  const posizioni = new Float32Array(COLONNE_MANICA * RIGHE_MANICA * 3);
  const uv = new Float32Array(COLONNE_MANICA * RIGHE_MANICA * 2);

  for (let riga = 0; riga < RIGHE_MANICA; riga++) {
    const t = riga / (RIGHE_MANICA - 1);
    const y = ySpalla - t * (ySpalla - yFine);
    const raggio = raggioSpalla + (raggioFineBase - raggioSpalla) * t;

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

export function creaToppaSpalla(corpo, proporzioni, xSpalla) {
  const segno = Math.sign(xSpalla) || 1;
  const ySpalla =
    corpo.yPiedi + corpo.altezzaModello * proporzioni.frazioneSpalle;
  const raggioManica =
    RAGGIO_BICIPITE_RIFERIMENTO * proporzioni.scalaBicipite + MARGINE_SPALLA;
  const raggioBusto = raggioTorace(proporzioni.frazioneSpalle, proporzioni);

  const posizioni = new Float32Array((COLONNE_MANICA + 1) * 3);
  posizioni[0] = segno * raggioBusto;
  posizioni[1] = ySpalla;
  posizioni[2] = 0;

  for (let colonna = 0; colonna < COLONNE_MANICA; colonna++) {
    const angolo = (colonna / COLONNE_MANICA) * Math.PI * 2;
    const i = colonna + 1;
    posizioni[i * 3] = xSpalla + raggioManica * Math.cos(angolo);
    posizioni[i * 3 + 1] = ySpalla;
    posizioni[i * 3 + 2] = raggioManica * Math.sin(angolo);
  }

  const uv = new Float32Array((COLONNE_MANICA + 1) * 2).fill(0.5);

  const indici = [];
  for (let colonna = 0; colonna < COLONNE_MANICA; colonna++) {
    indici.push(0, colonna + 1, ((colonna + 1) % COLONNE_MANICA) + 1);
  }

  return { posizioni, uv, indici };
}
