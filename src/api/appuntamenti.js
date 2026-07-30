import client from "./client";

export function getAppuntamentiTutti() {
  return client.get("/appuntamenti").then((r) => r.data);
}

export function modificaAppuntamento(id, dati) {
  return client.patch(`/appuntamenti/${id}`, dati).then((r) => r.data);
}

export function creaAppuntamentoNegozio(dati) {
  return client.post("/appuntamenti/negozio", dati).then((r) => r.data);
}
