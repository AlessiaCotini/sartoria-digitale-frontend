import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

function FooterSartoria() {
  return (
    <footer className="footer-sartoria">
      <div className="container">
        <div className="row g-4">
          <div className="col-sm-6 col-md-3">
            <div className="brand-font text-white h5">
              Alta Sartoria
              <span style={{ color: "var(--color-gold)" }}>Digitale</span>
            </div>
            <p className="small mb-0">
              Sartoria di alta gamma, esperienza interamente digitale.
            </p>
          </div>

          <div className="col-sm-6 col-md-3">
            <h6 className="text-white-50 text-uppercase small mb-3">
              Navigazione
            </h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/catalogo">Catalogo</Link>
              </li>
              <li className="mb-2">
                <Link to="/configuratore">Configuratore</Link>
              </li>
              <li className="mb-2">
                <Link to="/profilo">Profilo &amp; Misure</Link>
              </li>
            </ul>
          </div>

          <div className="col-sm-6 col-md-3">
            <h6 className="text-white-50 text-uppercase small mb-3">Account</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/login">Accedi</Link>
              </li>
              <li className="mb-2">
                <Link to="/register">Registrati</Link>
              </li>
            </ul>
          </div>

          <div className="col-sm-6 col-md-3">
            <h6 className="text-white-50 text-uppercase small mb-3">
              Contatti
            </h6>
            <div className="footer-contact-item">
              <FiMapPin size={16} />
              <span>Via Del Corso, 12 — Roma</span>
            </div>
            <div className="footer-contact-item">
              <FiPhone size={16} />
              <span>+39 06 1234 5678</span>
            </div>
            <div className="footer-contact-item">
              <FiMail size={16} />
              <span>info@sartoriabellavia.it</span>
            </div>
            <div className="social-icons mt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <p className="small mb-0 text-center">
          Sartoria Bellariva — progetto in sviluppo.
        </p>
      </div>
    </footer>
  );
}

export default FooterSartoria;
