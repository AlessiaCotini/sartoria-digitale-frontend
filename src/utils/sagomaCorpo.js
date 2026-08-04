// fasce per la deformazione del CORPO (scala relativa)
function fasce(proporzioni) {
  return [
    { frazione: proporzioni.frazioneCollo, scala: proporzioni.scalaCollo },
    {
      frazione: proporzioni.frazioneSpallaMesh,
      scala: proporzioni.scalaSpalle,
    },
    { frazione: proporzioni.frazioneTorace, scala: proporzioni.scalaTorace },
    { frazione: proporzioni.frazioneVita, scala: proporzioni.scalaVita },
    {
      frazione: proporzioni.frazioneFianchi,
      scala: proporzioni.scalaFianchi,
    },
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

// fasce per il raggio REALE del tessuto (in metri): include una fascia
// "spalla" larga (larghezza reale, non circonferenza) così il tessuto resta
// largo fino all'attaccatura della manica e si restringe solo verso il collo
function fasceRaggio(proporzioni) {
  return [
    {
      frazione: proporzioni.frazioneCollo,
      raggio: proporzioni.raggioColloReale ?? proporzioni.raggioCollo,
    },
    {
      frazione: proporzioni.frazioneSpallaMesh,
      raggio: proporzioni.raggioSpalleTessuto,
    },
    { frazione: proporzioni.frazioneTorace, raggio: proporzioni.raggioTorace },
    { frazione: proporzioni.frazioneBusto, raggio: proporzioni.raggioBusto },
    {
      frazione: proporzioni.frazioneVita,
      raggio: proporzioni.raggioVitaReale ?? proporzioni.raggioVita,
    },
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
      raggio: proporzioni.raggioCavigliaReale ?? proporzioni.raggioCaviglia,
    },
    {
      frazione: 0,
      raggio: proporzioni.raggioCavigliaReale ?? proporzioni.raggioCaviglia,
    },
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
