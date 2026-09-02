import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAccessori } from "../api/accessori";
import { impostaAccessorio } from "../store/configuratoreSlice";
import { percorsoAccessorio } from "../utils/percorsoAccessorio";
import ImmagineAccessorio from "../components/ImmagineAccessorio";

function Accessori() {
  const { t } = useTranslation();
  const [catalogo, setCatalogo] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [genere, setGenere] = useState("Tutti");
  const [tipo, setTipo] = useState("Tutti");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAccessori()
      .then(setCatalogo)
      .finally(() => setCaricamento(false));
  }, []);

  const tipiDisponibili = [
    ...new Set(
      catalogo
        .filter((a) => genere === "Tutti" || a.genere === genere)
        .map((a) => a.tipo),
    ),
  ];

  const accessoriFiltrati = catalogo.filter((a) => {
    const matchGenere = genere === "Tutti" || a.genere === genere;
    const matchTipo = tipo === "Tutti" || a.tipo === tipo;
    return matchGenere && matchTipo;
  });

  function handleConfigura(accessorioId) {
    dispatch(impostaAccessorio(accessorioId));
    navigate(isLoggedIn ? "/configuratore-accessorio" : "/login");
  }

  function cambiaGenere(nuovoGenere) {
    setGenere(nuovoGenere);
    setTipo("Tutti");
  }

  const etichettaGenere = {
    Tutti: t("catalogo.tutti"),
    Donna: t("catalogo.donna"),
    Uomo: t("catalogo.uomo"),
  };

  if (caricamento) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">{t("accessori.caricamento")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">{t("accessori.eyebrow")}</div>
          <h2>{t("accessori.titolo")}</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="d-flex flex-column flex-lg-row gap-4 mb-4">
          <div className="text-left">
            <p className="step-label mb-2">{t("catalogo.genere")}</p>
            <div className="filter-group justify-content-start">
              {["Tutti", "Donna", "Uomo"].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`filter-tab ${genere === g ? "active" : ""}`}
                  onClick={() => cambiaGenere(g)}
                >
                  {etichettaGenere[g]}
                </button>
              ))}
            </div>
          </div>

          <div className="text-left">
            <p className="step-label mb-2">{t("accessori.tipo")}</p>
            <div className="filter-group justify-content-start">
              <button
                type="button"
                className={`filter-tab ${tipo === "Tutti" ? "active" : ""}`}
                onClick={() => setTipo("Tutti")}
              >
                {t("catalogo.tutti")}
              </button>
              {tipiDisponibili.map((tp) => (
                <button
                  key={tp}
                  type="button"
                  className={`filter-tab ${tipo === tp ? "active" : ""}`}
                  onClick={() => setTipo(tp)}
                >
                  {tp}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-muted small mb-4">
          {accessoriFiltrati.length} {t("accessori.accessoriTrovati")}
        </p>

        <div className="row g-3">
          {accessoriFiltrati.map((a) => (
            <div className="col-6 col-md-4 col-lg-3" key={a.id}>
              <div className="product-card">
                <Link to={`/accessori/${a.id}`}>
                  <div className="product-thumb">
                    <ImmagineAccessorio
                      src={percorsoAccessorio(a.tipo, a.genere, a.modello)}
                      alt={a.nome}
                    />
                  </div>
                </Link>
                <div className="product-body">
                  <span className="badge-soft">
                    {a.genere} · {a.tipo}
                  </span>
                  <Link to={`/accessori/${a.id}`} style={{ color: "inherit" }}>
                    <h5 className="mt-2 mb-1">{a.nome}</h5>
                  </Link>
                  <p className="text-muted small mb-2">{a.tessuto}</p>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-start align-items-md-center gap-2">
                    <div className="product-price">da € {a.prezzoDa}</div>
                    <button
                      type="button"
                      className="btn btn-sm btn-gold"
                      onClick={() => handleConfigura(a.id)}
                    >
                      {t("catalogo.crea")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {accessoriFiltrati.length === 0 && (
          <p className="text-center text-muted mt-5">
            {t("accessori.nessunAccessorio")}
          </p>
        )}
      </div>
    </section>
  );
}

export default Accessori;
