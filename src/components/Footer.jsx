import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer-sartoria">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="brand-font h5">Bellariva</div>
            <p className="small mb-0">{t("footer.tagline")}</p>
          </div>

          <div className="col-md-3">
            <h6 className="text-uppercase small mb-3">
              {t("footer.navigazione")}
            </h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/catalogo">{t("nav.collezione")}</Link>
              </li>
              <li className="mb-2">
                <Link to="/configuratore">{t("nav.costruzione")}</Link>
              </li>
              <li className="mb-2">
                <Link to="/profilo">{t("nav.profilo")}</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="text-uppercase small mb-3">{t("footer.account")}</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/login">{t("nav.accedi")}</Link>
              </li>
              <li className="mb-2">
                <Link to="/register">{t("nav.registrati")}</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="text-uppercase small mb-3">
              {t("footer.contatti")}
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
              <span>info@bellariva.it</span>
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

        <hr style={{ borderColor: "var(--color-line)" }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="small mb-0">{t("footer.footerNote")}</p>
          <div className="small d-flex gap-3">
            <Link to="/faq">{t("footer.faq")}</Link>
            <Link to="/privacy">{t("footer.privacy")}</Link>
            <Link to="/termini">{t("footer.termini")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
