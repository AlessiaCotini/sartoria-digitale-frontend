const MAPPA_MODELLI = {
  Coppola: "coppola",
  Fedora: "fedora",
  Cloche: "cloche",
  "Tesa larga": "tesa-larga",
  "Stringate classiche": "stringate-classiche",
  Mocassino: "mocassino",
  Sneaker: "sneaker",
  Decollete: "decollete",
  Ballerina: "ballerina",
  Stivaletto: "stivaletto",
  Tote: "tote",
  Clutch: "clutch",
  Marsupio: "marsupio",
  Pochette: "pochette",
};

export function percorsoAccessorio(tipo, genere, modello) {
  let slug = MAPPA_MODELLI[modello];
  if (modello === "Tracolla") {
    slug = genere === "Uomo" ? "tracolla-uomo" : "tracolla-donna";
  }
  if (!slug) slug = "generico";
  return `/sketches-accessori/${slug}.svg`;
}
