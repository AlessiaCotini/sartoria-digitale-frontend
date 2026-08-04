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
  busto: 90,
};

// altezze reali (frazioni 0-1, piedi->testa) misurate direttamente sullo
// scheletro Mixamo del modello 3D: sono caratteristiche FISSE di questo
// modello, non calcolate dalle misure del cliente (che invece determinano
// solo QUANTO è largo il corpo in ogni fascia, non a che altezza si trova)
const FRAZIONE_VITA_MESH = 0.598;
const FRAZIONE_FIANCHI_MESH = 0.571;
const FRAZIONE_COSCIA_MESH = 0.438;
const FRAZIONE_GINOCCHIO_MESH = 0.305;
const FRAZIONE_CAVIGLIA_MESH = 0.037;
const FRAZIONE_TORACE_MESH = 0.767;
const FRAZIONE_BUSTO_MESH = 0.703;

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

  const frazioneCollo = FRAZIONE_COLLO_MESH;
  const frazioneSpallaMesh = FRAZIONE_SPALLA_MESH;
  const frazioneTorace = FRAZIONE_TORACE_MESH;
  const frazioneBusto = FRAZIONE_BUSTO_MESH;
  const frazioneVita = FRAZIONE_VITA_MESH;
  const frazioneFianchi = FRAZIONE_FIANCHI_MESH;
  const frazioneCoscia = FRAZIONE_COSCIA_MESH;
  const frazioneGinocchio = FRAZIONE_GINOCCHIO_MESH;
  const frazioneCaviglia = FRAZIONE_CAVIGLIA_MESH;

  const frazioneBraccio = manica / altezza;

  return {
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
