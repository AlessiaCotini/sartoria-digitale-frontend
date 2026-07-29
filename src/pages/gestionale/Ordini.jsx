import { useState, useEffect } from "react";
import {
  getOrdiniTutti,
  assegnaOrdine,
  cambiaStatoOrdine,
} from "../../api/ordini";

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

function Ordini() {
  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  function ricarica() {
    return getOrdiniTutti().then(setOrdini);
  }

  useEffect(() => {
    ricarica().finally(() => setCaricamento(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAssegna(id) {
    assegnaOrdine(id).then(ricarica);
  }

  function handleCambiaStato(id, stato) {
    cambiaStatoOrdine(id, stato).then(ricarica);
  }

  if (caricamento) {
    return <p className="text-muted">Caricamento ordini...</p>;
  }

  return (
    <div className="table-responsive">
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
  );
}

export default Ordini;
