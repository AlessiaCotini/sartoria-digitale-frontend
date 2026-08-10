import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getCapi } from "../api/catalogo";
import { getAccessori } from "../api/accessori";
import { percorsoSagoma } from "../utils/sagome";
import { percorsoAccessorio } from "../utils/percorsoAccessorio";

function Ricerca() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [capi, setCapi] = useState([]);
  const [accessori, setAccessori] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    let attivo = true;

    (async () => {
      try {
        const [listaCapi, listaAccessori] = await Promise.all([
          getCapi(),
          getAccessori(),
        ]);
        if (!attivo) return;
        setCapi(listaCapi);
        setAccessori(listaAccessori);
      } catch {
        if (attivo) {
          setCapi([]);
          setAccessori([]);
        }
      } finally {
        if (attivo) setCaricamento(false);
      }
    })();

    return () => {
      attivo = false;
    };
  }, []);

  function corrisponde(testo) {
    return !!testo && testo.toLowerCase().includes(query);
  }

  const capiTrovati = query
    ? capi.filter(
        (c) =>
          corrisponde(c.nome) ||
          corrisponde(c.categoria) ||
          corrisponde(c.tessuto) ||
          corrisponde(c.modello),
      )
    : [];

  const accessoriTrovati = query
    ? accessori.filter(
        (a) =>
          corrisponde(a.nome) ||
          corrisponde(a.tipo) ||
          corrisponde(a.tessuto) ||
          corrisponde(a.modello),
      )
    : [];

  const totale = capiTrovati.length + accessoriTrovati.length;

  if (caricamento) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">Ricerca in corso...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Ricerca</div>
          <h2>Risultati per {searchParams.get("q") || ""}</h2>
          <div className="divider-gold"></div>
        </div>

        <p className="text-muted small mb-4">{totale} risultati trovati</p>

        {totale === 0 && (
          <p className="text-center text-muted mt-5">
            Nessun capo o accessorio corrisponde alla ricerca.
          </p>
        )}

        {capiTrovati.length > 0 && (
          <div className="mb-5">
            <p className="step-label mb-3">Capi</p>
            <div className="row g-3">
              {capiTrovati.map((capo) => (
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
                      <div className="product-price">da € {capo.prezzoDa}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {accessoriTrovati.length > 0 && (
          <div>
            <p className="step-label mb-3">Accessori</p>
            <div className="row g-3">
              {accessoriTrovati.map((a) => (
                <div className="col-6 col-md-4 col-lg-3" key={a.id}>
                  <div className="product-card">
                    <Link to={`/accessori/${a.id}`}>
                      <div className="product-thumb">
                        <img
                          src={percorsoAccessorio(a.tipo, a.genere, a.modello)}
                          alt={a.nome}
                        />
                      </div>
                    </Link>
                    <div className="product-body">
                      <span className="badge-soft">
                        {a.genere} · {a.tipo}
                      </span>
                      <Link
                        to={`/accessori/${a.id}`}
                        style={{ color: "inherit" }}
                      >
                        <h5 className="mt-2 mb-1">{a.nome}</h5>
                      </Link>
                      <div className="product-price">da € {a.prezzoDa}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Ricerca;
