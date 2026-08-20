import { useState, useEffect } from "react";
import {
  getOrdiniTutti,
  assegnaOrdine,
  cambiaStatoOrdine,
} from "../../api/ordini";
import { getPagamentiTutti } from "../../api/pagamenti";
import { getConteggioPerOrdine } from "../../api/chat";
import RegistraPagamentoModal from "../../components/RegistraPagamentoModal";
import ChatModal from "../../components/ChatModal";

const STATI_ORDINE = [
  "PREVENTIVO_RICHIESTO",
  "ACCETTATO",
  "MATERIALI_ORDINATI",
  "IN_LAVORAZIONE",
  "COMPLETATO",
  "ANNULLATO",
];

const STATI_PRIMA_DI_ACCETTATO = ["PREVENTIVO_RICHIESTO", "ANNULLATO"];

function Ordini() {
  const [ordini, setOrdini] = useState([]);
  const [pagamenti, setPagamenti] = useState([]);
  const [conteggi, setConteggi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [modale, setModale] = useState(null);
  const [erroreStato, setErroreStato] = useState("");
  const [chatAperta, setChatAperta] = useState(null);

  function ricarica() {
    return Promise.all([getOrdiniTutti(), getPagamentiTutti()]).then(
      ([listaOrdini, listaPagamenti]) => {
        setOrdini(listaOrdini);
        setPagamenti(listaPagamenti);
      },
    );
  }

  function ricaricaConteggi() {
    return getConteggioPerOrdine().then(setConteggi);
  }

  function conteggioDi(ordineId) {
    return conteggi.find((c) => c.ordineId === ordineId)?.conteggio || 0;
  }

  useEffect(() => {
    Promise.all([ricarica(), ricaricaConteggi()]).finally(() =>
      setCaricamento(false),
    );
    const intervallo = setInterval(ricaricaConteggi, 15000);
    return () => clearInterval(intervallo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAssegna(id) {
    assegnaOrdine(id).then(ricarica);
  }

  function handleCambiaStato(id, stato) {
    setErroreStato("");
    cambiaStatoOrdine(id, stato)
      .then(ricarica)
      .catch((err) =>
        setErroreStato(
          err.response?.data?.errore || "Impossibile cambiare stato.",
        ),
      );
  }

  if (caricamento) {
    return <p className="text-muted">Caricamento ordini...</p>;
  }

  return (
    <>
      {erroreStato && <p className="text-danger small mb-2">{erroreStato}</p>}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Capo</th>
              <th>Materiale / colore</th>
              <th>Prezzo</th>
              <th>Stato</th>
              <th>Assegnato</th>
              <th>Chat</th>
              <th>Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {ordini.map((o) => {
              const pagamento = pagamenti.find((p) => p.ordineId === o.id);
              const puoGestirePagamento = !STATI_PRIMA_DI_ACCETTATO.includes(
                o.stato,
              );

              return (
                <tr key={o.id}>
                  <td>
                    {o.nomeCliente}
                    {!o.clienteRegistrato && (
                      <span className="badge-soft ms-2">negozio</span>
                    )}
                  </td>
                  <td>{o.capoNome || o.accessorioNome}</td>
                  <td>
                    {o.materialeNome} — {o.colore}
                  </td>
                  <td>€ {o.prezzoTotale}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={o.stato}
                      onChange={(e) => handleCambiaStato(o.id, e.target.value)}
                    >
                      {STATI_ORDINE.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {o.assegnatoAId ? (
                      "Sì"
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark-luxury"
                        onClick={() => handleAssegna(o.id)}
                      >
                        Prendi in carico
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark-luxury position-relative"
                      onClick={() =>
                        setChatAperta({ ordine: o, tipoChiamata: "apertura" })
                      }
                    >
                      Apri
                      {conteggioDi(o.id) > 0 && (
                        <span className="badge-soft ms-1">
                          {conteggioDi(o.id)}
                        </span>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge-soft">
                        {pagamento?.stato || "NON_PAGATO"}
                      </span>
                      {puoGestirePagamento &&
                        pagamento?.accontoImporto == null && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark-luxury"
                            onClick={() =>
                              setModale({
                                ordine: o,
                                tipo: "acconto",
                                valoreDefault: Math.round(o.prezzoTotale * 0.3),
                              })
                            }
                          >
                            Registra acconto
                          </button>
                        )}
                      {pagamento?.accontoImporto != null &&
                        pagamento?.saldoImporto == null && (
                          <button
                            type="button"
                            className="btn btn-sm btn-gold"
                            onClick={() =>
                              setModale({
                                ordine: o,
                                tipo: "saldo",
                                valoreDefault:
                                  o.prezzoTotale - pagamento.accontoImporto,
                              })
                            }
                          >
                            Registra saldo
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {ordini.length === 0 && (
              <tr>
                <td colSpan="8" className="text-muted text-center">
                  Nessun ordine.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modale && (
        <RegistraPagamentoModal
          ordine={modale.ordine}
          tipo={modale.tipo}
          valoreDefault={modale.valoreDefault}
          onChiudi={() => setModale(null)}
          onRegistrato={ricarica}
        />
      )}
      {chatAperta && (
        <ChatModal
          ordine={chatAperta.ordine}
          onChiudi={() => {
            setChatAperta(null);
            ricaricaConteggi();
          }}
        />
      )}
    </>
  );
}

export default Ordini;
