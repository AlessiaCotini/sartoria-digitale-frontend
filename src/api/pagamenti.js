import client from "./client";

export function getPagamentiTutti() {
  return client.get("/pagamenti").then((r) => r.data);
}

export function registraAcconto(ordineId, dati) {
  return client
    .patch(`/pagamenti/ordine/${ordineId}/acconto`, dati)
    .then((r) => r.data);
}

export function registraSaldo(ordineId, dati) {
  return client
    .patch(`/pagamenti/ordine/${ordineId}/saldo`, dati)
    .then((r) => r.data);
}
