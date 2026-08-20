import { useState } from "react";
import { useTranslation } from "react-i18next";
import { richiediReset } from "../api/auth";

function RichiediReset() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState("");
  const [invioInCorso, setInvioInCorso] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setInvioInCorso(true);
    richiediReset(email)
      .then(() => setInviato(true))
      .catch(() => setErrore(t("richiediReset.errore")))
      .finally(() => setInvioInCorso(false));
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "440px" }}>
        <div className="mb-4 text-center">
          <div className="section-title-eyebrow">{t("login.eyebrow")}</div>
          <h2>{t("richiediReset.titolo")}</h2>
          <div className="divider-gold mx-auto"></div>
        </div>

        {inviato ? (
          <p className="text-muted text-center">
            {t("richiediReset.messaggioInviato")}
          </p>
        ) : (
          <form className="form-sartoria" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" htmlFor="resetEmail">
                {t("login.email")}
              </label>
              <input
                type="email"
                className="form-control"
                id="resetEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {errore && <p className="text-danger small mb-3">{errore}</p>}

            <button
              type="submit"
              className="btn btn-gold w-100"
              disabled={invioInCorso}
            >
              {invioInCorso
                ? t("richiediReset.invioInCorso")
                : t("richiediReset.invia")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default RichiediReset;
