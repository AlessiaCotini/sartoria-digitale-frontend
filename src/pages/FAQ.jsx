import { Accordion } from "react-bootstrap";

const DOMANDE = [
  {
    q: "Come funziona la sartoria su misura online?",
    a: "Scegli un capo dalla Collezione, personalizzi tessuto, colore e dettagli nel Configuratore usando le tue misure salvate nel Profilo, poi invii la richiesta: la sarta prepara un preventivo e lo discutete in chat prima di confermare.",
  },
  {
    q: "Come inserisco le mie misure?",
    a: "Nella pagina Profilo trovi il modulo misure: puoi compilarlo tu stessa con un metro da sarta, o prenotare un appuntamento in negozio per farle rilevare da noi.",
  },
  {
    q: "Posso modificare un ordine dopo averlo inviato?",
    a: "Finché l'ordine è in fase di preventivo/negoziazione puoi discutere modifiche direttamente in chat con la sarta. Dopo la conferma e l'accettazione, eventuali modifiche vanno concordate caso per caso.",
  },
  {
    q: "Quali sono i tempi di consegna?",
    a: "Variano in base al capo e al carico di lavoro della sartoria: la sarta te li comunica nel preventivo prima della conferma dell'ordine.",
  },
  {
    q: "Come funzionano acconto e saldo?",
    a: "Per confermare l'ordine è richiesto un acconto; il saldo viene richiesto alla consegna o al ritiro del capo, secondo quanto concordato nel preventivo.",
  },
  {
    q: "Posso prenotare un appuntamento in negozio?",
    a: "Sì, dal tuo profilo puoi richiedere un appuntamento; la sarta lo conferma con data e ora definitive.",
  },
];

function FAQ() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="mb-4">
          <div className="section-title-eyebrow">Assistenza</div>
          <h2>Domande frequenti</h2>
          <div className="divider-gold"></div>
        </div>
        <Accordion alwaysOpen={false}>
          {DOMANDE.map((d, i) => (
            <Accordion.Item eventKey={String(i)} key={i}>
              <Accordion.Header>{d.q}</Accordion.Header>
              <Accordion.Body className="text-muted">{d.a}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
