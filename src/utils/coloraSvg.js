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
      const fillAttuale = percorso.getAttribute("fill") || "";
      if (!fillAttuale.startsWith("url(")) {
        percorso.setAttribute("fill", coloreHex);
      }

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

  // se il capo usa il gradiente condiviso "gradCapo", aggiorniamo le sue
  // tre tonalità invece di sovrascrivere il fill piatto: così la sfumatura
  // sopravvive al cambio colore scelto dal cliente
  const gradiente = doc.getElementById("gradCapo");
  if (gradiente) {
    const { chiaro, medio, scuro } = tonalita(coloreHex);
    const stops = gradiente.querySelectorAll("stop");
    if (stops[0]) stops[0].setAttribute("stop-color", chiaro);
    if (stops[1]) stops[1].setAttribute("stop-color", medio);
    if (stops[2]) stops[2].setAttribute("stop-color", scuro);
  }

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

function tonalita(hex) {
  const { r, g, b } = hexInRgb(hex);
  return {
    chiaro: rgbInHex(mescola(r, g, b, 0.55)),
    medio: hex,
    scuro: rgbInHex(mescola(r, g, b, -0.4)),
  };
}

function hexInRgb(hex) {
  const pulito = hex.replace("#", "");
  const bigint = parseInt(pulito, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbInHex({ r, g, b }) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")
  );
}

function mescola(r, g, b, quantita) {
  const verso = quantita > 0 ? 255 : 0;
  const q = Math.abs(quantita);
  return {
    r: r + (verso - r) * q,
    g: g + (verso - g) * q,
    b: b + (verso - b) * q,
  };
}
