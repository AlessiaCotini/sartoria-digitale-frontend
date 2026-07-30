import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCapo } from "../api/catalogo";
import { impostaCapo } from "../store/configuratoreSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Dettaglio() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [capo, setCapo] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    let attivo = true;

    getCapo(id)
      .then((trovato) => {
        if (attivo) setCapo(trovato);
      })
      .catch(() => {
        if (attivo) setCapo(null);
      })
      .finally(() => {
        if (attivo) setCaricamento(false);
      });

    return () => {
      attivo = false;
    };
  }, [id]);

  function handleConfigura(capoId) {
    dispatch(impostaCapo(capoId));
    navigate(isLoggedIn ? "/configuratore" : "/login");
  }

  if (caricamento) {
    return (
      <section className="section">
        <div className="container text-center">
          <p className="text-muted">Caricamento...</p>
        </div>
      </section>
    );
  }

  if (!capo) {
    return (
      <section className="section">
        <div className="container text-center">
          <h2>Capo non trovato</h2>
          <Link to="/catalogo" className="btn btn-outline-dark-luxury mt-3">
            Torna alla collezione
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <Link to="/catalogo" className="step-label d-inline-block mb-4">
          ← Torna alla collezione
        </Link>
        <div className="row g-5">
          <div className="col-lg-6">
            <div className="product-card">
              <div className="product-thumb" style={{ aspectRatio: "3/4" }}>
                {capo.immagine ? (
                  <img src={capo.immagine} alt={capo.nome} />
                ) : (
                  <span className="small">{capo.nome} — foto in arrivo</span>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <span className="badge-soft">
              {capo.genere} · {capo.categoria}
            </span>
            <h2 className="mt-3 mb-3">{capo.nome}</h2>
            <p className="text-muted mb-4">
              Modello "{capo.modello}" realizzato in{" "}
              {capo.tessuto.toLowerCase()}. Punto di partenza ideale per la tua
              Costruzione su misura.
            </p>
            <div className="preview-price mb-4">da € {capo.prezzoDa}</div>
            <button
              type="button"
              className="btn btn-sm btn-gold"
              onClick={() => handleConfigura(capo.id)}
            >
              Configura
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dettaglio;
