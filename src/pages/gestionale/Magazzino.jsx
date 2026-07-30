import { useState, useEffect } from "react";
import {
  getCodaMagazzino,
  modificaFornitoreOrdine,
  cambiaStatoOrdine,
} from "../../api/ordini";

function Magazzino() {
  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [fornitori, setFornitori] = useState({});
  const [errore, setErrore] = useState("");

  function ricarica() {
    return getCodaMagazzino().then((lista) => {
      setOrdini(lista);
      setFornitori(
        Object.fromEntries(lista.map((o) => [o.id, o.fornitore || ""])),
      );
    });
  }

  useEffect(() => {
    ricarica().finally(() => setCaricamento(false));
  }, []);

  function handleFornitoreBlur(ordineId) {
    const valore = fornitori[ordineId];
    modificaFornitoreOrdine(ordineId, valore);
  }

  function handleAvanza(ordine) {
    setErrore("");
    const prossimoStato =
      ordine.stato === "ACCETTATO" ? "MATERIALI_ORDINATI" : "IN_LAVORAZIONE";
    cambiaStatoOrdine(ordine.id, prossimoStato)
      .then(ricarica)
      .catch((err) =>
        setErrore(
          err.response?.data?.errore ||
            "Impossibile segnare l'ordine come arrivato.",
        ),
      );
  }

  if (caricamento) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">Caricamento magazzino...</p>
        </div>
      </section>
    );
  }

  return (
    <div>
      <h3 className="mb-3">Materiali da ordinare</h3>
      {errore && <p className="text-danger small">{errore}</p>}
      {ordini.length === 0 && (
        <p className="text-muted">Nessun materiale in coda.</p>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Capo</th>
            <th>Materiale</th>
            <th>Fornitore</th>
            <th>Stato</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ordini.map((o) => (
            <tr key={o.id}>
              <td>{o.nomeCliente}</td>
              <td>{o.capoNome}</td>
              <td>{o.materialeNome}</td>
              <td>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nome fornitore"
                  value={fornitori[o.id] || ""}
                  onChange={(e) =>
                    setFornitori((prev) => ({
                      ...prev,
                      [o.id]: e.target.value,
                    }))
                  }
                  onBlur={() => handleFornitoreBlur(o.id)}
                />
              </td>
              <td>{o.stato === "ACCETTATO" ? "Da ordinare" : "Ordinato"}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-gold"
                  onClick={() => handleAvanza(o)}
                >
                  {o.stato === "ACCETTATO"
                    ? "Segna ordinato"
                    : "Segna arrivato"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Magazzino;
