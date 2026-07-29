import client from "./client";

export function cercaClienti(ricerca = "") {
  return client
    .get("/utenti/clienti", { params: { ricerca } })
    .then((r) => r.data);
}
