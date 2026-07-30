import { useState, useEffect } from "react";
import { getConteggioNonLetti, getConteggioPerOrdine } from "../api/chat";
import { getOrdiniTutti } from "../api/ordini";

const STATI_PREVENTIVO = ["PREVENTIVO_RICHIESTO"];

function BadgeMessaggi({ ambito }) {
  const [conteggio, setConteggio] = useState(0);

  useEffect(() => {
    let attivo = true;

    function aggiorna() {
      if (ambito !== "preventivi" && ambito !== "ordini") {
        getConteggioNonLetti().then((n) => {
          if (attivo) setConteggio(n);
        });
        return;
      }

      Promise.all([getConteggioPerOrdine(), getOrdiniTutti()]).then(
        ([conteggi, ordini]) => {
          if (!attivo) return;
          const mappaStato = Object.fromEntries(
            ordini.map((o) => [o.id, o.stato]),
          );
          const totale = conteggi
            .filter((c) => {
              const inPreventivo = STATI_PREVENTIVO.includes(
                mappaStato[c.ordineId],
              );
              return ambito === "preventivi" ? inPreventivo : !inPreventivo;
            })
            .reduce((somma, c) => somma + c.conteggio, 0);
          setConteggio(totale);
        },
      );
    }

    aggiorna();
    const intervallo = setInterval(aggiorna, 15000);

    return () => {
      attivo = false;
      clearInterval(intervallo);
    };
  }, [ambito]);

  if (conteggio === 0) return null;

  return (
    <span
      className="badge rounded-pill bg-danger ms-1"
      style={{ fontSize: "0.7rem" }}
    >
      {conteggio}
    </span>
  );
}

export default BadgeMessaggi;
