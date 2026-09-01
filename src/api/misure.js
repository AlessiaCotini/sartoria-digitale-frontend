import client from "./client";

export function misureMie() {
  return client.get("/misure/me").then((r) => r.data);
}
export function aggiornaMisureRemote(misure) {
  return client.put("/misure/me", misure).then((r) => r.data);
}
