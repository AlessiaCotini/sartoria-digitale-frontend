export function coloraSvg(testoSvg, coloreHex) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(testoSvg, "image/svg+xml");

  // coloriamo solo i path "chiusi" (che finiscono con Z): sono sempre
  // corpo/maniche del capo, mai baveri, bottoni o cuciture
  const percorsi = doc.querySelectorAll("path");
  percorsi.forEach((percorso) => {
    const d = percorso.getAttribute("d") || "";
    const eChiuso = d.trim().toLowerCase().endsWith("z");
    if (eChiuso) {
      percorso.setAttribute("fill", coloreHex);
    }
  });

  const radice = doc.querySelector("svg");
  const viewBox = radice.getAttribute("viewBox") || "0 0 160 260";
  const [, , larghezza, altezza] = viewBox.split(" ").map(Number);
  const aspetto = larghezza / altezza;

  radice.setAttribute("width", larghezza);
  radice.setAttribute("height", altezza);

  const serializzatore = new XMLSerializer();
  const svgColorato = serializzatore.serializeToString(doc);

  return { svgColorato, aspetto };
}
