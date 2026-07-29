import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCapi } from "../api/catalogo";

function Home() {
  const [capiInEvidenza, setCapiInEvidenza] = useState([]);

  useEffect(() => {
    getCapi().then((catalogo) => {
      setCapiInEvidenza(catalogo.filter((capo) => capo.inEvidenza));
    });
  }, []);
  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="eyebrow mb-3">
            Bellariva · sartoria artigianale, ora online
          </div>
          <h1 className="mb-4">
            Il vestito giusto esiste già.
            <br />
            <em>Personalizzalo online, provalo in sartoria.</em>
          </h1>
          <p className="lead mb-4 mx-auto">
            Sfoglia la collezione, configura il tuo capo su misura e ricevi un
            preventivo in pochi minuti — oppure prenota un appuntamento in
            sartoria per riparazioni, orli e abiti su misura più complessi.
          </p>
          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <Link to="/catalogo" className="btn btn-gold btn-lg">
              Sfoglia la collezione
            </Link>
            <a href="#servizi" className="btn btn-outline-cream btn-lg">
              Prenota in sartoria
            </a>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-title-eyebrow">Come funziona online</div>
            <h2>Dalla misura al preventivo, in tre passaggi</h2>
            <div className="divider-gold mx-auto"></div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">01</div>
                <h4 className="h5">Crea il profilo</h4>
                <p className="text-muted mb-0">
                  Inserisci le tue misure corporee per ottenere un'anteprima
                  realistica di come i capi vestirebbero sulla tua figura.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">02</div>
                <h4 className="h5">Configura l'abito</h4>
                <p className="text-muted mb-0">
                  Scegli taglio, materiale e colore da bozze predefinite e
                  visualizza il risultato finale a schermo.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">03</div>
                <h4 className="h5">Ricevi il preventivo</h4>
                <p className="text-muted mb-0">
                  Ottieni un preventivo approssimativo, comprensivo di prova in
                  negozio, e prenota il tuo appuntamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" id="servizi">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-title-eyebrow">Servizi in sartoria</div>
            <h2>Quando serve la mano di una sarta</h2>
            <div className="divider-gold mx-auto"></div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">01</div>
                <h4 className="h5">Riparazioni</h4>
                <p className="text-muted mb-3">
                  Cerniere, strappi, rammendi invisibili. Il tuo capo torna come
                  nuovo, spesso meglio.
                </p>
                <a
                  href="#prenota"
                  className="btn btn-outline-dark-luxury btn-sm"
                >
                  Prenota un appuntamento
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">02</div>
                <h4 className="h5">Orli &amp; modifiche</h4>
                <p className="text-muted mb-3">
                  Lunghezze, restringimenti, adattamenti. La vestibilità
                  perfetta in pochi giorni.
                </p>
                <a
                  href="#prenota"
                  className="btn btn-outline-dark-luxury btn-sm"
                >
                  Prenota un appuntamento
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">03</div>
                <h4 className="h5">Abiti su misura complessi</h4>
                <p className="text-muted mb-3">
                  Capi importanti — cerimonia, eventi speciali — che richiedono
                  più prove e lavorazioni dal vivo.
                </p>
                <a
                  href="#prenota"
                  className="btn btn-outline-dark-luxury btn-sm"
                >
                  Prenota un appuntamento
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <div className="section-title-eyebrow">Collezione</div>
              <h2 className="mb-0">Le nostre bozze più richieste</h2>
            </div>
            <Link to="/catalogo" className="btn btn-outline-dark-luxury">
              Vedi tutta la collezione
            </Link>
          </div>
          <div className="row g-4">
            {capiInEvidenza.map((capo) => (
              <div className="col-md-4" key={capo.id}>
                <div className="product-card">
                  <div className="product-thumb">
                    {capo.immagine ? (
                      <img src={capo.immagine} alt={capo.nome} />
                    ) : (
                      <span className="small">
                        {capo.nome} — foto in arrivo
                      </span>
                    )}
                  </div>
                  <div className="product-body">
                    <span className="badge-soft">{capo.categoria}</span>
                    <h5 className="mt-2 mb-1">{capo.nome}</h5>
                    <p className="text-muted small mb-2">{capo.descrizione}</p>
                    <div className="product-price">da € {capo.prezzoDa}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0" id="prenota">
        <div className="container" style={{ maxWidth: "640px" }}>
          <div className="text-center mb-4">
            <div className="section-title-eyebrow">Scrivici due righe</div>
            <h2>Prenota il tuo appuntamento</h2>
            <p className="text-muted">
              Raccontaci di cosa hai bisogno: ti rispondiamo entro un giorno con
              un preventivo trasparente.
            </p>
            <div className="divider-gold mx-auto"></div>
          </div>
          <form className="form-sartoria">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Il tuo nome"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="nome@esempio.it"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo di servizio</label>
              <select className="form-select">
                <option>Riparazioni</option>
                <option>Orli &amp; modifiche</option>
                <option>Abiti su misura complessi</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Il tuo messaggio</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Raccontaci di cosa hai bisogno..."
              ></textarea>
            </div>
            <button type="button" className="btn btn-gold w-100">
              Invia richiesta
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
