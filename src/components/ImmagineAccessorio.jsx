import { useState } from "react";

function ImmagineAccessorio({ src, alt }) {
  const [errore, setErrore] = useState(false);

  if (errore) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted small text-center px-2">
        Anteprima non disponibile
      </div>
    );
  }

  return <img src={src} alt={alt} onError={() => setErrore(true)} />;
}

export default ImmagineAccessorio;
