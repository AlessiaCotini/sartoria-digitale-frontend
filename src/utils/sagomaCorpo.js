// elenco delle fasce del corpo, dal collo ai piedi, ciascuna con la propria
// soglia di altezza (frazione 0-1, personalizzata) e la propria scala di
// circonferenza. Deve restare ordinato da frazione più alta a più bassa.
function fasce(proporzioni) {
  return [
    { frazione: proporzioni.frazioneCollo, scala: proporzioni.scalaCollo },
    { frazione: proporzioni.frazioneSpalle, scala: proporzioni.scalaSpalle },
    { frazione: proporzioni.frazioneTorace, scala: proporzioni.scalaTorace },
    { frazione: proporzioni.frazioneBusto, scala: proporzioni.scalaBusto },
    { frazione: proporzioni.frazioneVita, scala: proporzioni.scalaVita },
    { frazione: proporzioni.frazioneFianchi, scala: proporzioni.scalaFianchi },
    { frazione: proporzioni.frazioneCoscia, scala: proporzioni.scalaCoscia },
    {
      frazione: proporzioni.frazioneGinocchio,
      scala: proporzioni.scalaGinocchio,
    },
    {
      frazione: proporzioni.frazioneCaviglia,
      scala: proporzioni.scalaCaviglia,
    },
    { frazione: 0, scala: 1 },
  ];
}

export function fattoreScalaPerAltezza(frazione, proporzioni) {
  const lista = fasce(proporzioni);

  // sopra la fascia più alta (collo): resta piatto, come su testa/collo
  if (frazione >= lista[0].frazione) return lista[0].scala;

  for (let i = 0; i < lista.length - 1; i++) {
    const alta = lista[i];
    const bassa = lista[i + 1];
    if (frazione <= alta.frazione && frazione >= bassa.frazione) {
      const range = alta.frazione - bassa.frazione;
      const t = range > 0 ? (frazione - bassa.frazione) / range : 0;
      return bassa.scala + (alta.scala - bassa.scala) * t;
    }
  }

  return 1;
}

// come fasce(), ma per il raggio REALE del tessuto (in metri), niente "spalle"
// perché non è una circonferenza ma una larghezza — tra collo e torace
// il raggio si interpola naturalmente senza bisogno di un punto dedicato
function fasceRaggio(proporzioni) {
  return [
    { frazione: proporzioni.frazioneCollo, raggio: proporzioni.raggioCollo },
    { frazione: proporzioni.frazioneTorace, raggio: proporzioni.raggioTorace },
    { frazione: proporzioni.frazioneBusto, raggio: proporzioni.raggioBusto },
    { frazione: proporzioni.frazioneVita, raggio: proporzioni.raggioVita },
    {
      frazione: proporzioni.frazioneFianchi,
      raggio: proporzioni.raggioFianchi,
    },
    { frazione: proporzioni.frazioneCoscia, raggio: proporzioni.raggioCoscia },
    {
      frazione: proporzioni.frazioneGinocchio,
      raggio: proporzioni.raggioGinocchio,
    },
    {
      frazione: proporzioni.frazioneCaviglia,
      raggio: proporzioni.raggioCaviglia,
    },
    { frazione: 0, raggio: proporzioni.raggioCaviglia },
  ];
}

export function raggioRealePerAltezza(frazione, proporzioni) {
  const lista = fasceRaggio(proporzioni);

  if (frazione >= lista[0].frazione) return lista[0].raggio;

  for (let i = 0; i < lista.length - 1; i++) {
    const alta = lista[i];
    const bassa = lista[i + 1];
    if (frazione <= alta.frazione && frazione >= bassa.frazione) {
      const range = alta.frazione - bassa.frazione;
      const t = range > 0 ? (frazione - bassa.frazione) / range : 0;
      return bassa.raggio + (alta.raggio - bassa.raggio) * t;
    }
  }

  return proporzioni.raggioCaviglia;
}
