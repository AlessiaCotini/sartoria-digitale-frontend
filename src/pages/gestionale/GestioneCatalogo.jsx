import { useState } from "react";
import { creaCapo, creaMateriale } from "../../api/catalogo";

const GENERI = ["UOMO", "DONNA"];
const CATEGORIE = ["TOP_LUNGO", "MAGLIETTE", "ABITI", "GONNE", "PANTALONI"];

function FormNuovoCapo() {
  const [nome, setNome] = useState("");
  const [genere, setGenere] = useState(GENERI[0]);
  const [categoria, setCategoria] = useState(CATEGORIE[0]);
  const [modello, setModello] = useState("");
  const [tessuto, setTessuto] = useState("");
  const [prezzoDa, setPrezzoDa] = useState("");
  const [inEvidenza, setInEvidenza] = useState(false);
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setSuccesso("");

    creaCapo({
      nome,
      genere,
      categoria,
      modello,
      tessuto,
      prezzoDa: parseFloat(prezzoDa),
      inEvidenza,
    })
      .then(() => {
        setSuccesso("Capo creato con successo.");
        setNome("");
        setModello("");
        setTessuto("");
        setPrezzoDa("");
        setInEvidenza(false);
      })
      .catch((err) =>
        setErrore(
          err.response?.data?.errore || "Errore nella creazione del capo.",
        ),
      );
  }

  return (
    <form className="form-sartoria mb-4" onSubmit={handleSubmit}>
      <h5 className="mb-3">Nuovo capo</h5>

      <div className="mb-3">
        <label className="form-label">Nome</label>
        <input
          type="text"
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label">Genere</label>
          <select
            className="form-select"
            value={genere}
            onChange={(e) => setGenere(e.target.value)}
          >
            {GENERI.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label className="form-label">Categoria</label>
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {CATEGORIE.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label">Modello</label>
          <input
            type="text"
            className="form-control"
            value={modello}
            onChange={(e) => setModello(e.target.value)}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Tessuto (descrizione)</label>
          <input
            type="text"
            className="form-control"
            value={tessuto}
            onChange={(e) => setTessuto(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label">Prezzo da (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={prezzoDa}
            onChange={(e) => setPrezzoDa(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="inEvidenza"
          checked={inEvidenza}
          onChange={(e) => setInEvidenza(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="inEvidenza">
          In evidenza in Home
        </label>
      </div>

      {errore && <p className="text-danger small">{errore}</p>}
      {successo && <p className="text-success small">{successo}</p>}

      <button type="submit" className="btn btn-gold w-100">
        Crea capo
      </button>
    </form>
  );
}

function FormNuovoMateriale() {
  const [nome, setNome] = useState("");
  const [prezzoAlMetro, setPrezzoAlMetro] = useState("");
  const [colori, setColori] = useState([{ nome: "", hex: "#000000" }]);
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState("");

  function handleColoreChange(indice, campo, valore) {
    setColori((prev) =>
      prev.map((c, i) => (i === indice ? { ...c, [campo]: valore } : c)),
    );
  }

  function aggiungiColore() {
    setColori((prev) => [...prev, { nome: "", hex: "#000000" }]);
  }

  function rimuoviColore(indice) {
    setColori((prev) => prev.filter((_, i) => i !== indice));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setSuccesso("");

    creaMateriale({
      nome,
      prezzoAlMetro: parseFloat(prezzoAlMetro),
      colori,
    })
      .then(() => {
        setSuccesso("Materiale creato con successo.");
        setNome("");
        setPrezzoAlMetro("");
        setColori([{ nome: "", hex: "#000000" }]);
      })
      .catch((err) =>
        setErrore(
          err.response?.data?.errore || "Errore nella creazione del materiale.",
        ),
      );
  }

  return (
    <form className="form-sartoria" onSubmit={handleSubmit}>
      <h5 className="mb-3">Nuovo materiale</h5>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="col-6">
          <label className="form-label">Prezzo al metro (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={prezzoAlMetro}
            onChange={(e) => setPrezzoAlMetro(e.target.value)}
            required
          />
        </div>
      </div>

      <p className="step-label mb-2">Colori</p>
      {colori.map((c, indice) => (
        <div className="row g-2 mb-2 align-items-center" key={indice}>
          <div className="col-5">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nome colore"
              value={c.nome}
              onChange={(e) =>
                handleColoreChange(indice, "nome", e.target.value)
              }
              required
            />
          </div>
          <div className="col-4">
            <input
              type="color"
              className="form-control form-control-sm form-control-color"
              value={c.hex}
              onChange={(e) =>
                handleColoreChange(indice, "hex", e.target.value)
              }
            />
          </div>
          <div className="col-3">
            {colori.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-dark-luxury"
                onClick={() => rimuoviColore(indice)}
              >
                Rimuovi
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-outline-dark-luxury mb-3"
        onClick={aggiungiColore}
      >
        + Aggiungi colore
      </button>

      {errore && <p className="text-danger small">{errore}</p>}
      {successo && <p className="text-success small">{successo}</p>}

      <button type="submit" className="btn btn-gold w-100">
        Crea materiale
      </button>
    </form>
  );
}

function GestioneCatalogo() {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <FormNuovoCapo />
      </div>
      <div className="col-lg-6">
        <FormNuovoMateriale />
      </div>
    </div>
  );
}

export default GestioneCatalogo;
