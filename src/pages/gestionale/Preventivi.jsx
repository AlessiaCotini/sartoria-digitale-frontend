import { useState, useEffect } from "react";
import { getOrdiniTutti } from "../../api/ordini";
import ChatOrdine from "../../components/ChatOrdine";

const STATI_PREVENTIVO = ["PREVENTIVO_RICHIESTO", "IN_NEGOZIAZIONE"];

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
