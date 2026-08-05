import client from "./client";

export function getOpzioni(categoria) {
  return client.get("/opzioni", { params: { categoria } }).then((r) => r.data);
}

export function getOpzioniAccessorio(tipo) {
  return client
    .get("/opzioni-accessori", { params: { tipo } })
    .then((r) => r.data);
}
