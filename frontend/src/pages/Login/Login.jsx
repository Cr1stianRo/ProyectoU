import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const successMsg = location.state?.success || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login(user, token);

      const lastRoute = user.preferences?.lastVisitedRoute || "/admin";
      navigate(lastRoute, { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        <p className="auth-subtitle">Accede al panel de administración</p>

        {successMsg && <div className="auth-success">{successMsg}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-auth mb-3" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center mb-0" style={{ fontSize: "0.9rem" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="auth-link">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
