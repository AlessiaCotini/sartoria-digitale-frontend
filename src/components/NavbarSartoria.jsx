import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import BadgeMessaggi from "./BadgeMessaggi";

const RUOLI_GESTIONALE = ["SARTA", "SOTTOPOSTO", "SUPER_ADMIN"];

function NavbarSartoria() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const utente = useSelector((state) => state.auth.utente);
  const ruoloGestionale = utente && RUOLI_GESTIONALE.includes(utente.ruolo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
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
                  Gestionale
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/catalogo">
                    Collezione
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/configuratore">
                    Costruzione
                  </Nav.Link>
                  {isLoggedIn && (
                    <>
                      <Nav.Link as={NavLink} to="/preventivo">
                        Preventivi
                        <BadgeMessaggi />
                      </Nav.Link>
                      <Nav.Link as={NavLink} to="/profilo">
                        Profilo &amp; Misure
                      </Nav.Link>
                    </>
                  )}
                </>
              )}
            </Nav>
            <div className="d-flex flex-column flex-lg-row gap-2 mt-4 mt-lg-0">
              {isLoggedIn ? (
                <Button
                  type="button"
                  className="btn-outline-cream btn-sm"
                  onClick={handleLogout}
                >
                  Esci
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    className="btn-outline-cream btn-sm"
                  >
                    Accedi
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    className="btn-outline-cream btn-sm"
                  >
                    Registrati
                  </Button>
                </>
              )}
            </div>
          </Offcanvas.Body>
        </BsNavbar.Offcanvas>
      </Container>
    </BsNavbar>
  );
}

export default NavbarSartoria;
