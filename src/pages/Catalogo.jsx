import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCapi } from "../api/catalogo";
import { impostaCapo } from "../store/configuratoreSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Catalogo() {
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

  if (caricamento) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">Caricamento collezione...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Collezione</div>
          <h2>Le nostre bozze</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="mb-3 text-left">
          <p className="step-label mb-2">Genere</p>
          <div className="filter-group justify-content-start">
            {["Tutti", "Donna", "Uomo"].map((g) => (
              <button
                key={g}
                type="button"
                className={`filter-tab ${genere === g ? "active" : ""}`}
                onClick={() => cambiaGenere(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 text-left">
          <p className="step-label mb-2">Categoria</p>
          <div className="filter-group justify-content-start">
            <button
              type="button"
              className={`filter-tab ${categoria === "Tutte" ? "active" : ""}`}
              onClick={() => setCategoria("Tutte")}
            >
              Tutte
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

        <div className="mb-4" style={{ maxWidth: "280px" }}>
          <p className="step-label mb-2">Tessuto</p>
          <select
            className="form-select"
            value={tessuto}
            onChange={(e) => setTessuto(e.target.value)}
          >
            <option>Tutti</option>
            {tessutiDisponibili.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <p className="text-muted small mb-4">
          {capiFiltrati.length} capi trovati
        </p>

        <div className="row g-3">
          {capiFiltrati.map((capo) => (
            <div className="col-6 col-md-4 col-lg-3" key={capo.id}>
              <div className="product-card">
                <Link to={`/catalogo/${capo.id}`}>
                  <div className="product-thumb">
                    {capo.immagine ? (
                      <img src={capo.immagine} alt={capo.nome} />
                    ) : (
                      <span className="small">
                        {capo.nome} — foto in arrivo
                      </span>
                    )}
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="product-price">da € {capo.prezzoDa}</div>
                    <button
                      type="button"
                      className="btn btn-sm btn-gold"
                      onClick={() => handleConfigura(capo.id)}
                    >
                      Crea
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {capiFiltrati.length === 0 && (
          <p className="text-center text-muted mt-5">
            Nessun capo corrisponde ai filtri scelti.
          </p>
        )}
      </div>
    </section>
  );
}

export default Catalogo;
