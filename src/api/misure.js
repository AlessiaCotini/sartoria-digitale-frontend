import client from "./client";

export function misureMie() {
  return client.get("/misure/me").then((r) => r.data);
}
