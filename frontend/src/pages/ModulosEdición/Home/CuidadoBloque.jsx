import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000/api/home-config/cuidadod";

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

  const onSave = async () => {
    try {
      await axios.put(API_URL, form);
      alert("Guardado ✅");
    } catch (e) {
      alert("No se pudo guardar ❌");
    }
  };

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Cuidado Día</h2>
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
                <option value="bi bi-sunrise">☀️ Amanecer (bi-sunrise)</option>
                <option value="bi bi-moon-stars">🌙 Luna y estrellas (bi-moon-stars)</option>
                <option value="bi bi-heart-pulse">💗 Corazón con pulso (bi-heart-pulse)</option>
                <option value="bi bi-hospital">🏥 Hospital (bi-hospital)</option>
                <option value="bi bi-person-wheelchair">♿ Persona en silla de ruedas (bi-person-wheelchair)</option>
                <option value="bi bi-capsule">💊 Cápsula (bi-capsule)</option>
                <option value="bi bi-shield-check">🛡️ Escudo verificado (bi-shield-check)</option>
                <option value="bi bi-house-heart">🏠 Casa con corazón (bi-house-heart)</option>
                <option value="bi bi-calendar-heart">📅 Calendario corazón (bi-calendar-heart)</option>
                <option value="bi bi-people">👥 Personas (bi-people)</option>
                <option value="bi bi-stars">⭐ Estrellas (bi-stars)</option>
                <option value="bi bi-flower1">🌸 Flor (bi-flower1)</option>
                <option value="bi bi-tree">🌳 Árbol (bi-tree)</option>
                <option value="bi bi-bandaid">🩹 Curita (bi-bandaid)</option>
                <option value="bi bi-clipboard2-pulse">📋 Clipboard médico (bi-clipboard2-pulse)</option>
                <option value="bi bi-activity">📊 Actividad (bi-activity)</option>
                <option value="bi bi-thermometer-half">🌡️ Termómetro (bi-thermometer-half)</option>
                <option value="bi bi-chat-heart">💬 Chat corazón (bi-chat-heart)</option>
                <option value="bi bi-balloon-heart">🎈 Globo corazón (bi-balloon-heart)</option>
                <option value="bi bi-suit-heart">❤️ Corazón (bi-suit-heart)</option>
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

              <label className="form-label">Título</label>
              <input
                className="form-control mb-3"
                value={form.title || ""}
                onChange={(e) => setField("title", e.target.value)}
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

              <label className="form-label">Descripción</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={form.description || ""}
                onChange={(e) => setField("description", e.target.value)}
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
  );
}
