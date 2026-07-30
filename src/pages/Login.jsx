import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { loginRichiesta, utenteAttuale } from "../api/auth";
import { misureMie } from "../api/misure";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const capoId = useSelector((state) => state.configuratore.capoId);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore("");

    try {
      const { token } = await loginRichiesta(email, password);
      localStorage.setItem("token", token);
      const utente = await utenteAttuale();

      let misure = null;
      if (utente.ruolo === "CLIENTE") {
        misure = await misureMie();
      }

      dispatch(login({ utente, misure }));
      navigate(capoId ? "/configuratore" : "/profilo");
    } catch (err) {
      setErrore(err.response?.data?.errore || "Email o password errati.");
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "440px" }}>
        <div className="mb-4 text-center">
          <div className="section-title-eyebrow">Accedi</div>
          <h2>Bentornata in Bellariva</h2>
          <div className="divider-gold mx-auto"></div>
        </div>

        <form className="form-sartoria" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="loginEmail">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="loginPassword">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errore && <p className="text-danger small mb-3">{errore}</p>}

          <button type="submit" className="btn btn-gold w-100 mb-3">
            Accedi
          </button>

          <p className="text-center small text-muted mb-0">
            Non hai un account?{" "}
            <Link to="/register" style={{ color: "var(--color-accent)" }}>
              Registrati
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
