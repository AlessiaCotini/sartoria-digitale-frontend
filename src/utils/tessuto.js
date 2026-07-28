import { fattoreScalaPerAltezza } from "./sagomaCorpo";

export const COLONNE = 16;
export const RIGHE = 20;

const GRAVITA = -0.0015;
const SMORZAMENTO = 0.98;
const ITERAZIONI_VINCOLI = 4;
// raggio ricavato dalla circonferenza toracica di riferimento (96 cm),
// trattando la sezione del busto come un cerchio: raggio = circonferenza / (2π)
const RAGGIO_TORACE_NEUTRO = 96 / (2 * Math.PI) / 100;

export function raggioTorace(frazione, proporzioni) {
  return RAGGIO_TORACE_NEUTRO * fattoreScalaPerAltezza(frazione, proporzioni);
}

export function creaTessuto(altezzaZona, centroY, corpo, proporzioni) {
  const particelle = [];
  const yAlto = centroY + altezzaZona / 2;
  const yBasso = centroY - altezzaZona / 2;
  const margine = 0.02;

  for (let riga = 0; riga < RIGHE; riga++) {
    const t = riga / (RIGHE - 1);
    const y = yAlto - t * (yAlto - yBasso);
    const frazione =
      corpo.altezzaModello > 0
        ? (y - corpo.yPiedi) / corpo.altezzaModello
        : 0.7;
    const raggio = raggioTorace(frazione, proporzioni) + margine;

    for (let colonna = 0; colonna < COLONNE; colonna++) {
      const u = colonna / (COLONNE - 1);
      const angolo = -Math.PI * 0.7 + u * Math.PI * 1.4;
      const x = raggio * Math.sin(angolo);
      const z = raggio * Math.cos(angolo);
      particelle.push({ x, y, z, px: x, py: y, pz: z, fissa: riga <= 1 });
    }
  }

  const vincoli = [];
  function aggiungiVincolo(a, b) {
    const pa = particelle[a],
      pb = particelle[b];
    const dx = pa.x - pb.x,
      dy = pa.y - pb.y,
      dz = pa.z - pb.z;
    vincoli.push({
      a,
      b,
      lunghezzaRiposo: Math.sqrt(dx * dx + dy * dy + dz * dz),
    });
  }
  for (let riga = 0; riga < RIGHE; riga++) {
    for (let colonna = 0; colonna < COLONNE; colonna++) {
      const i = riga * COLONNE + colonna;
      if (colonna < COLONNE - 1) aggiungiVincolo(i, i + 1);
      if (riga < RIGHE - 1) aggiungiVincolo(i, i + COLONNE);
    }
  }

  return { particelle, vincoli };
}

export function aggiornaTessuto(tessuto, corpo, proporzioni) {
  const { particelle, vincoli } = tessuto;

  particelle.forEach((p) => {
    if (p.fissa) return;
    const vx = (p.x - p.px) * SMORZAMENTO;
    const vy = (p.y - p.py) * SMORZAMENTO;
    const vz = (p.z - p.pz) * SMORZAMENTO;
    p.px = p.x;
    p.py = p.y;
    p.pz = p.z;
    p.x += vx;
    p.y += vy + GRAVITA;
    p.z += vz;
  });

  for (let iterazione = 0; iterazione < ITERAZIONI_VINCOLI; iterazione++) {
    vincoli.forEach(({ a, b, lunghezzaRiposo }) => {
      const pa = particelle[a],
        pb = particelle[b];
      const dx = pb.x - pa.x,
        dy = pb.y - pa.y,
        dz = pb.z - pa.z;
      const distanza = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
      const differenza = (distanza - lunghezzaRiposo) / distanza;
      const cx = dx * 0.5 * differenza,
        cy = dy * 0.5 * differenza,
        cz = dz * 0.5 * differenza;
      if (!pa.fissa) {
        pa.x += cx;
        pa.y += cy;
        pa.z += cz;
      }
      if (!pb.fissa) {
        pb.x -= cx;
        pb.y -= cy;
        pb.z -= cz;
      }
    });
  }

  particelle.forEach((p) => {
    if (p.fissa) return;
    const frazione =
      corpo.altezzaModello > 0
        ? (p.y - corpo.yPiedi) / corpo.altezzaModello
        : 0.7;
    const raggio = raggioTorace(frazione, proporzioni) + 0.02;
    const distanzaAsse = Math.sqrt(p.x * p.x + p.z * p.z) || 0.0001;

    const differenza = raggio - distanzaAsse;
    const aderenza = 0.35;
    const nuovaDistanza = distanzaAsse + differenza * aderenza;
    const fattore = nuovaDistanza / distanzaAsse;

    p.x *= fattore;
    p.z *= fattore;
  });
}
