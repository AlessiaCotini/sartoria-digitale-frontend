function ModaleSuccesso({ titolo, messaggio, testoBottone, onChiudi }) {
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
        className="form-sartoria text-center"
        style={{ maxWidth: "380px", width: "100%" }}
      >
        <h5 className="mb-2">{titolo}</h5>
        <p className="text-muted small mb-4">{messaggio}</p>
        <button type="button" className="btn btn-gold w-100" onClick={onChiudi}>
          {testoBottone}
        </button>
      </div>
    </div>
  );
}

export default ModaleSuccesso;
