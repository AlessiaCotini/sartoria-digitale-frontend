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
import { FiSettings, FiSun, FiMoon } from "react-icons/fi";
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
    <BsNavbar expand="lg" className="navbar-sartoria" variant="light">
      <Container>
        <BsNavbar.Brand as={Link} to={ruoloGestionale ? "/gestionale" : "/"}>
          Bellariva
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="offcanvasNavbar" />
        <BsNavbar.Offcanvas
          id="offcanvasNavbar"
          placement="end"
          className="offcanvas-sartoria"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="brand-font">Bellariva</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column flex-lg-row align-items-lg-center">
            <Nav className="flex-column flex-lg-row mx-lg-auto gap-2 gap-lg-0">
              {ruoloGestionale ? (
                <Nav.Link as={NavLink} to="/gestionale">
                  {t("nav.gestionale")}
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    {t("nav.home")}
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/catalogo">
                    {t("nav.collezione")}
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/accessori">
                    {t("nav.accessori")}
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/configuratore">
                    {t("nav.costruzione")}
                  </Nav.Link>
                  {isLoggedIn && (
                    <>
                      <Nav.Link as={NavLink} to="/preventivo">
                        {t("nav.preventivi")}
                        <BadgeMessaggi />
                      </Nav.Link>
                      <Nav.Link as={NavLink} to="/profilo">
                        {t("nav.profilo")}
                      </Nav.Link>
                    </>
                  )}
                </>
              )}
            </Nav>
            {!ruoloGestionale && (
              <Form
                className="d-flex mt-3 mt-lg-0 mx-lg-3"
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
            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              <NavDropdown
                title={<FiSettings size={18} />}
                id="dropdown-impostazioni"
                align="end"
                autoClose="outside"
              >
                <div className="px-3 py-2" style={{ minWidth: "180px" }}>
                  <p className="step-label mb-2">Lingua</p>
                  <div className="d-flex gap-2 mb-3">
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
                  <Button
                    type="button"
                    className="btn-outline-cream btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
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
            {!isLoggedIn && (
              <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0 ms-lg-2">
                <Button
                  as={Link}
                  to="/login"
                  className="btn-outline-cream btn-sm"
                >
                  {t("nav.accedi")}
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  className="btn-outline-cream btn-sm"
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
