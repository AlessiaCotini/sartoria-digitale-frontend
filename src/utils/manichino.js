const RIFERIMENTO = {
  altezza: 170,
  spalle: 44,
  torace: 96,
  vita: 80,
  fianchi: 100,
};

const LARGHEZZA_RIFERIMENTO = {
  spalle: 70,
  torace: 64,
  vita: 50,
  fianchi: 66,
};

function numeroValido(valore, fallback) {
  const n = parseFloat(valore);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function limita(valore, min, max) {
  return Math.min(max, Math.max(min, valore));
}

export function calcolaProporzioni(misure) {
  const altezza = numeroValido(misure?.altezza, RIFERIMENTO.altezza);
  const spalle = numeroValido(misure?.spalle, RIFERIMENTO.spalle);
  const torace = numeroValido(misure?.torace, RIFERIMENTO.torace);
  const vita = numeroValido(misure?.vita, RIFERIMENTO.vita);
  const fianchi = numeroValido(misure?.fianchi, RIFERIMENTO.fianchi);

  // limitiamo le scale per evitare proporzioni assurde se qualcuno inserisce
  // un valore fuori scala o mancante
  const scalaAltezza = limita(altezza / RIFERIMENTO.altezza, 0.8, 1.3);
  const scalaSpalle = limita(spalle / RIFERIMENTO.spalle, 0.8, 1.3);
  const scalaTorace = limita(torace / RIFERIMENTO.torace, 0.8, 1.3);
  const scalaVita = limita(vita / RIFERIMENTO.vita, 0.8, 1.3);
  const scalaFianchi = limita(fianchi / RIFERIMENTO.fianchi, 0.8, 1.3);

  return {
    scalaAltezza,
    scalaSpalle,
    scalaTorace,
    scalaVita,
    scalaFianchi,
    larghezzaSpalle: LARGHEZZA_RIFERIMENTO.spalle * scalaSpalle,
    larghezzaTorace: LARGHEZZA_RIFERIMENTO.torace * scalaTorace,
    larghezzaVita: LARGHEZZA_RIFERIMENTO.vita * scalaVita,
    larghezzaFianchi: LARGHEZZA_RIFERIMENTO.fianchi * scalaFianchi,
  };
}
