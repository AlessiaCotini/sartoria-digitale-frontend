import { useState, useEffect } from "react";
import {
  getOrdiniTutti,
  cambiaStatoOrdine,
  modificaPrezzoOrdine,
} from "../../api/ordini";
import { getConteggioPerOrdine } from "../../api/chat";
import ChatOrdine from "../../components/ChatOrdine";

const STATI_PREVENTIVO = ["PREVENTIVO_RICHIESTO"];
const STATI_ORDINE = [
  "PREVENTIVO_RICHIESTO",
  "ACCETTATO",
  "MATERIALI_ORDINATI",
  "IN_LAVORAZIONE",
  "COMPLETATO",
  "ANNULLATO",
];

function Preventivi() {
  const [ordini, setOrdini] = useState([]);
  const [conteggi, setConteggi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [ordineSelezionato, setOrdineSelezionato] = useState(null);
  const [nuovoPrezzo, setNuovoPrezzo] = useState("");
  const [erroreEsito, setErroreEsito] = useState("");

  function ricaricaOrdini() {
    return getOrdiniTutti().then((tutti) => {
      const inNegoziazione = tutti.filter((o) =>
        STATI_PREVENTIVO.includes(o.stato),
      );
      setOrdini(inNegoziazione);
      setOrdineSelezionato((prec) => {
        if (!prec) return prec;
        const ancoraPresente = inNegoziazione.find((o) => o.id === prec.id);
        return ancoraPresente || null;
      });
    });
  }

  function ricaricaConteggi() {
    return getConteggioPerOrdine().then(setConteggi);
  }

  useEffect(() => {
    Promise.all([ricaricaOrdini(), ricaricaConteggi()]).finally(() =>
      setCaricamento(false),
    );

    const intervallo = setInterval(ricaricaConteggi, 15000);
    return () => clearInterval(intervallo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function conteggioDi(ordineId) {
    return conteggi.find((c) => c.ordineId === ordineId)?.conteggio || 0;
  }

  function handleSeleziona(o) {
    setOrdineSelezionato(o);
    setNuovoPrezzo(o.prezzoTotale);
    setErroreEsito("");
    setTimeout(ricaricaConteggi, 800);
  }

  function handleCambiaStato(stato) {
    cambiaStatoOrdine(ordineSelezionato.id, stato).then(ricaricaOrdini);
  }

  function handleSalvaPrezzo() {
    setErroreEsito("");
    modificaPrezzoOrdine(ordineSelezionato.id, parseFloat(nuovoPrezzo))
      .then(ricaricaOrdini)
      .catch((err) =>
        setErroreEsito(
          err.response?.data?.errore || "Errore nel salvataggio del prezzo.",
        ),
      );
  }

  if (caricamento) {
    return <p className="text-muted">Caricamento preventivi...</p>;
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <h5 className="mb-3">Preventivi da negoziare</h5>
        <div className="list-group">
          {ordini.map((o) => {
            const nonLetti = conteggioDi(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={`list-group-item list-group-item-action ${ordineSelezionato?.id === o.id ? "active" : ""}`}
                onClick={() => handleSeleziona(o)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    {o.nomeCliente} — {o.capoNome}
                  </span>
                  {nonLetti > 0 && (
                    <span className="badge rounded-pill bg-danger">
                      {nonLetti}
                    </span>
                  )}
                </div>
                <span className="d-block small text-muted">
                  {o.stato} · € {o.prezzoTotale}
                </span>
              </button>
            );
          })}
          {ordini.length === 0 && (
            <p className="text-muted">Nessun preventivo in negoziazione.</p>
          )}
        </div>
      </div>
      <div className="col-lg-7">
        {ordineSelezionato ? (
          <>
            <div className="form-sartoria mb-3">
              <div className="row g-3 align-items-end">
                <div className="col-6">
                  <label className="form-label">Stato ordine</label>
                  <select
                    className="form-select"
                    value={ordineSelezionato.stato}
                    onChange={(e) => handleCambiaStato(e.target.value)}
                  >
                    {STATI_ORDINE.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={nuovoPrezzo}
                    onChange={(e) => setNuovoPrezzo(e.target.value)}
                  />
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-gold w-100"
                    onClick={handleSalvaPrezzo}
                  >
                    Salva
                  </button>
                </div>
              </div>
              {erroreEsito && (
                <p className="text-danger small mt-2 mb-0">{erroreEsito}</p>
              )}
            </div>
            <ChatOrdine ordine={ordineSelezionato} key={ordineSelezionato.id} />
          </>
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
