import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AvvisoAggiornamento({ testo }) {
  const { t } = useTranslation();
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "1rem",
      }}
    >
      <div
        className="text-center"
        style={{
          maxWidth: "440px",
          width: "100%",
          background: "#1c1a16",
          border: "2px solid #ffc107",
          borderRadius: "var(--radius)",
          padding: "2rem 1.5rem",
          boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
        }}
      >
        <h5
          className="mb-3"
          style={{
            color: "#ffc107",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {t("avviso.titolo")}
        </h5>
        <p className="mb-4" style={{ color: "#f2ede4" }}>
          {testo || t("avviso.testo")}
        </p>
        <Link to="/" className="btn btn-gold w-100">
          {t("avviso.tornaHome")}
        </Link>
      </div>
    </div>
  );
}

export default AvvisoAggiornamento;
