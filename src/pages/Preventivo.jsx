import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrdiniMiei } from "../api/ordini";
import ChatOrdine from "../components/ChatOrdine";

function Preventivo() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [ordineSelezionato, setOrdineSelezionato] = useState(null);

  useEffect(() => {
    getOrdiniMiei()
      .then(setOrdini)
      .finally(() => setCaricamento(false));
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (caricamento) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">Caricamento...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Preventivi</div>
          <h2>I tuoi ordini</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="list-group">
              {ordini.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${ordineSelezionato?.id === o.id ? "active" : ""}`}
                  onClick={() => setOrdineSelezionato(o)}
                >
                  {o.capoNome} — {o.materialeNome} ({o.colore})
                  <span className="d-block small text-muted">
                    {o.stato} · € {o.prezzoTotale}
                  </span>
                </button>
              ))}
              {ordini.length === 0 && (
                <p className="text-muted">Non hai ancora nessun ordine.</p>
              )}
            </div>
          </div>
          <div className="col-lg-7">
            {ordineSelezionato ? (
              <ChatOrdine
                ordine={ordineSelezionato}
                key={ordineSelezionato.id}
              />
            ) : (
              <p className="text-muted">
                Seleziona un ordine per aprire la chat con la sarta.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Preventivo;
