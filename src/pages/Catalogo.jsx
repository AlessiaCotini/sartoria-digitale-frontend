import { useState } from "react";
import { Link } from "react-router-dom";
import catalogo from "../data/catalogo";

const TESSUTI = [
  "Lana pettinata",
  "Cashmere blend",
  "Lino pregiato",
  "Cotone premium",
];

function Catalogo() {
  const [genere, setGenere] = useState("Tutti");
  const [categoria, setCategoria] = useState("Tutte");
  const [tessuto, setTessuto] = useState("Tutti");

  // categorie disponibili in base al genere scelto (es. "Gonne" compare solo se Donna/Tutti)
  const categorieDisponibili = [
    ...new Set(
      catalogo
        .filter((capo) => genere === "Tutti" || capo.genere === genere)
        .map((capo) => capo.categoria),
    ),
  ];

  const capiFiltrati = catalogo.filter((capo) => {
    const matchGenere = genere === "Tutti" || capo.genere === genere;
    const matchCategoria =
      categoria === "Tutte" || capo.categoria === categoria;
    const matchTessuto = tessuto === "Tutti" || capo.tessuto === tessuto;
    return matchGenere && matchCategoria && matchTessuto;
  });

  function cambiaGenere(nuovoGenere) {
    setGenere(nuovoGenere);
    setCategoria("Tutte"); // reset categoria quando cambio genere, per evitare filtri "orfani" (es. Gonne selezionata passando a Uomo)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Collezione</div>
          <h2>Le nostre bozze</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="mb-3">
          <p className="step-label mb-2">Genere</p>
          <div className="d-flex flex-wrap gap-2">
            {["Tutti", "Donna", "Uomo"].map((g) => (
              <button
                key={g}
                type="button"
                className={`btn btn-sm ${genere === g ? "btn-gold" : "btn-outline-dark-luxury"}`}
                onClick={() => cambiaGenere(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="step-label mb-2">Categoria</p>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm ${categoria === "Tutte" ? "btn-gold" : "btn-outline-dark-luxury"}`}
              onClick={() => setCategoria("Tutte")}
            >
              Tutte
            </button>
            {categorieDisponibili.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${categoria === cat ? "btn-gold" : "btn-outline-dark-luxury"}`}
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
            {TESSUTI.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <p className="text-muted small mb-4">
          {capiFiltrati.length} capi trovati
        </p>

        <div className="row g-4">
          {capiFiltrati.map((capo) => (
            <div className="col-md-4" key={capo.id}>
              <div className="product-card">
                <div className="product-thumb">
                  {capo.immagine ? (
                    <img src={capo.immagine} alt={capo.nome} />
                  ) : (
                    <span className="small">{capo.nome} — foto in arrivo</span>
                  )}
                </div>
                <div className="product-body">
                  <span className="badge-soft">
                    {capo.genere} · {capo.categoria}
                  </span>
                  <h5 className="mt-2 mb-1">{capo.nome}</h5>
                  <p className="text-muted small mb-2">{capo.tessuto}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="product-price">da € {capo.prezzoDa}</div>
                    <Link to="/login" className="btn btn-sm btn-gold">
                      Configura
                    </Link>
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
