import client from "./client";

export function cercaClienti(ricerca = "") {
  return client
    .get("/utenti/clienti", { params: { ricerca } })
    .then((r) => r.data);
}

export function creaSarta(dati) {
  return client.post("/utenti/sarte", dati).then((r) => r.data);
}

export function creaSottoposto(dati) {
  return client.post("/utenti/sottoposti", dati).then((r) => r.data);
}
