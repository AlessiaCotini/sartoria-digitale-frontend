import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Nessun backend collegato ancora: per ora consideriamo valido
    // qualsiasi email/password e salviamo solo l'email in Redux.
    dispatch(login({ email }));
    navigate("/profilo");
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
