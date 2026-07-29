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
