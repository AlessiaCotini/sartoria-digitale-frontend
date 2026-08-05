import { useEffect, useRef } from "react";
import { coloraSvg } from "../utils/coloraSvg";

function disegnaFantasia(ctx, canvas, fantasia) {
  if (fantasia === "Righe") {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.strokeStyle = "rgba(30,25,20,0.28)";
    ctx.lineWidth = canvas.width * 0.018;
    for (let x = -canvas.height; x < canvas.width; x += canvas.width * 0.07) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + canvas.height, canvas.height);
      ctx.stroke();
    }
    ctx.restore();
  } else if (fantasia === "Pois") {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "#665b45";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const passo = canvas.width * 0.1;
    for (let y = canvas.height * 0.08; y < canvas.height * 0.92; y += passo) {
      const riga = Math.round(y / passo);
      const offset = (riga % 2) * (passo / 2);
      for (
        let x = canvas.width * 0.08 + offset;
        x < canvas.width * 0.92;
        x += passo
      ) {
        ctx.beginPath();
        ctx.arc(x, y, canvas.width * 0.018, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (fantasia === "Floreale") {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "#988a6d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const passo = canvas.width * 0.16;
    for (let y = canvas.height * 0.1; y < canvas.height * 0.9; y += passo) {
      for (let x = canvas.width * 0.14; x < canvas.width * 0.86; x += passo) {
        for (let p = 0; p < 5; p++) {
          const angolo = (p / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angolo) * canvas.width * 0.016,
            y + Math.sin(angolo) * canvas.width * 0.016,
            canvas.width * 0.01,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
}

function AnteprimaAccessorio({ percorsoSvg, coloreHex, fantasia }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!percorsoSvg || !canvasRef.current) return;
    let annullato = false;

    fetch(percorsoSvg)
      .then((r) => r.text())
      .then((testoSvg) => {
        if (annullato) return;
        const { svgColorato } = coloraSvg(testoSvg, coloreHex);
        const immagine = new Image();
        immagine.onload = () => {
          if (annullato || !canvasRef.current) return;
          const canvas = canvasRef.current;
          canvas.width = 800;
          canvas.height = 800;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const scala = Math.min(
            (canvas.width * 0.8) / immagine.width,
            (canvas.height * 0.8) / immagine.height,
          );
          const larghezza = immagine.width * scala;
          const altezza = immagine.height * scala;
          const x = (canvas.width - larghezza) / 2;
          const y = (canvas.height - altezza) / 2;

          ctx.drawImage(immagine, x, y, larghezza, altezza);
          disegnaFantasia(ctx, canvas, fantasia);
        };
        immagine.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgColorato);
      })
      .catch((errore) =>
        console.error("Errore nel caricare l'accessorio:", errore),
      );

    return () => {
      annullato = true;
    };
  }, [percorsoSvg, coloreHex, fantasia]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "480px", display: "block" }}
    />
  );
}

export default AnteprimaAccessorio;
