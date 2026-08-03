import { FRAZIONE_COLLO_MESH, FRAZIONE_SPALLA_MESH } from "./maniche";

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
  gamba: 104,
  busto: 90,
};

const LARGHEZZA_RIFERIMENTO = {
  spalle: 70,
  torace: 64,
  vita: 50,
  fianchi: 66,
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

  // scale delle circonferenze: quanto ogni fascia del corpo è più larga/stretta
  // rispetto al corpo di riferimento (170cm)
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

  // soglie di altezza (frazioni 0-1, dai piedi alla testa) personalizzate in base
  // alla lunghezza reale di gamba e busto, invece di essere fisse uguali per tutti
  const frazioneVita = limita(gamba / altezza, 0.48, 0.52);
  const frazioneSpalle = limita(frazioneVita + 0.28, frazioneVita + 0.16, 0.97);
  const frazioneCollo = FRAZIONE_COLLO_MESH;
  const frazioneTorace = frazioneVita + (frazioneSpalle - frazioneVita) * 0.55;
  const frazioneBusto = frazioneVita + (frazioneSpalle - frazioneVita) * 0.3;
  const frazioneFianchi = frazioneVita * 0.92;
  const frazioneCoscia = frazioneVita * 0.78;
  const frazioneGinocchio = frazioneVita * 0.45;
  const frazioneCaviglia = frazioneVita * 0.1;

  // lunghezza reale del braccio, come frazione dell'altezza della persona:
  // serve a far arrivare la manica al punto giusto invece di una frazione fissa
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
    frazioneCollo,
    frazioneSpalle,
    frazioneSpallaMesh: FRAZIONE_SPALLA_MESH,
    raggioSpalleTessuto,
    frazioneTorace,
    frazioneVita,
    frazioneFianchi,
    frazioneCoscia,
    frazioneGinocchio,
    frazioneCaviglia,
    frazioneBraccio,
    larghezzaSpalle: LARGHEZZA_RIFERIMENTO.spalle * scalaSpalle,
    larghezzaTorace: LARGHEZZA_RIFERIMENTO.torace * scalaTorace,
    larghezzaVita: LARGHEZZA_RIFERIMENTO.vita * scalaVita,
    larghezzaFianchi: LARGHEZZA_RIFERIMENTO.fianchi * scalaFianchi,
    scalaBusto,
    frazioneBusto,
  };
}
