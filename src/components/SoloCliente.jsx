import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RUOLI_GESTIONALE = ["SARTA", "SOTTOPOSTO", "SUPER_ADMIN"];

function SoloCliente({ children }) {
  const utente = useSelector((state) => state.auth.utente);
  const ruoloGestionale = utente && RUOLI_GESTIONALE.includes(utente.ruolo);

  if (ruoloGestionale) {
    return <Navigate to="/gestionale" replace />;
  }

  return children;
}

export default SoloCliente;
