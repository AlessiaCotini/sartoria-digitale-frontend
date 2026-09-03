import { useState, useEffect } from "react";
import { getOrdiniTutti } from "../../api/ordini";
import { getPagamentiTutti } from "../../api/pagamenti";
import RegistraPagamentoModal from "../../components/RegistraPagamentoModal";

function Pagamenti() {
  const [ordini, setOrdini] = useState([]);
  const [pagamenti, setPagamenti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [modale, setModale] = useState(null);

  function ricarica() {
    return Promise.all([getOrdiniTutti(), getPagamentiTutti()]).then(
      ([listaOrdini, listaPagamenti]) => {
        setOrdini(listaOrdini);
        setPagamenti(listaPagamenti);
      },
    );
  }

  useEffect(() => {
    ricarica().finally(() => setCaricamento(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (caricamento) {
    return <p className="text-muted">Caricamento pagamenti...</p>;
  }

  const righe = ordini.map((o) => ({
    ordine: o,
    pagamento: pagamenti.find((p) => p.ordineId === o.id),
  }));

  return (
    <>
      <div className="table-gestionale-wrap">
        <table className="table table-gestionale align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Capo</th>
              <th>Totale</th>
              <th>Acconto</th>
              <th>Saldo</th>
              <th>Stato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {righe.map(({ ordine, pagamento }) => (
              <tr key={ordine.id}>
                <td>
                  {ordine.nomeCliente}
                  {!ordine.clienteRegistrato && (
                    <span className="badge-soft ms-2">negozio</span>
                  )}
                </td>
                <td>{ordine.capoNome || ordine.accessorioNome}</td>
                <td>
                  <span className="colonna-prezzo">
                    € {ordine.prezzoTotale}
                  </span>
                </td>
                <td>
                  {pagamento?.accontoImporto != null
                    ? `€ ${pagamento.accontoImporto} (${pagamento.accontoMetodo}, ${pagamento.accontoData})`
                    : "—"}
                </td>
                <td>
                  {pagamento?.saldoImporto != null
                    ? `€ ${pagamento.saldoImporto} (${pagamento.saldoMetodo}, ${pagamento.saldoData})`
                    : "—"}
                </td>
                <td>
                  <span className="badge-soft">
                    {pagamento?.stato || "NON_PAGATO"}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    {pagamento?.accontoImporto == null && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark-luxury"
                        onClick={() =>
                          setModale({
                            ordine,
                            tipo: "acconto",
                            valoreDefault: Math.round(
                              ordine.prezzoTotale * 0.3,
                            ),
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
                          className="btn btn-sm btn-outline-dark-luxury"
                          onClick={() =>
                            setModale({
                              ordine,
                              tipo: "saldo",
                              valoreDefault:
                                ordine.prezzoTotale - pagamento.accontoImporto,
                            })
                          }
                        >
                          Registra saldo
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
            {righe.length === 0 && (
              <tr>
                <td colSpan="7" className="text-muted text-center">
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
    </>
  );
}

export default Pagamenti;
