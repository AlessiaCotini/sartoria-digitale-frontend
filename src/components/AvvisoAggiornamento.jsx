import { useTranslation } from "react-i18next";

function AvvisoAggiornamento() {
  const { t } = useTranslation();
  return (
    <div className="alert alert-warning text-center mb-4" role="alert">
      <strong className="step-label d-block mb-1">{t("avviso.titolo")}</strong>
      {t("avviso.testo")}
    </div>
  );
}

export default AvvisoAggiornamento;
