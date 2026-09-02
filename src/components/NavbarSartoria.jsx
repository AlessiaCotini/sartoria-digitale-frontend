import { useState } from "react";
import {
  Navbar as BsNavbar,
  Nav,
  NavDropdown,
  Container,
  Button,
  Offcanvas,
  Form,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiSun, FiMoon } from "react-icons/fi";
import { logout } from "../store/authSlice";
import { useTema } from "../hooks/useTema";
import BadgeMessaggi from "./BadgeMessaggi";

const RUOLI_GESTIONALE = ["SARTA", "SOTTOPOSTO", "SUPER_ADMIN"];

function NavbarSartoria() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const utente = useSelector((state) => state.auth.utente);
  const ruoloGestionale = utente && RUOLI_GESTIONALE.includes(utente.ruolo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { t, i18n } = useTranslation();
  const { tema, alterna } = useTema();
  const [expanded, setExpanded] = useState(false);

  function handleLogout() {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleCerca(e) {
    e.preventDefault();
    const testo = query.trim();
    if (!testo) return;
    navigate(`/ricerca?q=${encodeURIComponent(testo)}`);
  }

  function cambiaLingua(lingua) {
    i18n.changeLanguage(lingua);
    localStorage.setItem("lingua", lingua);
  }

  return (
    <BsNavbar
      expand="lg"
      className="navbar-sartoria"
      variant="light"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <BsNavbar.Brand
          as={Link}
          to={ruoloGestionale ? "/gestionale" : "/"}
          className="d-flex align-items-center gap-2"
        >
          <span className="monogram">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <ellipse
                cx="60"
                cy="30"
                rx="3.5"
                ry="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <path
                d="M60,37 L60,55 M60,61 L60,76 M60,82 L60,94 M54,94 L60,104 L66,94"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25,45 Q50,50 62,58 Q95,60 92,66 Q80,74 60,79 Q35,84 30,95 Q26,100 34,98"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Bellariva
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="offcanvasNavbar" />
        <BsNavbar.Offcanvas
          id="offcanvasNavbar"
          placement="end"
          className="offcanvas-sartoria"
          onHide={() => setExpanded(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="brand-font">Bellariva</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column flex-lg-row align-items-lg-center">
            <Nav className="flex-column flex-lg-row mx-lg-auto gap-2 gap-lg-0 offcanvas-nav">
              {ruoloGestionale ? (
                <Nav.Link
                  as={NavLink}
                  to="/gestionale"
                  onClick={() => setExpanded(false)}
                >
                  {t("nav.gestionale")}
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    end
                    onClick={() => setExpanded(false)}
                  >
                    {t("nav.home")}
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/catalogo"
                    onClick={() => setExpanded(false)}
                  >
                    {t("nav.collezione")}
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/accessori"
                    onClick={() => setExpanded(false)}
                  >
                    {t("nav.accessori")}
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/configuratore"
                    onClick={() => setExpanded(false)}
                  >
                    {t("nav.costruzione")}
                  </Nav.Link>
                  {isLoggedIn && (
                    <>
                      <Nav.Link
                        as={NavLink}
                        to="/preventivo"
                        onClick={() => setExpanded(false)}
                      >
                        {t("nav.preventivi")}
                        <BadgeMessaggi />
                      </Nav.Link>
                      <Nav.Link
                        as={NavLink}
                        to="/profilo"
                        onClick={() => setExpanded(false)}
                      >
                        {t("nav.profilo")}
                      </Nav.Link>
                    </>
                  )}
                </>
              )}
            </Nav>
            {!ruoloGestionale && (
              <Form
                className="d-flex mt-3 mt-lg-0 mx-lg-3 offcanvas-search"
                onSubmit={handleCerca}
              >
                <Form.Control
                  type="search"
                  placeholder={t("nav.cercaPlaceholder")}
                  size="sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ minWidth: "200px" }}
                />
              </Form>
            )}
            <div className="d-none d-lg-flex align-items-center gap-2">
              <NavDropdown
                title="Impostazioni"
                id="dropdown-impostazioni"
                align="end"
              >
                <div className="dropdown-impostazioni-corpo">
                  <p className="step-label mb-2">Lingua</p>
                  <div className="d-flex gap-3 mb-3">
                    <button
                      type="button"
                      className={`lingua-tab ${i18n.language === "it" ? "active" : ""}`}
                      onClick={() => cambiaLingua("it")}
                    >
                      IT
                    </button>
                    <button
                      type="button"
                      className={`lingua-tab ${i18n.language === "en" ? "active" : ""}`}
                      onClick={() => cambiaLingua("en")}
                    >
                      EN
                    </button>
                  </div>
                  <p className="step-label mb-2">Tema</p>
                  <button
                    type="button"
                    className="lingua-tab d-flex align-items-center gap-2"
                    onClick={alterna}
                  >
                    {tema === "scuro" ? (
                      <>
                        <FiSun /> Chiaro
                      </>
                    ) : (
                      <>
                        <FiMoon /> Scuro
                      </>
                    )}
                  </button>
                </div>
                {isLoggedIn && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      {t("nav.esci")}
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </div>

            <div className="d-lg-none w-100 mt-3 pt-3 offcanvas-settings">
              <p className="step-label mb-2 text-center ">Lingua</p>
              <div className="d-flex gap-2 mb-3 justify-content-center lingua-toggle">
                <button
                  type="button"
                  className={`lingua-tab ${i18n.language === "it" ? "active" : ""}`}
                  onClick={() => cambiaLingua("it")}
                >
                  IT
                </button>
                <button
                  type="button"
                  className={`lingua-tab ${i18n.language === "en" ? "active" : ""}`}
                  onClick={() => cambiaLingua("en")}
                >
                  EN
                </button>
              </div>
              <p className="step-label mb-2 text-center">Tema</p>
              <Button
                type="button"
                className="btn-outline-cream btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mb-2"
                onClick={alterna}
              >
                {tema === "scuro" ? (
                  <>
                    <FiSun /> Chiaro
                  </>
                ) : (
                  <>
                    <FiMoon /> Scuro
                  </>
                )}
              </Button>
              {isLoggedIn && (
                <Button
                  type="button"
                  className="btn-outline-cream btn-sm w-100"
                  onClick={() => {
                    handleLogout();
                    setExpanded(false);
                  }}
                >
                  {t("nav.esci")}
                </Button>
              )}
            </div>
            {!isLoggedIn && (
              <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0 ms-lg-2">
                <Button
                  as={Link}
                  to="/login"
                  className="btn-outline-cream btn-sm"
                  onClick={() => setExpanded(false)}
                >
                  {t("nav.accedi")}
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  className="btn-outline-cream btn-sm"
                  onClick={() => setExpanded(false)}
                >
                  {t("nav.registrati")}
                </Button>
              </div>
            )}
          </Offcanvas.Body>
        </BsNavbar.Offcanvas>
      </Container>
    </BsNavbar>
  );
}

export default NavbarSartoria;
