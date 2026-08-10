import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { aggiornaMisure } from "../store/authSlice";
import { CAMPI_MISURE } from "../data/misure";

function Profilo() {
  const { t } = useTranslation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const utente = useSelector((state) => state.auth.utente);
  const misureSalvate = useSelector((state) => state.auth.misure);
  const dispatch = useDispatch();

  const [bozza, setBozza] = useState(misureSalvate);
  const [salvato, setSalvato] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  function handleChange(chiave, valore) {
    setBozza((prev) => ({ ...prev, [chiave]: valore }));
    setSalvato(false);
  }

  function handleSalva(e) {
    e.preventDefault();
    dispatch(aggiornaMisure(bozza));
    setSalvato(true);
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "720px" }}>
        <div className="mb-4 text-center">
          <div className="section-title-eyebrow">{t("profilo.eyebrow")}</div>
          <h2>
            {t("profilo.ciao", {
              nome: utente?.nome || t("profilo.clienteDefault"),
            })}
          </h2>
          <div className="divider-gold mx-auto"></div>
        </div>

        <div className="form-sartoria mb-4">
          <p className="step-label mb-2">{t("profilo.tuoiDati")}</p>
          <p className="mb-1">
            {utente?.nome} {utente?.cognome}
          </p>
          <p className="text-muted small mb-0">{utente?.email}</p>
        </div>

        <form className="form-sartoria" onSubmit={handleSalva}>
          <p className="step-label mb-2">{t("profilo.tueMisure")}</p>
          <p className="text-muted small mb-3">{t("profilo.aggiornaTesto")}</p>

          <div className="row g-3 mb-4">
            {CAMPI_MISURE.map((campo) => (
              <div className="col-6 col-md-4" key={campo.chiave}>
                <label
                  className="form-label"
                  htmlFor={`profilo-${campo.chiave}`}
                >
                  {campo.label}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-control"
                  id={`profilo-${campo.chiave}`}
                  value={bozza[campo.chiave]}
                  onChange={(e) => handleChange(campo.chiave, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          {salvato && (
            <p className="text-success small mb-3">
              {t("profilo.misureAggiornate")}
            </p>
          )}

          <button type="submit" className="btn btn-gold">
            {t("profilo.salvaModifiche")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profilo;
