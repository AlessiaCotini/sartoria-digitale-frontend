export function percorsoSagoma(categoria, genere) {
  const cartella = genere === "Uomo" ? "uomo" : "donna";
  const mappa = {
    Camicie: "top-maniche-lunghe",
    Cardigan: "top-maniche-lunghe",
    Giacche: "top-maniche-lunghe",
    Completi: "top-maniche-lunghe",
    Abiti: "abito",
    Gonne: "gonna",
    Pantaloni: "pantaloni",
    Magliette: "top-maniche-corte",
  };
  const base = mappa[categoria] || "top-maniche-lunghe";
  return `/sketches/${base}-${cartella}.svg`;
}
