import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!name || !email || !password || !confirmPassword) {
      return "Completa todos los campos.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Ingresa un correo electrónico válido.";
    }
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login", { state: { success: "Cuenta creada exitosamente. Inicia sesión." } });
    } catch (err) {
      setError(err.response?.data?.msg || "Error en el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>
        <p className="auth-subtitle">Regístrate para administrar el sitio</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
            />
          </div>

          <button type="submit" className="btn-auth mb-3" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center mb-0" style={{ fontSize: "0.9rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="auth-link">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
