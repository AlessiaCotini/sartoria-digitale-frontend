import { useState } from "react";
import { useSelector } from "react-redux";
import { creaSarta, creaSottoposto } from "../../api/utenti";
import CampoPassword from "../../components/CampoPassword";

function Team() {
  const utente = useSelector((state) => state.auth.utente);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState("");

  const creaUtente =
    utente.ruolo === "SUPER_ADMIN" ? creaSarta : creaSottoposto;
  const etichetta = utente.ruolo === "SUPER_ADMIN" ? "sarta" : "sottoposto";

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setSuccesso("");

    creaUtente({ nome, cognome, email, password })
      .then(() => {
        setSuccesso(`Account ${etichetta} creato con successo.`);
        setNome("");
        setCognome("");
        setEmail("");
        setPassword("");
      })
      .catch((err) =>
        setErrore(
          err.response?.data?.errore ||
            `Errore nella creazione dell'account ${etichetta}.`,
        ),
      );
  }

  return (
    <form
      className="form-sartoria"
      onSubmit={handleSubmit}
      style={{ maxWidth: "480px" }}
    >
      <h5 className="mb-3">Crea nuovo account {etichetta}</h5>

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
          <label className="form-label">Cognome</label>
          <input
            type="text"
            className="form-control"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <CampoPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {errore && <p className="text-danger small">{errore}</p>}
      {successo && <p className="text-success small">{successo}</p>}

      <button type="submit" className="btn btn-gold w-100">
        Crea {etichetta}
      </button>
    </form>
  );
}

export default Team;
