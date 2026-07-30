import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import client from "./client";

export function getStoricoMessaggi(ordineId) {
  return client.get(`/messaggi/ordine/${ordineId}`).then((r) => r.data);
}

export function connettiChat(ordineId, onMessaggio) {
  const token = localStorage.getItem("token");

  const stompClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      stompClient.subscribe(`/topic/ordini/${ordineId}`, (messaggio) => {
        onMessaggio(JSON.parse(messaggio.body));
      });
    },
  });

  stompClient.activate();

  return stompClient;
}

export function inviaMessaggio(stompClient, ordineId, testo) {
  stompClient.publish({
    destination: `/app/ordini/${ordineId}/messaggi`,
    body: JSON.stringify({ testo }),
  });
}

export function getConteggioNonLetti() {
  return client.get("/messaggi/non-letti/conteggio").then((r) => r.data);
}

export function segnaComeLetti(ordineId) {
  return client.patch(`/messaggi/ordine/${ordineId}/letti`);
}
