import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { getMateriali } from "../api/catalogo";
import { getAccessorio } from "../api/accessori";
import { getOpzioniAccessorio } from "../api/opzioni";
import { creaOrdine } from "../api/ordini";
import { impostaMateriale, impostaColore } from "../store/configuratoreSlice";
import { percorsoAccessorio } from "../utils/percorsoAccessorio";
import AnteprimaAccessorio from "../components/AnteprimaAccessorio";

function ConfiguratoreAccessorio() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const materialeSelezionato = useSelector(
    (state) => state.configuratore.materiale,
  );
  const coloreSelezionato = useSelector((state) => state.configuratore.colore);
  const accessorioId = useSelector((state) => state.configuratore.accessorioId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [creazioneOrdine, setCreazioneOrdine] = useState(false);
  const [erroreOrdine, setErroreOrdine] = useState("");

  const [materiali, setMateriali] = useState([]);
  const [accessorio, setAccessorio] = useState(null);
  const [opzioni, setOpzioni] = useState([]);
  const [opzioneFantasiaId, setOpzioneFantasiaId] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    let attivo = true;

    (async () => {
      try {
        const [listaMateriali, trovato] = await Promise.all([
          getMateriali(),
          accessorioId ? getAccessorio(accessorioId) : Promise.resolve(null),
        ]);
        if (!attivo) return;
        setMateriali(listaMateriali);
        setAccessorio(trovato);
        if (trovato && !materialeSelezionato && listaMateriali.length > 0) {
          dispatch(impostaMateriale(listaMateriali[0].nome));
          dispatch(impostaColore(listaMateriali[0].colori[0].nome));
        }
      } catch {
        if (attivo) setAccessorio(null);
      } finally {
        if (attivo) setCaricamento(false);
      }
    })();

    return () => {
      attivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessorioId]);

  useEffect(() => {
    if (!accessorio) return;
    let attivo = true;
    getOpzioniAccessorio(accessorio.tipoBackend).then((lista) => {
      if (attivo) {
        setOpzioni(lista);
        setOpzioneFantasiaId(null);
      }
    });
    return () => {
      attivo = false;
    };
  }, [accessorio]);

  function handleCreaOrdine() {
    setErroreOrdine("");
    setCreazioneOrdine(true);

    creaOrdine({
      accessorioId: accessorio.id,
      materialeId: materiale.id,
      colore: coloreSelezionato,
      opzioniAccessorioIds: opzioneFantasiaId ? [opzioneFantasiaId] : [],
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

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (caricamento || materiali.length === 0 || !accessorio) {
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

  const opzioneFantasia = opzioni.find((o) => o.id === opzioneFantasiaId);
  const sovrapprezzo = opzioneFantasia ? opzioneFantasia.sovrapprezzo : 0;
  const prezzoTotale =
    accessorio.prezzoDa + materiale.prezzoAlMetro + sovrapprezzo;

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Costruzione</div>
          <h2>Personalizza il tuo accessorio</h2>
          <p className="text-muted small mb-4">
            Stai configurando: {accessorio.nome}
          </p>
          <div className="divider-gold"></div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
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
                <p className="step-label mb-2">Fantasia</p>
                <div className="filter-group justify-content-start">
                  {opzioni.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`filter-tab ${opzioneFantasiaId === o.id ? "active" : ""}`}
                      onClick={() => setOpzioneFantasiaId(o.id)}
                    >
                      {o.nome}
                      {o.sovrapprezzo > 0 && ` (+€${o.sovrapprezzo})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-sartoria">
              <p className="step-label mb-1">Prezzo stimato</p>
              <p className="mb-0" style={{ fontSize: "1.4rem" }}>
                da € {prezzoTotale}
              </p>
              <p className="text-muted small mb-0">
                Base accessorio + tessuto {materiale.nome.toLowerCase()}
              </p>
              <button
                type="button"
                className="btn btn-gold w-100 mt-3"
                onClick={handleCreaOrdine}
                disabled={creazioneOrdine}
              >
                {creazioneOrdine ? "Invio in corso..." : "Crea ordine"}
              </button>
              {erroreOrdine && (
                <p className="text-danger small mt-2 mb-0">{erroreOrdine}</p>
              )}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-panel p-0" style={{ overflow: "hidden" }}>
              <AnteprimaAccessorio
                percorsoSvg={percorsoAccessorio(
                  accessorio.tipo,
                  accessorio.genere,
                  accessorio.modello,
                )}
                coloreHex={colore.hex}
                fantasia={opzioneFantasia?.nome}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConfiguratoreAccessorio;
