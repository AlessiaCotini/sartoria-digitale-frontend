import { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getAppuntamentiTutti,
  creaAppuntamentoNegozio,
  modificaAppuntamento,
} from "../../api/appuntamenti";
import { cercaClienti } from "../../api/utenti";

dayjs.locale("it");
const localizer = dayjsLocalizer(dayjs);

function NuovoAppuntamentoModal({ slot, onChiudi, onCreato }) {
  const [tipoCliente, setTipoCliente] = useState("registrato");
  const [ricerca, setRicerca] = useState("");
  const [risultati, setRisultati] = useState([]);
  const [clienteSelezionato, setClienteSelezionato] = useState(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [cognomeCliente, setCognomeCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [data, setData] = useState(dayjs(slot.start).format("YYYY-MM-DD"));
  const [oraInizio, setOraInizio] = useState(dayjs(slot.start).format("HH:mm"));
  const [oraFine, setOraFine] = useState(dayjs(slot.end).format("HH:mm"));
  const [note, setNote] = useState("");
  const [errore, setErrore] = useState("");

  useEffect(() => {
    let attivo = true;

    const promessa =
      tipoCliente === "registrato" && ricerca.length >= 2
        ? cercaClienti(ricerca)
        : Promise.resolve([]);

    promessa.then((trovati) => {
      if (attivo) setRisultati(trovati);
    });

    return () => {
      attivo = false;
    };
  }, [ricerca, tipoCliente]);

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");

    const dati = {
      dataOra: dayjs(`${data}T${oraInizio}`).format("YYYY-MM-DDTHH:mm:ss"),
      dataOraFine: dayjs(`${data}T${oraFine}`).format("YYYY-MM-DDTHH:mm:ss"),
      note,
    };

    if (tipoCliente === "registrato") {
      if (!clienteSelezionato) {
        setErrore("Seleziona un cliente registrato.");
        return;
      }
      dati.clienteId = clienteSelezionato.id;
    } else {
      if (!nomeCliente || !cognomeCliente || !telefonoCliente) {
        setErrore("Compila nome, cognome e telefono del cliente.");
        return;
      }
      dati.nomeClienteNuovo = nomeCliente;
      dati.cognomeClienteNuovo = cognomeCliente;
      dati.telefonoClienteNuovo = telefonoCliente;
    }

    creaAppuntamentoNegozio(dati)
      .then(() => {
        onCreato();
        onChiudi();
      })
      .catch((err) =>
        setErrore(err.response?.data?.errore || "Errore nella creazione."),
      );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        className="form-sartoria"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <h5 className="mb-3">Nuovo appuntamento</h5>
        <div className="row g-2 mb-3">
          <div className="col-12">
            <label className="form-label">Data</label>
            <input
              type="date"
              className="form-control"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label">Ora inizio</label>
            <input
              type="time"
              className="form-control"
              value={oraInizio}
              onChange={(e) => setOraInizio(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label">Ora fine</label>
            <input
              type="time"
              className="form-control"
              value={oraFine}
              onChange={(e) => setOraFine(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="filter-group">
            <button
              type="button"
              className={`filter-tab ${tipoCliente === "registrato" ? "active" : ""}`}
              onClick={() => setTipoCliente("registrato")}
            >
              Cliente registrato
            </button>
            <button
              type="button"
              className={`filter-tab ${tipoCliente === "negozio" ? "active" : ""}`}
              onClick={() => setTipoCliente("negozio")}
            >
              Cliente di negozio
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {tipoCliente === "registrato" ? (
            <div className="mb-3">
              <label className="form-label">Cerca cliente</label>
              <input
                type="text"
                className="form-control"
                value={ricerca}
                onChange={(e) => setRicerca(e.target.value)}
                placeholder="Nome, cognome o email"
              />
              {risultati.length > 0 && (
                <ul className="list-group mt-2">
                  {risultati.map((c) => (
                    <li
                      key={c.id}
                      className={`list-group-item ${clienteSelezionato?.id === c.id ? "active" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setClienteSelezionato(c)}
                    >
                      {c.nome} {c.cognome} — {c.email}
                    </li>
                  ))}
                </ul>
              )}
              {clienteSelezionato && (
                <p className="text-muted small mt-2 mb-0">
                  Selezionato: {clienteSelezionato.nome}{" "}
                  {clienteSelezionato.cognome}
                </p>
              )}
            </div>
          ) : (
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label">Cognome</label>
                <input
                  type="text"
                  className="form-control"
                  value={cognomeCliente}
                  onChange={(e) => setCognomeCliente(e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Telefono</label>
                <input
                  type="tel"
                  className="form-control"
                  value={telefonoCliente}
                  onChange={(e) => setTelefonoCliente(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Note</label>
            <textarea
              className="form-control"
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          {errore && <p className="text-danger small">{errore}</p>}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-gold flex-grow-1">
              Crea appuntamento
            </button>
            <button
              type="button"
              className="btn btn-outline-dark-luxury"
              onClick={onChiudi}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATI_APPUNTAMENTO = [
  "RICHIESTO",
  "CONFERMATO",
  "COMPLETATO",
  "ANNULLATO",
];

function ModificaAppuntamentoModal({ appuntamento, onChiudi, onModificato }) {
  const [data, setData] = useState(
    dayjs(appuntamento.dataOra).format("YYYY-MM-DD"),
  );
  const [oraInizio, setOraInizio] = useState(
    dayjs(appuntamento.dataOra).format("HH:mm"),
  );
  const [oraFine, setOraFine] = useState(
    dayjs(appuntamento.dataOraFine).format("HH:mm"),
  );
  const [stato, setStato] = useState(appuntamento.stato);
  const [note, setNote] = useState(appuntamento.note || "");
  const [errore, setErrore] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErrore("");

    const dati = {
      dataOra: dayjs(`${data}T${oraInizio}`).format("YYYY-MM-DDTHH:mm:ss"),
      dataOraFine: dayjs(`${data}T${oraFine}`).format("YYYY-MM-DDTHH:mm:ss"),
      stato,
      note,
    };

    modificaAppuntamento(appuntamento.id, dati)
      .then(() => {
        onModificato();
        onChiudi();
      })
      .catch((err) =>
        setErrore(err.response?.data?.errore || "Errore nella modifica."),
      );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        className="form-sartoria"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <h5 className="mb-3">Modifica appuntamento</h5>
        <p className="text-muted small mb-3">{appuntamento.nomeCliente}</p>

        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-3">
            <div className="col-12">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-control"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label">Ora inizio</label>
              <input
                type="time"
                className="form-control"
                value={oraInizio}
                onChange={(e) => setOraInizio(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label">Ora fine</label>
              <input
                type="time"
                className="form-control"
                value={oraFine}
                onChange={(e) => setOraFine(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Stato</label>
            <select
              className="form-select"
              value={stato}
              onChange={(e) => setStato(e.target.value)}
            >
              {STATI_APPUNTAMENTO.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Note</label>
            <textarea
              className="form-control"
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          {errore && <p className="text-danger small">{errore}</p>}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-gold flex-grow-1">
              Salva modifiche
            </button>
            <button
              type="button"
              className="btn btn-outline-dark-luxury"
              onClick={onChiudi}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Calendario() {
  const [eventi, setEventi] = useState([]);
  const [slotSelezionato, setSlotSelezionato] = useState(null);
  const [appuntamentoInModifica, setAppuntamentoInModifica] = useState(null);

  function ricarica() {
    return getAppuntamentiTutti().then((appuntamenti) => {
      setEventi(
        appuntamenti.map((a) => ({
          id: a.id,
          title: `${a.nomeCliente} — ${a.stato}`,
          start: new Date(a.dataOra),
          end: new Date(a.dataOraFine),
          resource: a,
        })),
      );
    });
  }

  useEffect(() => {
    ricarica();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectSlot(slot) {
    setSlotSelezionato(slot);
  }

  function handleSelectEvent(evento) {
    setAppuntamentoInModifica(evento.resource);
  }

  return (
    <div style={{ height: "650px" }}>
      <Calendar
        localizer={localizer}
        events={eventi}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        messages={{
          month: "Mese",
          week: "Settimana",
          day: "Giorno",
          today: "Oggi",
          previous: "Indietro",
          next: "Avanti",
          agenda: "Agenda",
          date: "Data",
          time: "Ora",
          event: "Evento",
          noEventsInRange: "Nessun appuntamento in questo periodo.",
        }}
      />

      {slotSelezionato && (
        <NuovoAppuntamentoModal
          slot={slotSelezionato}
          onChiudi={() => setSlotSelezionato(null)}
          onCreato={ricarica}
        />
      )}

      {appuntamentoInModifica && (
        <ModificaAppuntamentoModal
          appuntamento={appuntamentoInModifica}
          onChiudi={() => setAppuntamentoInModifica(null)}
          onModificato={ricarica}
        />
      )}
    </div>
  );
}

export default Calendario;
