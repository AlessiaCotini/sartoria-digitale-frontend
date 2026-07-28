export function fattoreScalaPerAltezza(frazione, proporzioni) {
  const { scalaSpalle, scalaTorace, scalaVita, scalaFianchi } = proporzioni;

  if (frazione > 0.8) return scalaSpalle;
  if (frazione > 0.6) {
    const t = (frazione - 0.6) / 0.2;
    return scalaTorace + (scalaSpalle - scalaTorace) * t;
  }
  if (frazione > 0.5) {
    const t = (frazione - 0.5) / 0.1;
    return scalaVita + (scalaTorace - scalaVita) * t;
  }
  if (frazione > 0.3) {
    const t = (frazione - 0.3) / 0.2;
    return scalaFianchi + (scalaVita - scalaFianchi) * t;
  }
  const t = Math.min(frazione / 0.3, 1);
  return 1 + (scalaFianchi - 1) * t;
}
