import { useState, useEffect } from "react";
import { getCapi, getMateriali } from "../../api/catalogo";
import { getAccessori } from "../../api/accessori";
import { cercaClienti } from "../../api/utenti";
import { creaOrdineNegozio } from "../../api/ordini";
import { CAMPI_MISURE } from "../../data/misure";

const misureVuote = Object.fromEntries(CAMPI_MISURE.map((c) => [c.chiave, ""]));
const TAGLIE_SCARPE = Array.from({ length: 12 }, (_, i) => 35 + i);

function NuovoOrdine() {
  const [capi, setCapi] = useState([]);
  const [accessori, setAccessori] = useState([]);
  const [materiali, setMateriali] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  const [tipoCliente, setTipoCliente] = useState("registrato");
  const [ricerca, setRicerca] = useState("");
  const [risultati, setRisultati] = useState([]);
  const [clienteSelezionato, setClienteSelezionato] = useState(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [cognomeCliente, setCognomeCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [misure, setMisure] = useState(misureVuote);

  const [tipoProdotto, setTipoProdotto] = useState("capo");
  const [capoId, setCapoId] = useState("");
  const [accessorioId, setAccessorioId] = useState("");
  const [materialeId, setMaterialeId] = useState("");
  const [colore, setColore] = useState("");

  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState("");

  const [taglia, setTaglia] = useState("");

  useEffect(() => {
    Promise.all([getCapi(), getAccessori(), getMateriali()])
      .then(([listaCapi, listaAccessori, listaMateriali]) => {
        setCapi(listaCapi);
        setAccessori(listaAccessori);
        setMateriali(listaMateriali);
      })
      .finally(() => setCaricamento(false));
  }, []);

  useEffect(() => {
    let attivo = true;

    const promessa =
      tipoCliente === "registrato" && ricerca.length >= 2
        ? cercaClienti(ricerca)
        : Promise.resolve([]);

    promessa.then((trovati) => {
      if (attivo) setRisultati(trovati);
    });

    return () => {
      attivo = false;
    };
  }, [ricerca, tipoCliente]);

  const materialeScelto = materiali.find((m) => m.id === materialeId);
  const accessorioScelto = accessori.find((a) => a.id === accessorioId);

  function handleMisuraChange(chiave, valore) {
    setMisure((prev) => ({ ...prev, [chiave]: valore }));
  }

  function handleCambiaTipoProdotto(nuovoTipo) {
    setTipoProdotto(nuovoTipo);
    setCapoId("");
    setAccessorioId("");
    setMaterialeId("");
    setColore("");
    setTaglia("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setSuccesso("");

    if (tipoProdotto === "capo" && !capoId) {
      setErrore("Scegli un capo.");
      return;
    }
    if (tipoProdotto === "accessorio" && !accessorioId) {
      setErrore("Scegli un accessorio.");
      return;
    }
    if (
      tipoProdotto === "accessorio" &&
      accessorioScelto?.tipoBackend === "SCARPE" &&
      !taglia
    ) {
      setErrore("Seleziona la taglia.");
      return;
    }
    if (!materialeId || !colore) {
      setErrore("Scegli materiale e colore.");
      return;
    }

    const dati =
      tipoProdotto === "capo"
        ? { capoId, materialeId, colore }
        : {
            accessorioId,
            materialeId,
            colore,
            ...(accessorioScelto?.tipoBackend === "SCARPE" ? { taglia } : {}),
          };

    if (tipoCliente === "registrato") {
      if (!clienteSelezionato) {
        setErrore("Seleziona un cliente registrato.");
        return;
      }
      dati.clienteId = clienteSelezionato.id;
    } else {
      if (!nomeCliente || !cognomeCliente || !telefonoCliente) {
        setErrore("Compila nome, cognome e telefono del cliente.");
        return;
      }
      const misureMancanti = CAMPI_MISURE.some((c) => !misure[c.chiave]);
      if (misureMancanti) {
        setErrore("Inserisci tutte le misure del cliente.");
        return;
      }
      dati.nomeClienteNuovo = nomeCliente;
      dati.cognomeClienteNuovo = cognomeCliente;
      dati.telefonoClienteNuovo = telefonoCliente;
      dati.misureClienteNuovo = Object.fromEntries(
        CAMPI_MISURE.map((c) => [c.chiave, parseFloat(misure[c.chiave])]),
      );
    }

    creaOrdineNegozio(dati)
      .then(() => {
        setSuccesso("Ordine creato con successo.");
        setClienteSelezionato(null);
        setNomeCliente("");
        setCognomeCliente("");
        setTelefonoCliente("");
        setMisure(misureVuote);
        setCapoId("");
        setAccessorioId("");
        setMaterialeId("");
        setColore("");
        setTaglia("");
      })
      .catch((err) =>
        setErrore(
          err.response?.data?.errore || "Errore nella creazione dell'ordine.",
        ),
      );
  }

  if (caricamento) {
    return <p className="text-muted">Caricamento...</p>;
  }

  return (
    <form
      className="form-sartoria"
      onSubmit={handleSubmit}
      style={{ maxWidth: "640px" }}
    >
      <p className="step-label mb-2">Cliente</p>
      <div className="filter-group mb-3">
        <button
          type="button"
          className={`filter-tab ${tipoCliente === "registrato" ? "active" : ""}`}
          onClick={() => setTipoCliente("registrato")}
        >
          Cliente registrato
        </button>
        <button
          type="button"
          className={`filter-tab ${tipoCliente === "negozio" ? "active" : ""}`}
          onClick={() => setTipoCliente("negozio")}
        >
          Cliente di negozio
        </button>
      </div>

      {tipoCliente === "registrato" ? (
        <div className="mb-4">
          <label className="form-label">Cerca cliente</label>
          <input
            type="text"
            className="form-control"
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            placeholder="Nome, cognome o email"
          />
          {risultati.length > 0 && (
            <ul className="list-group mt-2">
              {risultati.map((c) => (
                <li
                  key={c.id}
                  className={`list-group-item ${clienteSelezionato?.id === c.id ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setClienteSelezionato(c)}
                >
                  {c.nome} {c.cognome} — {c.email}
                </li>
              ))}
            </ul>
          )}
          {clienteSelezionato && (
            <p className="text-muted small mt-2 mb-0">
              Selezionato: {clienteSelezionato.nome}{" "}
              {clienteSelezionato.cognome}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Cognome</label>
              <input
                type="text"
                className="form-control"
                value={cognomeCliente}
                onChange={(e) => setCognomeCliente(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Telefono</label>
              <input
                type="tel"
                className="form-control"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
              />
            </div>
          </div>

          <p className="step-label mb-2">Misure del cliente</p>
          <div className="row g-3">
            {CAMPI_MISURE.map((campo) => (
              <div className="col-6 col-md-4" key={campo.chiave}>
                <label className="form-label">{campo.label}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-control"
                  value={misure[campo.chiave]}
                  onChange={(e) =>
                    handleMisuraChange(campo.chiave, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="step-label mb-2 mt-4">Prodotto</p>
      <div className="filter-group mb-3">
        <button
          type="button"
          className={`filter-tab ${tipoProdotto === "capo" ? "active" : ""}`}
          onClick={() => handleCambiaTipoProdotto("capo")}
        >
          Capo
        </button>
        <button
          type="button"
          className={`filter-tab ${tipoProdotto === "accessorio" ? "active" : ""}`}
          onClick={() => handleCambiaTipoProdotto("accessorio")}
        >
          Accessorio
        </button>
      </div>

      {tipoProdotto === "capo" ? (
        <select
          className="form-select mb-3"
          value={capoId}
          onChange={(e) => setCapoId(e.target.value)}
        >
          <option value="">Scegli un capo</option>
          {capi.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} — {c.genere} · {c.categoria}
            </option>
          ))}
        </select>
      ) : (
        <select
          className="form-select mb-3"
          value={accessorioId}
          onChange={(e) => {
            setAccessorioId(e.target.value);
            setTaglia("");
          }}
        >
          <option value="">Scegli un accessorio</option>
          {accessori.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome} — {a.genere} · {a.tipo}
            </option>
          ))}
        </select>
      )}

      {tipoProdotto === "accessorio" &&
        accessorioScelto?.tipoBackend === "SCARPE" && (
          <>
            <p className="step-label mb-2">Taglia</p>
            <select
              className="form-select mb-3"
              value={taglia}
              onChange={(e) => setTaglia(e.target.value)}
            >
              <option value="">Scegli una taglia</option>
              {TAGLIE_SCARPE.map((tg) => (
                <option key={tg} value={tg}>
                  {tg}
                </option>
              ))}
            </select>
          </>
        )}

      <p className="step-label mb-2">Materiale</p>

      <p className="step-label mb-2">Materiale</p>
      <select
        className="form-select mb-3"
        value={materialeId}
        onChange={(e) => {
          setMaterialeId(e.target.value);
          setColore("");
        }}
      >
        <option value="">Scegli un materiale</option>
        {materiali.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>

      {materialeScelto && (
        <>
          <p className="step-label mb-2">Colore</p>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {materialeScelto.colori.map((c) => (
              <button
                key={c.nome}
                type="button"
                onClick={() => setColore(c.nome)}
                title={c.nome}
                className="swatch"
                style={{
                  backgroundColor: c.hex,
                  outline:
                    c.nome === colore
                      ? "2px solid var(--color-accent)"
                      : "1px solid var(--color-line)",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </>
      )}

      {errore && <p className="text-danger small">{errore}</p>}
      {successo && <p className="text-success small">{successo}</p>}

      <button type="submit" className="btn btn-gold w-100">
        Crea ordine
      </button>
    </form>
  );
}

export default NuovoOrdine;
