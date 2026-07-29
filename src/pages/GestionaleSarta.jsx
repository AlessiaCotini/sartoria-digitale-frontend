import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  getOrdiniTutti,
  assegnaOrdine,
  cambiaStatoOrdine,
} from "../api/ordini";
import {
  getAppuntamentiTutti,
  modificaAppuntamento,
} from "../api/appuntamenti";

const STATI_ORDINE = [
  "PREVENTIVO_RICHIESTO",
  "IN_NEGOZIAZIONE",
  "ACCETTATO",
  "MATERIALI_ORDINATI",
  "APPROVATO_SARTA",
  "IN_LAVORAZIONE",
  "COMPLETATO",
  "ANNULLATO",
];

const RUOLI_AMMESSI = ["SARTA", "SOTTOPOSTO", "SUPER_ADMIN"];

function GestionaleSarta() {
  const utente = useSelector((state) => state.auth.utente);

  const [ordini, setOrdini] = useState([]);
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  function ricaricaOrdini() {
    return getOrdiniTutti().then(setOrdini);
  }

  function ricaricaAppuntamenti() {
    return getAppuntamentiTutti().then(setAppuntamenti);
  }

  useEffect(() => {
    Promise.all([ricaricaOrdini(), ricaricaAppuntamenti()]).finally(() =>
      setCaricamento(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!utente || !RUOLI_AMMESSI.includes(utente.ruolo)) {
    return <Navigate to="/" replace />;
  }

  function handleAssegna(id) {
    assegnaOrdine(id).then(ricaricaOrdini);
  }

  function handleCambiaStato(id, stato) {
    cambiaStatoOrdine(id, stato).then(ricaricaOrdini);
  }

  function handleConferma(id) {
    modificaAppuntamento(id, { stato: "CONFERMATO" }).then(
      ricaricaAppuntamenti,
    );
  }

  if (caricamento) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">Caricamento gestionale...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Gestionale</div>
          <h2>Ordini e appuntamenti</h2>
          <div className="divider-gold"></div>
        </div>

        <h4 className="mb-3">Ordini</h4>
        <div className="table-responsive mb-5">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Capo</th>
                <th>Materiale / colore</th>
                <th>Prezzo</th>
                <th>Stato</th>
                <th>Assegnato</th>
              </tr>
            </thead>
            <tbody>
              {ordini.map((o) => (
                <tr key={o.id}>
                  <td>
                    {o.nomeCliente}
                    {!o.clienteRegistrato && (
                      <span className="badge-soft ms-2">negozio</span>
                    )}
                  </td>
                  <td>{o.capoNome}</td>
                  <td>
                    {o.materialeNome} — {o.colore}
                  </td>
                  <td>€ {o.prezzoTotale}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={o.stato}
                      onChange={(e) => handleCambiaStato(o.id, e.target.value)}
                    >
                      {STATI_ORDINE.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {o.assegnatoAId ? (
                      "Sì"
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark-luxury"
                        onClick={() => handleAssegna(o.id)}
                      >
                        Prendi in carico
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {ordini.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted text-center">
                    Nessun ordine.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h4 className="mb-3">Appuntamenti</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data e ora</th>
                <th>Stato</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appuntamenti.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.nomeCliente}
                    {!a.clienteRegistrato && (
                      <span className="badge-soft ms-2">negozio</span>
                    )}
                  </td>
                  <td>{new Date(a.dataOra).toLocaleString("it-IT")}</td>
                  <td>{a.stato}</td>
                  <td>{a.note}</td>
                  <td>
                    {a.stato === "RICHIESTO" && (
                      <button
                        type="button"
                        className="btn btn-sm btn-gold"
                        onClick={() => handleConferma(a.id)}
                      >
                        Conferma
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {appuntamenti.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-muted text-center">
                    Nessun appuntamento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default GestionaleSarta;
