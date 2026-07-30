import client from "./client";

const GENERE_DISPLAY = { UOMO: "Uomo", DONNA: "Donna" };
const CATEGORIA_DISPLAY = {
  ABITI: "Abiti",
  CAMICIE: "Camicie",
  MAGLIETTE: "Magliette",
  GONNE: "Gonne",
  PANTALONI: "Pantaloni",
  CARDIGAN: "Cardigan",
  GIACCHE: "Giacche",
  COMPLETI: "Completi",
};

function normalizzaCapo(capo) {
  return {
    ...capo,
    genere: GENERE_DISPLAY[capo.genere] || capo.genere,
    categoria: CATEGORIA_DISPLAY[capo.categoria] || capo.categoria,
  };
}

export function getCapi() {
  return client.get("/capi").then((r) => r.data.map(normalizzaCapo));
}

export function getCapo(id) {
  return client.get(`/capi/${id}`).then((r) => normalizzaCapo(r.data));
}

export function getMateriali() {
  return client.get("/materiali").then((r) => r.data);
}

export function creaCapo(dati) {
  return client.post("/capi", dati).then((r) => r.data);
}

export function creaMateriale(dati) {
  return client.post("/materiali", dati).then((r) => r.data);
}
