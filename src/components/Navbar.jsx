import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function NavbarSartoria() {
  return (
    <BsNavbar expand="lg" className="navbar-sartoria" variant="dark">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <span className="monogram">SB</span>Sartoria<span>Bellariva</span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="mx-auto">
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
          <div className="d-flex gap-2">
            <Button as={Link} to="/login" className="btn-outline-cream btn-sm">
              Accedi
            </Button>
            <Button as={Link} to="/register" className="btn-gold btn-sm">
              Registrati
            </Button>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default NavbarSartoria;
