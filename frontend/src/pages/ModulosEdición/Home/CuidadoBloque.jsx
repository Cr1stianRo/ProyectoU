// Editor del módulo Cuidado Día.
// Configura ícono, colores, título, subtítulo y descripción del bloque de cuidado diurno.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const API_URL = "/home-config/cuidadod";

const initialForm = {
  iconClass: "",
  iconColor: "",
  title: "",
  titleColor: "",
  subtitle: "",
  description: "",
};

export default function CuidadoDiaConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const onSave = async () => {
    try {
      await api.put(API_URL, form);
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (e) {
      alert("No se pudo guardar ❌");
    }
  };

  useEffect(() => {
    api
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
    {showSuccess && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn .3s ease",
      }}>
        <div style={{
          background: "#fff", borderRadius: "1.5rem", padding: "2.5rem 3rem",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          animation: "scaleIn .4s ease",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: "#d4edda",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.2rem",
          }}>
            <i className="bi bi-check-lg" style={{ fontSize: "2.5rem", color: "#198754" }}></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: "#5b4636" }}>Guardado exitoso</h3>
          <p className="text-muted mb-0">Redirigiendo al panel de administración...</p>
        </div>
      </div>
    )}
    <style>{`
      @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes scaleIn { from { opacity:0; transform:scale(.8) } to { opacity:1; transform:scale(1) } }
    `}</style>
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0"><i className="bi bi-sunrise me-2"></i>CUIDADO DIA</h2>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <label className="form-label">Selecciona un ícono</label>
              <select
                className="form-select mb-3"
                value={form.iconClass || ""}
                onChange={(e) => setField("iconClass", e.target.value)}
              >
                <option value="">-- Seleccionar ícono --</option>
                <option value="bi bi-sunrise">☀️ Amanecer </option>
                <option value="bi bi-moon-stars">🌙 Luna y estrellas</option>
                <option value="bi bi-heart-pulse">💗 Corazón con pulso</option>
                <option value="bi bi-hospital">🏥 Hospital</option>
                <option value="bi bi-person-wheelchair">♿ Persona en silla de ruedas</option>
                <option value="bi bi-capsule">💊 Cápsula</option>
                <option value="bi bi-shield-check">🛡️ Escudo verificado</option>
                <option value="bi bi-house-heart">🏠 Casa con corazón</option>
                <option value="bi bi-calendar-heart">📅 Calendario corazón</option>
                <option value="bi bi-people">👥 Personas</option>
                <option value="bi bi-stars">⭐ Estrellas</option>
                <option value="bi bi-flower1">🌸 Flor</option>
                <option value="bi bi-tree">🌳 Árbol</option>
                <option value="bi bi-bandaid">🩹 Curita</option>
                <option value="bi bi-clipboard2-pulse">📋 Clipboard médico</option>
                <option value="bi bi-activity">📊 Actividad</option>
                <option value="bi bi-thermometer-half">🌡️ Termómetro</option>
                <option value="bi bi-chat-heart">💬 Chat corazón</option>
                <option value="bi bi-balloon-heart">🎈 Globo corazón</option>
                <option value="bi bi-suit-heart">❤️ Corazón</option>
              </select>
              
              {form.iconClass && (
                <div className="alert alert-light d-flex align-items-center gap-2 mb-3">
                  <i className={`${form.iconClass} fs-3`} style={{ color: form.iconColor || "#8C6A4A" }}></i>
                  <small className="text-muted">Vista previa del ícono seleccionado</small>
                </div>
              )}

              <label className="form-label">Color del ícono</label>
              <input
                type="color"
                className="form-control form-control-color mb-3"
                value={form.iconColor || "#8C6A4A"}
                onChange={(e) => setField("iconColor", e.target.value)}
              />

              {/* Título principal del bloque de cuidado */}
              <label className="form-label">Título</label>
              <input
                className="form-control mb-3"
                value={form.title || ""}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Aquí puedes escribir el título, ej: Cuidado Día"
              />

              <label className="form-label">Color del título</label>
              <input
                type="color"
                className="form-control form-control-color mb-3"
                value={form.titleColor || "#5b4636"}
                onChange={(e) => setField("titleColor", e.target.value)}
              />

              <label className="form-label">Subtítulo</label>
              <input
                className="form-control mb-3"
                value={form.subtitle || ""}
                onChange={(e) => setField("subtitle", e.target.value)}
                placeholder="Ej: 8:00–17:00 • sin contrato • pago por día"
              />

              {/* Descripción detallada del servicio de cuidado */}
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={form.description || ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Describe en qué consiste este servicio de cuidado y qué beneficios ofrece"
              />

              <hr className="my-3" />

            </div>

            <button className="btn btn-primary" onClick={onSave} type="button">
              Guardar
            </button>
          </div>
        </div>

        {/* DERECHA: preview */}
        <div className="col-lg-7">
          <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
              <div>
                <div className="mb-3" style={{ color: form.iconColor }}>
                  <i className={`${form.iconClass} fs-1`}></i>
                </div>
                <h5 className="fw-bold mb-1" style={{ color: form.titleColor }}>
                  {form.title || " "}
                </h5>
                <small className="text-muted d-block mb-3">
                  {form.subtitle || " "}
                </small>
              </div>

              <p className="text-muted mb-3">
                {form.description || " "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
