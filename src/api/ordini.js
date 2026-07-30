import client from "./client";

export function getOrdiniTutti() {
  return client.get("/ordini").then((r) => r.data);
}

export function getOrdiniAssegnati() {
  return client.get("/ordini/assegnati").then((r) => r.data);
}

export function assegnaOrdine(id) {
  return client.patch(`/ordini/${id}/assegna`).then((r) => r.data);
}

export function cambiaStatoOrdine(id, stato) {
  return client.patch(`/ordini/${id}/stato`, { stato }).then((r) => r.data);
}

export function creaOrdineNegozio(dati) {
  return client.post("/ordini/negozio", dati).then((r) => r.data);
}

export function getOrdiniMiei() {
  return client.get("/ordini/miei").then((r) => r.data);
}

export function creaOrdine(dati) {
  return client.post("/ordini", dati).then((r) => r.data);
}

export function modificaPrezzoOrdine(id, prezzoTotale) {
  return client
    .patch(`/ordini/${id}/prezzo`, { prezzoTotale })
    .then((r) => r.data);
}

export function getCodaMagazzino() {
  return client.get("/ordini/magazzino").then((r) => r.data);
}

export function modificaFornitoreOrdine(id, fornitore) {
  return client
    .patch(`/ordini/${id}/fornitore`, { fornitore })
    .then((r) => r.data);
}
