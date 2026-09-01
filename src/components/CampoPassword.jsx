import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function CampoPassword({ id, value, onChange, required = true }) {
  const [visibile, setVisibile] = useState(false);

  return (
    <div className="input-group">
      <input
        type={visibile ? "text" : "password"}
        className="form-control"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setVisibile((v) => !v)}
        tabIndex={-1}
        aria-label={visibile ? "Nascondi password" : "Mostra password"}
      >
        {visibile ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default CampoPassword;
