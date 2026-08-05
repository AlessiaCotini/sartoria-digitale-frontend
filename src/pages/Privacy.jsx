// src/pages/Privacy.jsx
function Privacy() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="mb-4">
          <div className="section-title-eyebrow">Legale</div>
          <h2>Informativa sulla privacy</h2>
          <p className="text-muted small">Ultimo aggiornamento: da definire</p>
          <div className="divider-gold"></div>
        </div>
        <div className="text-muted" style={{ lineHeight: 1.8 }}>
          <p>
            <strong>Titolare del trattamento.</strong> Bellariva, Via Del Corso
            12, Roma — info@bellariva.it. Questa informativa descrive come
            trattiamo i dati personali raccolti tramite il sito e il
            configuratore, ai sensi del Regolamento (UE) 2016/679 (GDPR).
          </p>
          <h5 className="mt-4">Dati raccolti</h5>
          <p>
            Dati account (nome, email, password cifrata), misure corporee
            inserite volontariamente per la configurazione dei capi, dati di
            contatto per appuntamenti e ordini, cronologia ordini e messaggi
            scambiati con la sartoria per la negoziazione dei preventivi.
          </p>
          <h5 className="mt-4">Finalità e base giuridica</h5>
          <p>
            Trattiamo i dati per: erogare il servizio richiesto (esecuzione di
            un contratto, art. 6.1.b GDPR); rispondere a richieste di
            assistenza; adempiere a obblighi fiscali/contabili (obbligo legale,
            art. 6.1.c). Le misure corporee sono trattate solo con il tuo
            consenso esplicito e possono essere modificate o cancellate in
            qualsiasi momento dal tuo Profilo.
          </p>
          <h5 className="mt-4">Conservazione</h5>
          <p>
            I dati sono conservati per il tempo necessario a fornire il servizio
            e per gli obblighi di legge applicabili (es. conservazione documenti
            fiscali).
          </p>
          <h5 className="mt-4">Diritti dell'interessato</h5>
          <p>
            Puoi richiedere in qualsiasi momento accesso, rettifica,
            cancellazione, limitazione del trattamento o portabilità dei tuoi
            dati, scrivendo a info@bellariva.it. Hai inoltre diritto di proporre
            reclamo al Garante per la protezione dei dati personali.
          </p>
          <h5 className="mt-4">Cookie</h5>
          <p>
            Il sito utilizza solo cookie tecnici necessari al funzionamento (es.
            sessione di accesso). Non utilizziamo cookie di profilazione di
            terze parti.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Privacy;
