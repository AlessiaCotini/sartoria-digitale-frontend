import { useEffect, useState } from "react";

function temaIniziale() {
  const salvato = localStorage.getItem("tema");
  if (salvato === "chiaro" || salvato === "scuro") return salvato;
  const preferisceScuro = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  return preferisceScuro ? "scuro" : "chiaro";
}

export function useTema() {
  const [tema, setTema] = useState(temaIniziale);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      tema === "scuro" ? "dark" : "light",
    );
    localStorage.setItem("tema", tema);
  }, [tema]);

  function alterna() {
    setTema((t) => (t === "scuro" ? "chiaro" : "scuro"));
  }

  return { tema, alterna };
}
