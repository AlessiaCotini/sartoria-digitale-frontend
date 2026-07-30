import ChatOrdine from "./ChatOrdine";

function ChatModal({ ordine, onChiudi }) {
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
        style={{ maxWidth: "520px", width: "100%" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            Chat — {ordine.nomeCliente} ({ordine.capoNome})
          </h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark-luxury"
            onClick={onChiudi}
          >
            Chiudi
          </button>
        </div>
        <ChatOrdine ordine={ordine} key={ordine.id} />
      </div>
    </div>
  );
}

export default ChatModal;
