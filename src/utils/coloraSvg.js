export function coloraSvg(testoSvg, coloreHex) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(testoSvg, "image/svg+xml");

  const percorsi = doc.querySelectorAll("path");
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  percorsi.forEach((percorso) => {
    const d = percorso.getAttribute("d") || "";
    const eChiuso = d.trim().toLowerCase().endsWith("z");
    if (eChiuso) {
      percorso.setAttribute("fill", coloreHex);

      // usiamo solo i percorsi chiusi (corpo/maniche) per calcolare
      // l'ingombro reale del capo, ignorando il margine vuoto che
      // nell'illustrazione originale lasciava posto alla testa
      const numeri = d.match(/-?\d+(\.\d+)?/g);
      if (numeri) {
        for (let i = 0; i < numeri.length - 1; i += 2) {
          const x = parseFloat(numeri[i]);
          const y = parseFloat(numeri[i + 1]);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  });

  const radice = doc.querySelector("svg");

  if (Number.isFinite(minX) && Number.isFinite(maxX)) {
    const margine = 4;
    const larghezza = maxX - minX + margine * 2;
    const altezza = maxY - minY + margine * 2;
    radice.setAttribute(
      "viewBox",
      `${minX - margine} ${minY - margine} ${larghezza} ${altezza}`,
    );
    radice.setAttribute("width", larghezza);
    radice.setAttribute("height", altezza);
  }

  const serializzatore = new XMLSerializer();
  const svgColorato = serializzatore.serializeToString(doc);

  const viewBoxFinale = radice.getAttribute("viewBox") || "0 0 160 260";
  const [, , larghezzaFinale, altezzaFinale] = viewBoxFinale
    .split(" ")
    .map(Number);
  const aspetto = larghezzaFinale / altezzaFinale;

  return { svgColorato, aspetto };
}
