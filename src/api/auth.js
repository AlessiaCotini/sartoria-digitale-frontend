import client from "./client";

export function registraCliente(dati) {
  return client.post("/auth/register", dati).then((r) => r.data);
}

export function loginRichiesta(email, password) {
  return client.post("/auth/login", { email, password }).then((r) => r.data);
}

export function utenteAttuale() {
  return client.get("/utenti/me").then((r) => r.data);
}
