import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resetPassword } from "../api/auth";

function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [nuovaPassword, setNuovaPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState(false);
  const [invioInCorso, setInvioInCorso] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");

    if (nuovaPassword !== confermaPassword) {
      setErrore(t("resetPassword.passwordNonCombaciano"));
      return;
    }
    if (nuovaPassword.length < 8) {
      setErrore(t("resetPassword.passwordTroppoCorta"));
      return;
    }

    setInvioInCorso(true);
    resetPassword(token, nuovaPassword)
      .then(() => setSuccesso(true))
      .catch((err) =>
        setErrore(err.response?.data?.errore || t("resetPassword.errore")),
      )
      .finally(() => setInvioInCorso(false));
  }

  if (!token) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "440px" }}>
          <p className="text-danger text-center">
            {t("resetPassword.linkNonValido")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "440px" }}>
        <div className="mb-4 text-center">
          <div className="section-title-eyebrow">{t("login.eyebrow")}</div>
          <h2>{t("resetPassword.titolo")}</h2>
          <div className="divider-gold mx-auto"></div>
        </div>

        {successo ? (
          <div className="text-center">
            <p className="text-muted mb-3">
              {t("resetPassword.messaggioSuccesso")}
            </p>
            <button
              type="button"
              className="btn btn-gold w-100"
              onClick={() => navigate("/login")}
            >
              {t("resetPassword.vaiAlLogin")}
            </button>
          </div>
        ) : (
          <form className="form-sartoria" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="nuovaPassword">
                {t("resetPassword.nuovaPassword")}
              </label>
              <input
                type="password"
                className="form-control"
                id="nuovaPassword"
                value={nuovaPassword}
                onChange={(e) => setNuovaPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="confermaPassword">
                {t("resetPassword.confermaPassword")}
              </label>
              <input
                type="password"
                className="form-control"
                id="confermaPassword"
                value={confermaPassword}
                onChange={(e) => setConfermaPassword(e.target.value)}
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
                ? t("resetPassword.invioInCorso")
                : t("resetPassword.reimposta")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ResetPassword;
