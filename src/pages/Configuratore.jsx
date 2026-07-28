import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { MATERIALI } from "../data/materiali";
import { impostaMateriale, impostaColore } from "../store/configuratoreSlice";
import { calcolaProporzioni } from "../utils/manichino";
import Manichino3D from "../components/Manichino3D";
import catalogo from "../data/catalogo";

function Configuratore() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const misure = useSelector((state) => state.auth.misure);
  const materialeSelezionato = useSelector(
    (state) => state.configuratore.materiale,
  );
  const coloreSelezionato = useSelector((state) => state.configuratore.colore);
  const dispatch = useDispatch();
  const materiale = MATERIALI.find((m) => m.nome === materialeSelezionato);
  const colore = materiale.colori.find((c) => c.nome === coloreSelezionato);

  const capoId = useSelector((state) => state.configuratore.capoId);
  const capo = catalogo.find((c) => c.id === capoId);

  const prezzoBase = capo ? capo.prezzoDa : 250;
  const nomeCapo = capo ? capo.nome : "un capo su misura";
  const prezzoTotale = prezzoBase + materiale.prezzoAlMetro * 3;

  const proporzioni = calcolaProporzioni(misure);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

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
              <p className="step-label mb-2">Materiale</p>
              <select
                className="form-select"
                value={materialeSelezionato}
                onChange={(e) => dispatch(impostaMateriale(e.target.value))}
              >
                {MATERIALI.map((m) => (
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

            <div className="form-sartoria">
              <p className="step-label mb-1">Prezzo stimato</p>
              <p className="mb-0" style={{ fontSize: "1.4rem" }}>
                da € {prezzoTotale}
              </p>
              <p className="text-muted small mb-0">
                Base capo + tessuto {materiale.nome.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-panel p-0" style={{ overflow: "hidden" }}>
              <Manichino3D
                proporzioni={proporzioni}
                coloreHex={colore.hex}
                immagineCapo={capo?.immagine}
                categoria={capo?.categoria}
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
