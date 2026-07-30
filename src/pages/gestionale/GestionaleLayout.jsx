import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BadgeMessaggi from "../../components/BadgeMessaggi";

const RUOLI_AMMESSI = ["SARTA", "SOTTOPOSTO", "SUPER_ADMIN"];

function GestionaleLayout() {
  const utente = useSelector((state) => state.auth.utente);

  if (!utente || !RUOLI_AMMESSI.includes(utente.ruolo)) {
    return <Navigate to="/" replace />;
  }

  const puoGestireCatalogoETeam =
    utente.ruolo === "SARTA" || utente.ruolo === "SUPER_ADMIN";

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
            <BadgeMessaggi ambito="ordini" />
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
            <BadgeMessaggi ambito="preventivi" />
          </NavLink>
          <NavLink
            to="/gestionale/pagamenti"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Pagamenti
          </NavLink>
          <NavLink
            to="/gestionale/magazzino"
            className={({ isActive }) =>
              `filter-tab ${isActive ? "active" : ""}`
            }
          >
            Magazzino
          </NavLink>
          {puoGestireCatalogoETeam && (
            <>
              <NavLink
                to="/gestionale/catalogo"
                className={({ isActive }) =>
                  `filter-tab ${isActive ? "active" : ""}`
                }
              >
                Catalogo
              </NavLink>
              <NavLink
                to="/gestionale/team"
                className={({ isActive }) =>
                  `filter-tab ${isActive ? "active" : ""}`
                }
              >
                Team
              </NavLink>
            </>
          )}
        </div>

        <Outlet />
      </div>
    </section>
  );
}

export default GestionaleLayout;
