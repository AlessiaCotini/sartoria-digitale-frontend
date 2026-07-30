import { useState, useEffect } from "react";
import { getConteggioNonLetti } from "../api/chat";

function BadgeMessaggi() {
  const [conteggio, setConteggio] = useState(0);

  useEffect(() => {
    let attivo = true;

    function aggiorna() {
      getConteggioNonLetti().then((n) => {
        if (attivo) setConteggio(n);
      });
    }

    aggiorna();
    const intervallo = setInterval(aggiorna, 15000);

    return () => {
      attivo = false;
      clearInterval(intervallo);
    };
  }, []);

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
