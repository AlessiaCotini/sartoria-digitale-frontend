export function percorsoSagoma(categoria, genere) {
  const cartella = genere === "Uomo" ? "uomo" : "donna";
  const mappa = {
    Camicie: "top-maniche-lunghe",
    Magliette: "top-maniche-corte",
    Abiti: "abito",
    Gonne: "gonna",
    Pantaloni: "pantaloni",
  };
  const base = mappa[categoria] || "top-maniche-lunghe";
  return `/sketches/${base}-${cartella}.svg`;
}
