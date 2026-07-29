import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getOrdiniTutti } from "../../api/ordini";
import {
  getStoricoMessaggi,
  connettiChat,
  inviaMessaggio,
} from "../../api/chat";

const STATI_PREVENTIVO = ["PREVENTIVO_RICHIESTO", "IN_NEGOZIAZIONE"];

function ChatOrdine({ ordine }) {
  const utente = useSelector((state) => state.auth.utente);
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState("");
  const stompRef = useRef(null);
  const fineChatRef = useRef(null);

  useEffect(() => {
    let attivo = true;

    getStoricoMessaggi(ordine.id).then((storico) => {
      if (attivo) setMessaggi(storico);
    });

    const stompClient = connettiChat(ordine.id, (nuovo) => {
      setMessaggi((prec) => [...prec, nuovo]);
    });
    stompRef.current = stompClient;

    return () => {
      attivo = false;
      stompClient.deactivate();
    };
  }, [ordine.id]);

  useEffect(() => {
    fineChatRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <h5 className="mb-3">
        Chat con {ordine.nomeCliente} — {ordine.capoNome}
      </h5>

      <div className="flex-grow-1 overflow-auto mb-3">
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
        <div ref={fineChatRef}></div>
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

function Preventivi() {
  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [ordineSelezionato, setOrdineSelezionato] = useState(null);

  useEffect(() => {
    getOrdiniTutti()
      .then((tutti) =>
        setOrdini(tutti.filter((o) => STATI_PREVENTIVO.includes(o.stato))),
      )
      .finally(() => setCaricamento(false));
  }, []);

  if (caricamento) {
    return <p className="text-muted">Caricamento preventivi...</p>;
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <h5 className="mb-3">Preventivi da negoziare</h5>
        <div className="list-group">
          {ordini.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`list-group-item list-group-item-action ${ordineSelezionato?.id === o.id ? "active" : ""}`}
              onClick={() => setOrdineSelezionato(o)}
            >
              {o.nomeCliente} — {o.capoNome}
              <span className="d-block small text-muted">{o.stato}</span>
            </button>
          ))}
          {ordini.length === 0 && (
            <p className="text-muted">Nessun preventivo in negoziazione.</p>
          )}
        </div>
      </div>
      <div className="col-lg-7">
        {ordineSelezionato ? (
          <ChatOrdine ordine={ordineSelezionato} key={ordineSelezionato.id} />
        ) : (
          <p className="text-muted">
            Seleziona un preventivo per aprire la chat.
          </p>
        )}
      </div>
    </div>
  );
}

export default Preventivi;
