import client from "./client";

export function inviaRichiestaContatto(dati) {
  return client.post("/contatti", dati).then((r) => r.data);
}
