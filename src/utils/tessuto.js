export const COLONNE = 16;
export const RIGHE = 20;

const GRAVITA = -0.0015;
const SMORZAMENTO = 0.98;
const ITERAZIONI_VINCOLI = 4;

function raggioCorpoAllaAltezza(y, altezzaScala, raggioTorace, raggioFianchi) {
  const yAlto = 1.4 * altezzaScala;
  const yBasso = 0.5 * altezzaScala;
  const t = Math.min(1, Math.max(0, (yAlto - y) / (yAlto - yBasso)));
  return raggioTorace * (1 - t) + raggioFianchi * t;
}

export function creaTessuto(
  altezza,
  centroY,
  altezzaScala,
  raggioTorace,
  raggioFianchi,
) {
  const particelle = [];
  const angoloArco = (250 * Math.PI) / 180; // ~250°, lasciamo uno spicchio scoperto dietro
  const passoAngolo = angoloArco / (COLONNE - 1);
  const passoY = altezza / (RIGHE - 1);
  const margine = 0.04; // il tessuto parte leggermente staccato dal corpo

  for (let riga = 0; riga < RIGHE; riga++) {
    const y = centroY + altezza / 2 - riga * passoY;
    const raggioBase = raggioCorpoAllaAltezza(
      y,
      altezzaScala,
      raggioTorace,
      raggioFianchi,
    );
    const raggio = raggioBase + margine;

    for (let colonna = 0; colonna < COLONNE; colonna++) {
      const angolo = -angoloArco / 2 + colonna * passoAngolo;
      const x = raggio * Math.sin(angolo);
      const z = raggio * Math.cos(angolo);
      particelle.push({
        x,
        y,
        z,
        px: x,
        py: y,
        pz: z,
        pinnato: riga === 0,
      });
    }
  }

  const vincoli = [];
  const indice = (riga, colonna) => riga * COLONNE + colonna;

  for (let riga = 0; riga < RIGHE; riga++) {
    for (let colonna = 0; colonna < COLONNE; colonna++) {
      if (colonna < COLONNE - 1) {
        const dx =
          particelle[indice(riga, colonna + 1)].x -
          particelle[indice(riga, colonna)].x;
        const dy =
          particelle[indice(riga, colonna + 1)].y -
          particelle[indice(riga, colonna)].y;
        const dz =
          particelle[indice(riga, colonna + 1)].z -
          particelle[indice(riga, colonna)].z;
        vincoli.push({
          a: indice(riga, colonna),
          b: indice(riga, colonna + 1),
          lunghezza: Math.sqrt(dx * dx + dy * dy + dz * dz),
        });
      }
      if (riga < RIGHE - 1) {
        vincoli.push({
          a: indice(riga, colonna),
          b: indice(riga + 1, colonna),
          lunghezza: passoY,
        });
      }
    }
  }

  return { particelle, vincoli };
}

export function aggiornaTessuto(tessuto, altezza, raggioTorace, raggioFianchi) {
  const { particelle, vincoli } = tessuto;

  // integrazione di Verlet: ogni particella continua nella direzione in
  // cui si stava già muovendo, un po' smorzata, più la gravità
  particelle.forEach((p) => {
    if (p.pinnato) return;
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

  // i vincoli tengono unite le particelle vicine così il tessuto non si
  // sfalda; ripetuti più volte convergono meglio
  for (let iterazione = 0; iterazione < ITERAZIONI_VINCOLI; iterazione++) {
    vincoli.forEach((v) => {
      const pa = particelle[v.a];
      const pb = particelle[v.b];
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const dz = pb.z - pa.z;
      const distanza = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
      const differenza = (distanza - v.lunghezza) / distanza;
      const cx = dx * 0.5 * differenza;
      const cy = dy * 0.5 * differenza;
      const cz = dz * 0.5 * differenza;

      if (!pa.pinnato) {
        pa.x += cx;
        pa.y += cy;
        pa.z += cz;
      }
      if (!pb.pinnato) {
        pb.x -= cx;
        pb.y -= cy;
        pb.z -= cz;
      }
    });
  }

  // collisione col corpo: se una particella finisce "dentro" il
  // manichino, la spingiamo fuori lungo la superficie
  particelle.forEach((p) => {
    if (p.pinnato) return;
    const raggioCorpo = raggioCorpoAllaAltezza(
      p.y,
      altezza,
      raggioTorace,
      raggioFianchi,
    );
    const distanzaXZ = Math.sqrt(p.x * p.x + p.z * p.z);
    const raggioMinimo = raggioCorpo + 0.03;
    if (distanzaXZ < raggioMinimo && distanzaXZ > 0.001) {
      const fattore = raggioMinimo / distanzaXZ;
      p.x *= fattore;
      p.z *= fattore;
    }
  });
}
