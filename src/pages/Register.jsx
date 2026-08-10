import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { login } from "../store/authSlice";
import { CAMPI_MISURE } from "../data/misure";
import { registraCliente, loginRichiesta, utenteAttuale } from "../api/auth";

function Register() {
  const { t } = useTranslation();
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
  const capoId = useSelector((state) => state.configuratore.capoId);

  function handleMisuraChange(chiave, valore) {
    setMisure((prev) => ({ ...prev, [chiave]: valore }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confermaPassword) {
      setErrore(t("register.errorePasswordDiverse"));
      return;
    }

    const misureMancanti = CAMPI_MISURE.some((c) => !misure[c.chiave]);
    if (misureMancanti) {
      setErrore(t("register.erroreMisureMancanti"));
      return;
    }

    const misureNumeriche = Object.fromEntries(
      CAMPI_MISURE.map((c) => [c.chiave, parseFloat(misure[c.chiave])]),
    );

    try {
      await registraCliente({
        nome,
        cognome,
        email,
        password,
        misure: misureNumeriche,
      });
      const { token } = await loginRichiesta(email, password);
      localStorage.setItem("token", token);
      const utente = await utenteAttuale();
      dispatch(login({ utente, misure: misureNumeriche }));
      navigate(capoId ? "/configuratore" : "/profilo");
    } catch (err) {
      setErrore(err.response?.data?.errore || t("register.erroreDefault"));
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "640px" }}>
        <div className="mb-4 text-center">
          <div className="section-title-eyebrow">{t("register.eyebrow")}</div>
          <h2>{t("register.titolo")}</h2>
          <div className="divider-gold mx-auto"></div>
        </div>

        <form className="form-sartoria" onSubmit={handleSubmit}>
          <p className="step-label mb-3">{t("register.datiPersonali")}</p>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label" htmlFor="regNome">
                {t("register.nome")}
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
                {t("register.cognome")}
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
              {t("register.email")}
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
                {t("register.password")}
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
                {t("register.confermaPassword")}
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

          <p className="step-label mb-2">{t("register.tueMisure")}</p>
          <p className="text-muted small mb-3">{t("register.misureTesto")}</p>

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
            {t("register.creaAccount")}
          </button>

          <p className="text-center small text-muted mb-0">
            {t("register.haiAccount")}{" "}
            <Link to="/login" style={{ color: "var(--color-accent)" }}>
              {t("register.accedi")}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
