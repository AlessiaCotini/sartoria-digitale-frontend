import { useState } from "react";
import { registraAcconto, registraSaldo } from "../api/pagamenti";

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

export default RegistraPagamentoModal;
