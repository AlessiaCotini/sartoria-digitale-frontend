import client from "./client";

export function getOpzioni(categoria) {
  return client.get("/opzioni", { params: { categoria } }).then((r) => r.data);
}
