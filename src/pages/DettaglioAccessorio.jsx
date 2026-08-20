import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAccessorio } from "../api/accessori";
import { impostaAccessorio } from "../store/configuratoreSlice";
import { percorsoAccessorio } from "../utils/percorsoAccessorio";
import ImmagineAccessorio from "../components/ImmagineAccessorio";

function DettaglioAccessorio() {
  const { t } = useTranslation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [accessorio, setAccessorio] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    let attivo = true;
    getAccessorio(id)
      .then((trovato) => {
        if (attivo) setAccessorio(trovato);
      })
      .catch(() => {
        if (attivo) setAccessorio(null);
      })
      .finally(() => {
        if (attivo) setCaricamento(false);
      });
    return () => {
      attivo = false;
    };
  }, [id]);

  function handleConfigura(accessorioId) {
    dispatch(impostaAccessorio(accessorioId));
    navigate(isLoggedIn ? "/configuratore-accessorio" : "/login");
  }

  if (caricamento) {
    return (
      <section className="section">
        <div className="container text-center">
          <p className="text-muted">{t("preventivo.caricamento")}</p>
        </div>
      </section>
    );
  }

  if (!accessorio) {
    return (
      <section className="section">
        <div className="container text-center">
          <h2>{t("dettaglioAccessorio.nonTrovato")}</h2>
          <Link to="/accessori" className="btn btn-outline-dark-luxury mt-3">
            {t("nav.accessori")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <Link to="/accessori" className="step-label d-inline-block mb-4">
          {t("dettaglioAccessorio.tornaAccessori")}
        </Link>
        <div className="row g-5">
          <div className="col-lg-6">
            <div className="product-card">
              <div className="product-thumb" style={{ aspectRatio: "3/4" }}>
                <ImmagineAccessorio
                  src={percorsoAccessorio(
                    accessorio.tipo,
                    accessorio.genere,
                    accessorio.modello,
                  )}
                  alt={accessorio.nome}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <span className="badge-soft">
              {accessorio.genere} · {accessorio.tipo}
            </span>
            <h2 className="mt-3 mb-3">{accessorio.nome}</h2>
            <p className="text-muted mb-4">
              {t("dettaglioAccessorio.descrizione", {
                modello: accessorio.modello,
                tessuto: accessorio.tessuto.toLowerCase(),
              })}
            </p>
            <div className="preview-price mb-4">da € {accessorio.prezzoDa}</div>
            <button
              type="button"
              className="btn btn-sm btn-gold"
              onClick={() => handleConfigura(accessorio.id)}
            >
              {t("dettaglioAccessorio.configura")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DettaglioAccessorio;
