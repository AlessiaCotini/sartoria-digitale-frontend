import { raggioTorace } from "./tessuto";

// calibrazione manuale: quanto lontano dal centro si aggancia la gamba
// (stesso concetto di OFFSET_X_SPALLA in maniche.js)
export const OFFSET_X_GAMBA = 0.55;

export const COLONNE_GAMBA = 10;
export const RIGHE_GAMBA = 10;

const MARGINE_GAMBA = 0.02;

// crea un singolo tubo-gamba, dall'altezza in cui si separa dal busto
// (yAlto) fino quasi a terra, usando le fasce coscia/ginocchio/caviglia
// già definite in sagomaCorpo.js — nessun calcolo di raggio duplicato
export function creaGamba(corpo, proporzioni, xGamba, yAlto) {
  const yBasso = corpo.yPiedi + corpo.altezzaModello * 0.02;

  const posizioni = new Float32Array(COLONNE_GAMBA * RIGHE_GAMBA * 3);
  const uv = new Float32Array(COLONNE_GAMBA * RIGHE_GAMBA * 2);

  for (let riga = 0; riga < RIGHE_GAMBA; riga++) {
    const t = riga / (RIGHE_GAMBA - 1);
    const y = yAlto - t * (yAlto - yBasso);
    const frazione =
      corpo.altezzaModello > 0
        ? (y - corpo.yPiedi) / corpo.altezzaModello
        : 0.2;
    const raggio = raggioTorace(frazione, proporzioni) + MARGINE_GAMBA;

    for (let colonna = 0; colonna < COLONNE_GAMBA; colonna++) {
      const i = riga * COLONNE_GAMBA + colonna;
      const angolo = (colonna / COLONNE_GAMBA) * Math.PI * 2;

      posizioni[i * 3] = xGamba + raggio * Math.cos(angolo);
      posizioni[i * 3 + 1] = y;
      posizioni[i * 3 + 2] = raggio * Math.sin(angolo);

      uv[i * 2] = colonna / (COLONNE_GAMBA - 1);
      uv[i * 2 + 1] = 1 - t;
    }
  }

  const indici = [];
  for (let riga = 0; riga < RIGHE_GAMBA - 1; riga++) {
    for (let colonna = 0; colonna < COLONNE_GAMBA; colonna++) {
      const a = riga * COLONNE_GAMBA + colonna;
      const b = riga * COLONNE_GAMBA + ((colonna + 1) % COLONNE_GAMBA);
      const c = a + COLONNE_GAMBA;
      const d = b + COLONNE_GAMBA;
      indici.push(a, c, b);
      indici.push(b, c, d);
    }
  }

  return { posizioni, uv, indici };
}
