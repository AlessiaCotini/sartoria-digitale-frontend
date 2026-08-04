import { FRAZIONE_SPALLA_MESH, FRAZIONE_COLLO_MESH } from "./maniche";

const RIFERIMENTO = {
  altezza: 170,
  collo: 36,
  spalle: 44,
  torace: 96,
  vita: 80,
  fianchi: 100,
  coscia: 56,
  ginocchio: 38,
  caviglia: 22,
  bicipite: 28,
  polso: 16,
  manica: 60,
  gamba: 80,
  busto: 90,
};

function numeroValido(valore, fallback) {
  const n = parseFloat(valore);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function limita(valore, min, max) {
  return Math.min(max, Math.max(min, valore));
}

export function calcolaProporzioni(misure) {
  const altezza = numeroValido(misure?.altezza, RIFERIMENTO.altezza);
  const collo = numeroValido(misure?.collo, RIFERIMENTO.collo);
  const spalle = numeroValido(misure?.spalle, RIFERIMENTO.spalle);
  const torace = numeroValido(misure?.torace, RIFERIMENTO.torace);
  const vita = numeroValido(misure?.vita, RIFERIMENTO.vita);
  const fianchi = numeroValido(misure?.fianchi, RIFERIMENTO.fianchi);
  const coscia = numeroValido(misure?.coscia, RIFERIMENTO.coscia);
  const ginocchio = numeroValido(misure?.ginocchio, RIFERIMENTO.ginocchio);
  const caviglia = numeroValido(misure?.caviglia, RIFERIMENTO.caviglia);
  const bicipite = numeroValido(misure?.bicipite, RIFERIMENTO.bicipite);
  const polso = numeroValido(misure?.polso, RIFERIMENTO.polso);
  const manica = numeroValido(misure?.manica, RIFERIMENTO.manica);
  const gamba = numeroValido(misure?.gamba, RIFERIMENTO.gamba);
  const busto = numeroValido(misure?.busto, RIFERIMENTO.busto);

  const scalaAltezza = limita(altezza / RIFERIMENTO.altezza, 0.8, 1.3);
  const scalaCollo = limita(collo / RIFERIMENTO.collo, 0.8, 1.3);
  const scalaSpalle = limita(spalle / RIFERIMENTO.spalle, 0.8, 1.3);
  const scalaTorace = limita(torace / RIFERIMENTO.torace, 0.8, 1.3);
  const scalaVita = limita(vita / RIFERIMENTO.vita, 0.8, 1.3);
  const scalaFianchi = limita(fianchi / RIFERIMENTO.fianchi, 0.8, 1.3);
  const scalaCoscia = limita(coscia / RIFERIMENTO.coscia, 0.8, 1.3);
  const scalaGinocchio = limita(ginocchio / RIFERIMENTO.ginocchio, 0.8, 1.3);
  const scalaCaviglia = limita(caviglia / RIFERIMENTO.caviglia, 0.8, 1.3);
  const scalaBicipite = limita(bicipite / RIFERIMENTO.bicipite, 0.8, 1.3);
  const scalaPolso = limita(polso / RIFERIMENTO.polso, 0.8, 1.3);
  const scalaBusto = limita(busto / RIFERIMENTO.busto, 0.8, 1.3);

  // soglia dell'altezza a cui sta la vita, personalizzata sulla lunghezza
  // reale della gamba (frazione dell'altezza totale della persona)
  const frazioneVita = limita(gamba / altezza, 0.4, 0.54);

  // collo e punto di aggancio manica sono caratteristiche FISSE del modello
  // 3D (non della persona): un solo riferimento, importato da maniche.js
  const frazioneCollo = FRAZIONE_COLLO_MESH;
  const frazioneSpallaMesh = FRAZIONE_SPALLA_MESH;

  const frazioneTorace =
    frazioneVita + (frazioneSpallaMesh - frazioneVita) * 0.55;
  const frazioneBusto =
    frazioneVita + (frazioneSpallaMesh - frazioneVita) * 0.35;
  const frazioneFianchi = frazioneVita * 0.92;
  const frazioneCoscia = frazioneVita * 0.75;
  const frazioneGinocchio = frazioneVita * 0.42;
  const frazioneCaviglia = frazioneVita * 0.08;

  const frazioneBraccio = manica / altezza;

  const DUE_PI = 2 * Math.PI;
  const raggioCollo = collo / DUE_PI / 100;
  const raggioTorace = torace / DUE_PI / 100;
  const raggioBusto = busto / DUE_PI / 100;
  const raggioVita = vita / DUE_PI / 100;
  const raggioFianchi = fianchi / DUE_PI / 100;
  const raggioCoscia = coscia / DUE_PI / 100;
  const raggioGinocchio = ginocchio / DUE_PI / 100;
  const raggioCaviglia = caviglia / DUE_PI / 100;
  // "spalle" è una larghezza, non una circonferenza: usiamo metà come raggio
  // approssimativo così il tessuto resta largo quanto le vere spalle
  const raggioSpalleTessuto = spalle / 2 / 100;

  return {
    raggioCollo,
    raggioTorace,
    raggioBusto,
    raggioVita,
    raggioFianchi,
    raggioCoscia,
    raggioGinocchio,
    raggioCaviglia,
    raggioSpalleTessuto,
    scalaAltezza,
    scalaCollo,
    scalaSpalle,
    scalaTorace,
    scalaVita,
    scalaFianchi,
    scalaCoscia,
    scalaGinocchio,
    scalaCaviglia,
    scalaBicipite,
    scalaPolso,
    scalaBusto,
    frazioneCollo,
    frazioneSpallaMesh,
    frazioneTorace,
    frazioneBusto,
    frazioneVita,
    frazioneFianchi,
    frazioneCoscia,
    frazioneGinocchio,
    frazioneCaviglia,
    frazioneBraccio,
  };
}
