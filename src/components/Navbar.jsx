import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function NavbarSartoria() {
  return (
    <BsNavbar expand="lg" className="navbar-sartoria" variant="dark">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <span className="monogram">SB</span>Sartoria
          <span>Bellariva</span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="offcanvasNavbar" />
        <BsNavbar.Offcanvas
          id="offcanvasNavbar"
          placement="end"
          className="offcanvas-sartoria"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title className="brand-font text-white">
              <span className="monogram">SD</span> Alta Sartoria
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column flex-lg-row align-items-lg-center">
            <Nav className="flex-column flex-lg-row mx-lg-auto gap-2 gap-lg-0">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/catalogo">
                Catalogo
              </Nav.Link>
              <Nav.Link as={NavLink} to="/configuratore">
                Crea
              </Nav.Link>
              <Nav.Link as={NavLink} to="/profilo">
                Profilo &amp; Misure
              </Nav.Link>
            </Nav>
            <div className="d-flex flex-column flex-lg-row gap-2 mt-4 mt-lg-0">
              <Button
                as={Link}
                to="/login"
                className="btn-outline-cream btn-sm"
              >
                Accedi
              </Button>
              <Button as={Link} to="/register" className="btn-gold btn-sm">
                Registrati
              </Button>
            </div>
          </Offcanvas.Body>
        </BsNavbar.Offcanvas>
      </Container>
    </BsNavbar>
  );
}

export default NavbarSartoria;
