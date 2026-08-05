// src/pages/TerminiCondizioni.jsx
function TerminiCondizioni() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="mb-4">
          <div className="section-title-eyebrow">Legale</div>
          <h2>Termini e condizioni</h2>
          <p className="text-muted small">Ultimo aggiornamento: da definire</p>
          <div className="divider-gold"></div>
        </div>
        <div className="text-muted" style={{ lineHeight: 1.8 }}>
          <h5>1. Oggetto</h5>
          <p>
            I presenti termini regolano l'utilizzo del sito Bellariva e
            l'acquisto di capi di sartoria su misura configurati attraverso il
            Configuratore online.
          </p>
          <h5 className="mt-4">2. Ordini e preventivi</h5>
          <p>
            Ogni configurazione inviata tramite il sito costituisce una
            richiesta di preventivo, non un ordine vincolante. L'ordine si
            considera confermato solo dopo l'accettazione esplicita del
            preventivo da parte del cliente e il versamento dell'acconto
            richiesto.
          </p>
          <h5 className="mt-4">3. Prezzi e pagamenti</h5>
          <p>
            I prezzi indicati nel Configuratore sono a partire da ("da €") e
            possono variare in base a tessuto, opzioni scelte e misure. Il
            totale definitivo viene comunicato nel preventivo. È richiesto un
            acconto alla conferma; il saldo è dovuto secondo quanto concordato
            con la sartoria.
          </p>
          <h5 className="mt-4">4. Recesso</h5>
          <p>
            Trattandosi di beni confezionati su misura secondo le specifiche del
            consumatore, il diritto di recesso previsto per gli acquisti online
            non si applica una volta avviata la lavorazione, ai sensi dell'art.
            59 del Codice del Consumo.
          </p>
          <h5 className="mt-4">5. Responsabilità</h5>
          <p>
            Bellariva si impegna a realizzare i capi secondo le misure e le
            opzioni concordate. Eventuali difformità vanno segnalate entro 14
            giorni dalla consegna tramite la chat dell'ordine o ai contatti
            indicati in fondo al sito.
          </p>
          <h5 className="mt-4">6. Legge applicabile</h5>
          <p>
            I presenti termini sono regolati dalla legge italiana. Per ogni
            controversia è competente il foro del consumatore.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TerminiCondizioni;
