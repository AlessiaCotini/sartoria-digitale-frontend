import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { calcolaProporzioni } from "../utils/manichino";
import Manichino3D from "../components/Manichino3D";
import { useNavigate } from "react-router-dom";
import { creaOrdine } from "../api/ordini";
import { getMateriali, getCapo, getCapi } from "../api/catalogo";
import { getOpzioni } from "../api/opzioni";
import {
  impostaMateriale,
  impostaColore,
  impostaCapo,
} from "../store/configuratoreSlice";

function Configuratore() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const misure = useSelector((state) => state.auth.misure);
  const materialeSelezionato = useSelector(
    (state) => state.configuratore.materiale,
  );
  const coloreSelezionato = useSelector((state) => state.configuratore.colore);
  const capoId = useSelector((state) => state.configuratore.capoId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [creazioneOrdine, setCreazioneOrdine] = useState(false);
  const [erroreOrdine, setErroreOrdine] = useState("");

  function handleCreaOrdine() {
    setErroreOrdine("");
    setCreazioneOrdine(true);

    creaOrdine({
      capoId: capo.id,
      materialeId: materiale.id,
      colore: coloreSelezionato,
      opzioniIds: opzioniScelte,
    })
      .then(() => {
        navigate("/preventivo");
      })
      .catch((err) => {
        setErroreOrdine(
          err.response?.data?.errore || "Errore nella creazione dell'ordine.",
        );
      })
      .finally(() => setCreazioneOrdine(false));
  }

  const [materiali, setMateriali] = useState([]);
  const [capo, setCapo] = useState(null);
  const [capi, setCapi] = useState([]);
  const [opzioni, setOpzioni] = useState([]);
  const [opzioniSelezionate, setOpzioniSelezionate] = useState({});
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    Promise.all([
      getMateriali(),
      getCapi(),
      capoId ? getCapo(capoId) : Promise.resolve(null),
    ])
      .then(([listaMateriali, listaCapi, capoTrovato]) => {
        setMateriali(listaMateriali);
        setCapi(listaCapi);
        setCapo(capoTrovato);
        if (!materialeSelezionato && listaMateriali.length > 0) {
          dispatch(impostaMateriale(listaMateriali[0].nome));
          dispatch(impostaColore(listaMateriali[0].colori[0].nome));
        }
      })
      .finally(() => setCaricamento(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capoId]);

  useEffect(() => {
    let attivo = true;

    const promessa = capo
      ? getOpzioni(capo.categoria.toUpperCase())
      : Promise.resolve([]);

    promessa.then((lista) => {
      if (attivo) {
        setOpzioni(lista);
        setOpzioniSelezionate({});
      }
    });

    return () => {
      attivo = false;
    };
  }, [capo]);

  function handleSelezionaOpzione(tipo, opzioneId) {
    setOpzioniSelezionate((prev) => ({ ...prev, [tipo]: opzioneId }));
  }

  function handleCambiaCapo(nuovoCapoId) {
    dispatch(impostaCapo(nuovoCapoId));
  }

  function handleCambiaMateriale(nomeMateriale) {
    const nuovoMateriale = materiali.find((m) => m.nome === nomeMateriale);
    if (!nuovoMateriale) return;

    dispatch(impostaMateriale(nuovoMateriale.nome));

    const coloreAncoraValido = nuovoMateriale.colori.some(
      (c) => c.nome === coloreSelezionato,
    );
    if (!coloreAncoraValido) {
      dispatch(impostaColore(nuovoMateriale.colori[0].nome));
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (caricamento || materiali.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-muted">Caricamento configuratore...</p>
        </div>
      </section>
    );
  }

  const materiale =
    materiali.find((m) => m.nome === materialeSelezionato) || materiali[0];
  const colore =
    materiale.colori.find((c) => c.nome === coloreSelezionato) ||
    materiale.colori[0];

  const prezzoBase = capo ? capo.prezzoDa : 250;
  const nomeCapo = capo ? capo.nome : "un capo su misura";
  const opzioniScelte = Object.values(opzioniSelezionate).filter(Boolean);
  const sovrapprezzoTotale = opzioni
    .filter((o) => opzioniScelte.includes(o.id))
    .reduce((somma, o) => somma + o.sovrapprezzo, 0);
  const prezzoTotale =
    prezzoBase + materiale.prezzoAlMetro * 3 + sovrapprezzoTotale;

  const proporzioni = calcolaProporzioni(misure);

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Costruzione</div>
          <h2>Crea il tuo capo</h2>
          <p className="text-muted small mb-4">Stai configurando: {nomeCapo}</p>
          <div className="divider-gold"></div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="mb-4">
              <p className="step-label mb-2">Capo</p>
              <select
                className="form-select"
                value={capo?.id || ""}
                onChange={(e) => handleCambiaCapo(e.target.value)}
              >
                <option value="">Scegli un capo</option>
                {capi.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} — {c.genere} · {c.categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <p className="step-label mb-2">Materiale</p>
              <select
                className="form-select"
                value={materialeSelezionato}
                onChange={(e) => handleCambiaMateriale(e.target.value)}
              >
                {materiali.map((m) => (
                  <option key={m.nome} value={m.nome}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <p className="step-label mb-2">Colore</p>
              <div className="d-flex flex-wrap gap-2">
                {materiale.colori.map((c) => (
                  <button
                    key={c.nome}
                    type="button"
                    onClick={() => dispatch(impostaColore(c.nome))}
                    title={c.nome}
                    className="swatch"
                    style={{
                      backgroundColor: c.hex,
                      outline:
                        c.nome === coloreSelezionato
                          ? "2px solid var(--color-accent)"
                          : "1px solid var(--color-line)",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
              <p className="text-muted small mt-2 mb-0">{coloreSelezionato}</p>
            </div>

            {opzioni.length > 0 && (
              <div className="mb-4">
                {["CHIUSURA", "VESTIBILITA"].map((tipo) => {
                  const opzioniDelTipo = opzioni.filter((o) => o.tipo === tipo);
                  if (opzioniDelTipo.length === 0) return null;

                  return (
                    <div key={tipo} className="mb-3">
                      <p className="step-label mb-2">
                        {tipo === "CHIUSURA" ? "Chiusura" : "Vestibilità"}
                      </p>
                      <div className="filter-group justify-content-start">
                        {opzioniDelTipo.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            className={`filter-tab ${opzioniSelezionate[tipo] === o.id ? "active" : ""}`}
                            onClick={() => handleSelezionaOpzione(tipo, o.id)}
                          >
                            {o.nome}
                            {o.sovrapprezzo > 0 && ` (+€${o.sovrapprezzo})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="form-sartoria">
              <p className="step-label mb-1">Prezzo stimato</p>
              <p className="mb-0" style={{ fontSize: "1.4rem" }}>
                da € {prezzoTotale}
              </p>
              <p className="text-muted small mb-0">
                Base capo + tessuto {materiale.nome.toLowerCase()}
              </p>

              {capo ? (
                <>
                  <button
                    type="button"
                    className="btn btn-gold w-100 mt-3"
                    onClick={handleCreaOrdine}
                    disabled={creazioneOrdine}
                  >
                    {creazioneOrdine ? "Invio in corso..." : "Crea ordine"}
                  </button>
                  {erroreOrdine && (
                    <p className="text-danger small mt-2 mb-0">
                      {erroreOrdine}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted small mt-3 mb-0">
                  Scegli un capo dalla Collezione per poter creare un ordine.
                </p>
              )}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-panel p-0" style={{ overflow: "hidden" }}>
              <Manichino3D
                proporzioni={proporzioni}
                coloreHex={colore.hex}
                immagineCapo={capo?.immagine}
                categoria={capo?.categoria}
                genere={capo?.genere}
                modello={capo?.modello}
              />
            </div>
            <p className="text-muted small text-center mt-2">
              Manichino stilizzato (torace {misure.torace || "—"} cm, altezza{" "}
              {misure.altezza || "—"} cm) — trascina per ruotarlo. Busto e
              braccia rappresentano il capo, il resto è il corpo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Configuratore;
