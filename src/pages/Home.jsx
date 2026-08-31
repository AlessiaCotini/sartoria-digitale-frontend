import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCapi } from "../api/catalogo";
import { percorsoSagoma } from "../utils/sagome";

function Home() {
  const { t } = useTranslation();
  const [capiInEvidenza, setCapiInEvidenza] = useState([]);

  useEffect(() => {
    getCapi().then((catalogo) => {
      setCapiInEvidenza(catalogo.filter((capo) => capo.inEvidenza));
    });
  }, []);

  return (
    <>
      <header className="hero">
        <div className="img-placeholder">
          <img
            src="/immagini/hero-atelier.jpg"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="container">
          <div className="eyebrow mb-3">{t("home.eyebrow")}</div>
          <h1 className="mb-4">
            {t("home.titolo1")}
            <br />
            <em>{t("home.titolo2")}</em>
          </h1>
          <p className="lead mb-4 mx-auto">{t("home.lead")}</p>
          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <Link to="/catalogo" className="btn btn-gold btn-lg">
              {t("home.sfogliaCollezione")}
            </Link>
            <a href="#servizi" className="btn btn-outline-cream btn-lg">
              {t("home.prenotaSartoria")}
            </a>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-title-eyebrow">
              {t("home.comeFunzionaEyebrow")}
            </div>
            <h2>{t("home.comeFunzionaTitolo")}</h2>
            <div className="divider-gold mx-auto"></div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">01</div>
                <h4 className="h5">{t("home.step1Titolo")}</h4>
                <p className="text-muted mb-0">{t("home.step1Testo")}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">02</div>
                <h4 className="h5">{t("home.step2Titolo")}</h4>
                <p className="text-muted mb-0">{t("home.step2Testo")}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">03</div>
                <h4 className="h5">{t("home.step3Titolo")}</h4>
                <p className="text-muted mb-0">{t("home.step3Testo")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="img-placeholder atelier-photo">
                <img
                  src="/immagini/hero-atelier.jpg"
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title-eyebrow">La nostra storia</div>
              <h2>Artigianalità, da sempre</h2>
              <div className="divider-gold mb-3"></div>
              <p className="text-muted">
                Bellariva nasce dalla passione per la sartoria su misura: ogni
                capo viene disegnato, tagliato e cucito a mano nel nostro
                atelier, seguendo le proporzioni reali di chi lo indosserà.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" id="servizi">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-title-eyebrow">
              {t("home.serviziEyebrow")}
            </div>
            <h2>{t("home.serviziTitolo")}</h2>
            <div className="divider-gold mx-auto"></div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">01</div>
                <h4 className="h5">{t("home.riparazioniTitolo")}</h4>
                <p className="text-muted mb-3">{t("home.riparazioniTesto")}</p>
                <a
                  href="#prenota"
                  className="btn btn-outline-dark-luxury btn-sm"
                >
                  {t("home.prenotaAppuntamento")}
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">02</div>
                <h4 className="h5">{t("home.orliTitolo")}</h4>
                <p className="text-muted mb-3">{t("home.orliTesto")}</p>
                <a
                  href="#prenota"
                  className="btn btn-outline-dark-luxury btn-sm"
                >
                  {t("home.prenotaAppuntamento")}
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-step">
                <div className="step-number mb-2">03</div>
                <h4 className="h5">{t("home.complessiTitolo")}</h4>
                <p className="text-muted mb-3">{t("home.complessiTesto")}</p>
                <a
                  href="#prenota"
                  className="btn btn-outline-dark-luxury btn-sm"
                >
                  {t("home.prenotaAppuntamento")}
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
              <div className="section-title-eyebrow">
                {t("home.collezioneEyebrow")}
              </div>
              <h2 className="mb-0">{t("home.collezioneTitolo")}</h2>
            </div>
            <Link to="/catalogo" className="btn btn-outline-dark-luxury">
              {t("home.vediTuttaCollezione")}
            </Link>
          </div>
          <div className="row g-4">
            {capiInEvidenza.map((capo) => (
              <div className="col-md-4" key={capo.id}>
                <div className="product-card">
                  <div className="product-thumb">
                    <img
                      src={percorsoSagoma(capo.categoria, capo.genere)}
                      alt={capo.nome}
                    />
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
            <div className="section-title-eyebrow">
              {t("home.contattaciEyebrow")}
            </div>
            <h2>{t("home.contattaciTitolo")}</h2>
            <p className="text-muted">{t("home.contattaciTesto")}</p>
            <div className="divider-gold mx-auto"></div>
          </div>
          <form className="form-sartoria">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">{t("home.formNome")}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("home.formNomePlaceholder")}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t("home.formEmail")}</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder={t("home.formEmailPlaceholder")}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">{t("home.formTipoServizio")}</label>
              <select className="form-select">
                <option>{t("home.riparazioniTitolo")}</option>
                <option>{t("home.orliTitolo")}</option>
                <option>{t("home.complessiTitolo")}</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">{t("home.formMessaggio")}</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder={t("home.formMessaggioPlaceholder")}
              ></textarea>
            </div>
            <button type="button" className="btn btn-gold w-100">
              {t("home.formInvia")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
