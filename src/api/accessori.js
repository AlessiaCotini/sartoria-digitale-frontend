import client from "./client";

const TIPO_DISPLAY = { CAPPELLO: "Cappello", SCARPE: "Scarpe", BORSA: "Borsa" };
const GENERE_DISPLAY = { UOMO: "Uomo", DONNA: "Donna" };

function normalizzaAccessorio(accessorio) {
  return {
    ...accessorio,
    tipoBackend: accessorio.tipo,
    genere: GENERE_DISPLAY[accessorio.genere] || accessorio.genere,
    tipo: TIPO_DISPLAY[accessorio.tipo] || accessorio.tipo,
  };
}

export function getAccessori() {
  return client.get("/accessori").then((r) => r.data.map(normalizzaAccessorio));
}

export function getAccessorio(id) {
  return client
    .get(`/accessori/${id}`)
    .then((r) => normalizzaAccessorio(r.data));
}

export function creaAccessorio(dati) {
  return client.post("/accessori", dati).then((r) => r.data);
}
