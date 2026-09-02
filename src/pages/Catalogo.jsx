import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCapi } from "../api/catalogo";
import { impostaCapo } from "../store/configuratoreSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { percorsoSagoma } from "../utils/sagome";

function Catalogo() {
  const { t } = useTranslation();
  const [catalogo, setCatalogo] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [genere, setGenere] = useState("Tutti");
  const [categoria, setCategoria] = useState("Tutte");
  const [tessuto, setTessuto] = useState("Tutti");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getCapi()
      .then(setCatalogo)
      .finally(() => setCaricamento(false));
  }, []);

  const categorieDisponibili = [
    ...new Set(
      catalogo
        .filter((capo) => genere === "Tutti" || capo.genere === genere)
        .map((capo) => capo.categoria),
    ),
  ];

  const tessutiDisponibili = [...new Set(catalogo.map((capo) => capo.tessuto))];

  const capiFiltrati = catalogo.filter((capo) => {
    const matchGenere = genere === "Tutti" || capo.genere === genere;
    const matchCategoria =
      categoria === "Tutte" || capo.categoria === categoria;
    const matchTessuto = tessuto === "Tutti" || capo.tessuto === tessuto;
    return matchGenere && matchCategoria && matchTessuto;
  });

  function handleConfigura(capoId) {
    dispatch(impostaCapo(capoId));
    navigate(isLoggedIn ? "/configuratore" : "/login");
  }

  function cambiaGenere(nuovoGenere) {
    setGenere(nuovoGenere);
    setCategoria("Tutte");
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
          <p className="text-muted">{t("catalogo.caricamento")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">{t("catalogo.eyebrow")}</div>
          <h2>{t("catalogo.titolo")}</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="filtri-catalogo">
          <div className="filtro-gruppo">
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

          <div className="filtro-gruppo">
            <p className="step-label mb-2">{t("catalogo.categoria")}</p>
            <div className="filter-group justify-content-start">
              <button
                type="button"
                className={`filter-tab ${categoria === "Tutte" ? "active" : ""}`}
                onClick={() => setCategoria("Tutte")}
              >
                {t("catalogo.tutte")}
              </button>
              {categorieDisponibili.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-tab ${categoria === cat ? "active" : ""}`}
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filtro-gruppo filtro-tessuto">
            <p className="step-label mb-2">{t("catalogo.tessuto")}</p>
            <select
              className="form-select form-select-filtro"
              value={tessuto}
              onChange={(e) => setTessuto(e.target.value)}
            >
              <option>{t("catalogo.tutti")}</option>
              {tessutiDisponibili.map((tes) => (
                <option key={tes}>{tes}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-muted small mb-4">
          {capiFiltrati.length} {t("catalogo.capiTrovati")}
        </p>

        <div className="row g-3">
          {capiFiltrati.map((capo) => (
            <div className="col-6 col-md-4 col-lg-3" key={capo.id}>
              <div className="product-card">
                <Link to={`/catalogo/${capo.id}`}>
                  <div className="product-thumb">
                    <img
                      src={percorsoSagoma(capo.categoria, capo.genere)}
                      alt={capo.nome}
                    />
                  </div>
                </Link>
                <div className="product-body">
                  <span className="badge-soft">
                    {capo.genere} · {capo.categoria}
                  </span>
                  <Link
                    to={`/catalogo/${capo.id}`}
                    style={{ color: "inherit" }}
                  >
                    <h5 className="mt-2 mb-1">{capo.nome}</h5>
                  </Link>
                  <p className="text-muted small mb-2">{capo.tessuto}</p>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-start align-items-md-center gap-2">
                    <div className="product-price">da € {capo.prezzoDa}</div>
                    <button
                      type="button"
                      className="btn btn-sm btn-gold"
                      onClick={() => handleConfigura(capo.id)}
                    >
                      {t("catalogo.crea")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {capiFiltrati.length === 0 && (
          <p className="text-center text-muted mt-5">
            {t("catalogo.nessunCapo")}
          </p>
        )}
      </div>
    </section>
  );
}

export default Catalogo;
