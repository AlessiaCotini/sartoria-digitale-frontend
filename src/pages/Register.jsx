import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { CAMPI_MISURE } from "../data/misure";

function Register() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [misure, setMisure] = useState(
    Object.fromEntries(CAMPI_MISURE.map((c) => [c.chiave, ""])),
  );
  const [errore, setErrore] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleMisuraChange(chiave, valore) {
    setMisure((prev) => ({ ...prev, [chiave]: valore }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confermaPassword) {
      setErrore("Le due password non coincidono.");
      return;
    }

    const misureMancanti = CAMPI_MISURE.some((c) => !misure[c.chiave]);
    if (misureMancanti) {
      setErrore("Inserisci tutte le misure per completare la registrazione.");
      return;
    }

    dispatch(login({ utente: { nome, cognome, email }, misure }));
    navigate("/profilo");
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "640px" }}>
        <div className="mb-4 text-center">
          <div className="section-title-eyebrow">Registrati</div>
          <h2>Entra nella sartoria digitale</h2>
          <div className="divider-gold mx-auto"></div>
        </div>

        <form className="form-sartoria" onSubmit={handleSubmit}>
          <p className="step-label mb-3">Dati personali</p>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label" htmlFor="regNome">
                Nome
              </label>
              <input
                type="text"
                className="form-control"
                id="regNome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="regCognome">
                Cognome
              </label>
              <input
                type="text"
                className="form-control"
                id="regCognome"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="regEmail">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="regEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="form-label" htmlFor="regPassword">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="regPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="regConfermaPassword">
                Conferma password
              </label>
              <input
                type="password"
                className="form-control"
                id="regConfermaPassword"
                value={confermaPassword}
                onChange={(e) => setConfermaPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <p className="step-label mb-2">Le tue misure</p>
          <p className="text-muted small mb-3">
            Servono alla sarta per costruire il tuo abito su misura. Potrai
            sempre modificarle in seguito dal tuo profilo.
          </p>

          <div className="row g-3 mb-4">
            {CAMPI_MISURE.map((campo) => (
              <div className="col-6 col-md-4" key={campo.chiave}>
                <label
                  className="form-label"
                  htmlFor={`misura-${campo.chiave}`}
                >
                  {campo.label}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-control"
                  id={`misura-${campo.chiave}`}
                  value={misure[campo.chiave]}
                  onChange={(e) =>
                    handleMisuraChange(campo.chiave, e.target.value)
                  }
                  required
                />
              </div>
            ))}
          </div>

          {errore && <p className="text-danger small mb-3">{errore}</p>}

          <button type="submit" className="btn btn-gold w-100 mb-3">
            Crea account
          </button>

          <p className="text-center small text-muted mb-0">
            Hai già un account?{" "}
            <Link to="/login" style={{ color: "var(--color-accent)" }}>
              Accedi
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
