import { useState, useEffect } from "react";
import { getOrdiniTutti } from "../../api/ordini";
import {
  getPagamentiTutti,
  registraAcconto,
  registraSaldo,
} from "../../api/pagamenti";

const METODI = ["CONTANTI", "CARTA", "BONIFICO"];

function RegistraPagamentoModal({
  ordine,
  tipo,
  valoreDefault,
  onChiudi,
  onRegistrato,
}) {
  const [importo, setImporto] = useState(valoreDefault);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [metodo, setMetodo] = useState("CONTANTI");
  const [errore, setErrore] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");

    const dati = { importo: parseFloat(importo), data, metodo };
    const chiamata = tipo === "acconto" ? registraAcconto : registraSaldo;

    chiamata(ordine.id, dati)
      .then(() => {
        onRegistrato();
        onChiudi();
      })
      .catch((err) =>
        setErrore(err.response?.data?.errore || "Errore nella registrazione."),
      );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        className="form-sartoria"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h5 className="mb-3">
          Registra {tipo === "acconto" ? "acconto" : "saldo"} —{" "}
          {ordine.nomeCliente}
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Importo (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              value={importo}
              onChange={(e) => setImporto(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Data</label>
            <input
              type="date"
              className="form-control"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Metodo</label>
            <select
              className="form-select"
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
            >
              {METODI.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {errore && <p className="text-danger small">{errore}</p>}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-gold flex-grow-1">
              Registra
            </button>
            <button
              type="button"
              className="btn btn-outline-dark-luxury"
              onClick={onChiudi}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Pagamenti() {
  const [ordini, setOrdini] = useState([]);
  const [pagamenti, setPagamenti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [modale, setModale] = useState(null);

  function ricarica() {
    return Promise.all([getOrdiniTutti(), getPagamentiTutti()]).then(
      ([listaOrdini, listaPagamenti]) => {
        setOrdini(listaOrdini);
        setPagamenti(listaPagamenti);
      },
    );
  }

  useEffect(() => {
    ricarica().finally(() => setCaricamento(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (caricamento) {
    return <p className="text-muted">Caricamento pagamenti...</p>;
  }

  const righe = ordini.map((o) => ({
    ordine: o,
    pagamento: pagamenti.find((p) => p.ordineId === o.id),
  }));

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Capo</th>
              <th>Totale</th>
              <th>Acconto</th>
              <th>Saldo</th>
              <th>Stato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {righe.map(({ ordine, pagamento }) => (
              <tr key={ordine.id}>
                <td>
                  {ordine.nomeCliente}
                  {!ordine.clienteRegistrato && (
                    <span className="badge-soft ms-2">negozio</span>
                  )}
                </td>
                <td>{ordine.capoNome}</td>
                <td>€ {ordine.prezzoTotale}</td>
                <td>
                  {pagamento?.accontoImporto != null
                    ? `€ ${pagamento.accontoImporto} (${pagamento.accontoMetodo}, ${pagamento.accontoData})`
                    : "—"}
                </td>
                <td>
                  {pagamento?.saldoImporto != null
                    ? `€ ${pagamento.saldoImporto} (${pagamento.saldoMetodo}, ${pagamento.saldoData})`
                    : "—"}
                </td>
                <td>{pagamento?.stato || "NON_PAGATO"}</td>
                <td>
                  <div className="d-flex gap-2">
                    {pagamento?.accontoImporto == null && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark-luxury"
                        onClick={() =>
                          setModale({
                            ordine,
                            tipo: "acconto",
                            valoreDefault: Math.round(
                              ordine.prezzoTotale * 0.3,
                            ),
                          })
                        }
                      >
                        Registra acconto
                      </button>
                    )}
                    {pagamento?.accontoImporto != null &&
                      pagamento?.saldoImporto == null && (
                        <button
                          type="button"
                          className="btn btn-sm btn-gold"
                          onClick={() =>
                            setModale({
                              ordine,
                              tipo: "saldo",
                              valoreDefault:
                                ordine.prezzoTotale - pagamento.accontoImporto,
                            })
                          }
                        >
                          Registra saldo
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
            {righe.length === 0 && (
              <tr>
                <td colSpan="7" className="text-muted text-center">
                  Nessun ordine.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modale && (
        <RegistraPagamentoModal
          ordine={modale.ordine}
          tipo={modale.tipo}
          valoreDefault={modale.valoreDefault}
          onChiudi={() => setModale(null)}
          onRegistrato={ricarica}
        />
      )}
    </>
  );
}

export default Pagamenti;
