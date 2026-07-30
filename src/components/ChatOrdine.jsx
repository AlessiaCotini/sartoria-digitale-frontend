import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getStoricoMessaggi,
  connettiChat,
  inviaMessaggio,
  segnaComeLetti,
} from "../api/chat";

function ChatOrdine({ ordine }) {
  const utente = useSelector((state) => state.auth.utente);
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState("");
  const stompRef = useRef(null);
  const contenitoreRef = useRef(null);

  useEffect(() => {
    let attivo = true;

    getStoricoMessaggi(ordine.id).then((storico) => {
      if (attivo) setMessaggi(storico);
    });

    segnaComeLetti(ordine.id);

    const stompClient = connettiChat(ordine.id, (nuovo) => {
      setMessaggi((prec) => [...prec, nuovo]);
      segnaComeLetti(ordine.id);
    });
    stompRef.current = stompClient;

    return () => {
      attivo = false;
      stompClient.deactivate();
    };
  }, [ordine.id]);

  useEffect(() => {
    if (contenitoreRef.current) {
      contenitoreRef.current.scrollTop = contenitoreRef.current.scrollHeight;
    }
  }, [messaggi]);

  function handleInvia(e) {
    e.preventDefault();
    if (!testo.trim()) return;
    inviaMessaggio(stompRef.current, ordine.id, testo.trim());
    setTesto("");
  }

  return (
    <div
      className="form-sartoria d-flex flex-column"
      style={{ height: "500px" }}
    >
      <h5 className="mb-3">Chat — {ordine.capoNome}</h5>

      <div className="flex-grow-1 overflow-auto mb-3" ref={contenitoreRef}>
        {messaggi.map((m) => (
          <div
            key={m.id}
            className="mb-2"
            style={{ textAlign: m.mittenteId === utente.id ? "right" : "left" }}
          >
            <span
              className="d-inline-block px-3 py-2"
              style={{
                background:
                  m.mittenteId === utente.id
                    ? "var(--color-accent)"
                    : "var(--color-line)",
                borderRadius: "12px",
                maxWidth: "80%",
              }}
            >
              <strong className="d-block small">{m.nomeMittente}</strong>
              {m.testo}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleInvia} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi un messaggio..."
        />
        <button type="submit" className="btn btn-gold">
          Invia
        </button>
      </form>
    </div>
  );
}

export default ChatOrdine;
