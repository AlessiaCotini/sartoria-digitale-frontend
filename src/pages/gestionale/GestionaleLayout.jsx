import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RUOLI_AMMESSI = ["SARTA", "SOTTOPOSTO", "SUPER_ADMIN"];

function GestionaleLayout() {
  const utente = useSelector((state) => state.auth.utente);

  if (!utente || !RUOLI_AMMESSI.includes(utente.ruolo)) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <div className="section-title-eyebrow">Gestionale</div>
          <h2>Bellariva — area sartoria</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="filter-group justify-content-start mb-4">
          <NavLink
            to="/gestionale/calendario"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Calendario
          </NavLink>
          <NavLink
            to="/gestionale/ordini"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Ordini
          </NavLink>
          <NavLink
            to="/gestionale/nuovo-ordine"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Nuovo ordine
          </NavLink>
          <NavLink
            to="/gestionale/preventivi"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Preventivi
          </NavLink>
          <NavLink
            to="/gestionale/pagamenti"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Pagamenti
          </NavLink>
        </div>

        <Outlet />
      </div>
    </section>
  );
}

export default GestionaleLayout;
