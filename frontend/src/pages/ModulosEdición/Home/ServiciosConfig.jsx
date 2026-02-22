import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const API_URL = "/home-config/servicios";

const ICON_OPTIONS = [
  { value: "bi bi-sunrise", label: "Amanecer" },
  { value: "bi bi-house-heart", label: "Casa corazón" },
  { value: "bi bi-heart-pulse", label: "Corazón pulso" },
  { value: "bi bi-hospital", label: "Hospital" },
  { value: "bi bi-person-wheelchair", label: "Silla de ruedas" },
  { value: "bi bi-capsule", label: "Cápsula" },
  { value: "bi bi-shield-check", label: "Escudo" },
  { value: "bi bi-calendar-heart", label: "Calendario" },
  { value: "bi bi-people", label: "Personas" },
  { value: "bi bi-stars", label: "Estrellas" },
  { value: "bi bi-flower1", label: "Flor" },
  { value: "bi bi-clipboard2-pulse", label: "Clipboard médico" },
  { value: "bi bi-moon-stars", label: "Luna" },
  { value: "bi bi-chat-heart", label: "Chat corazón" },
  { value: "bi bi-bandaid", label: "Curita" },
  { value: "bi bi-activity", label: "Actividad" },
];

const newService = () => ({
  icon: "bi bi-star",
  title: "",
  subtitle: "",
  description: "",
  buttonText: "Ver detalle",
  buttonLink: "",
});

const newHighlight = () => ({ badge: "", title: "", description: "" });

const initialForm = {
  sectionTitle: "Servicios y comodidades",
  sectionSubtitle: "Modalidades claras para las necesidades de tu familia.",
  services: [],
  highlights: [],
};

export default function ServiciosConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [tab, setTab] = useState("services");
  const navigate = useNavigate();

  const onSave = async () => {
    try {
      await api.put(API_URL, form);
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch {
      alert("No se pudo guardar");
    }
  };

  useEffect(() => {
    api
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  // --- Services CRUD ---
  const addService = () =>
    setForm((prev) => ({
      ...prev,
      services: [...(prev.services || []), newService()],
    }));

  const removeService = (i) =>
    setForm((prev) => {
      const arr = [...(prev.services || [])];
      arr.splice(i, 1);
      return { ...prev, services: arr };
    });

  const setServiceField = (i, field, value) =>
    setForm((prev) => {
      const arr = [...(prev.services || [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...prev, services: arr };
    });

  // --- Highlights CRUD ---
  const addHighlight = () =>
    setForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlight()],
    }));

  const removeHighlight = (i) =>
    setForm((prev) => {
      const arr = [...(prev.highlights || [])];
      arr.splice(i, 1);
      return { ...prev, highlights: arr };
    });

  const setHighlightField = (i, field, value) =>
    setForm((prev) => {
      const arr = [...(prev.highlights || [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...prev, highlights: arr };
    });

  return (
    <>
      {showSuccess && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn .3s ease",
          }}
        >
          <div
            style={{
              background: "#fff", borderRadius: "1.5rem", padding: "2.5rem 3rem",
              textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
              animation: "scaleIn .4s ease",
            }}
          >
            <div
              style={{
                width: 80, height: 80, borderRadius: "50%", background: "#d4edda",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.2rem",
              }}
            >
              <i className="bi bi-check-lg" style={{ fontSize: "2.5rem", color: "#198754" }}></i>
            </div>
            <h3 className="fw-bold mb-2" style={{ color: "#5b4636" }}>Guardado exitoso</h3>
            <p className="text-muted mb-0">Redirigiendo al panel de administración...</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div className="container py-4">
        <div className="row g-4 align-items-start">
          {/* IZQUIERDA: editor */}
          <div className="col-lg-5">
            <h2 className="mb-3">
              <i className="bi bi-grid-1x2-fill me-2"></i>Servicios y comodidades
            </h2>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <label className="form-label">Título de la sección</label>
                <input
                  className="form-control mb-3"
                  value={form.sectionTitle || ""}
                  onChange={(e) => setField("sectionTitle", e.target.value)}
                />

                <label className="form-label">Subtítulo</label>
                <input
                  className="form-control mb-3"
                  value={form.sectionSubtitle || ""}
                  onChange={(e) => setField("sectionSubtitle", e.target.value)}
                />

                <hr className="my-3" />

                {/* Tabs */}
                <ul className="nav nav-pills nav-fill mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${tab === "services" ? "active" : ""}`}
                      onClick={() => setTab("services")}
                      type="button"
                    >
                      <i className="bi bi-grid me-1"></i>
                      Servicios ({(form.services || []).length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${tab === "highlights" ? "active" : ""}`}
                      onClick={() => setTab("highlights")}
                      type="button"
                    >
                      <i className="bi bi-award me-1"></i>
                      Diferenciales ({(form.highlights || []).length})
                    </button>
                  </li>
                </ul>

                {/* TAB: Services */}
                {tab === "services" && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted fw-bold">Tarjetas de servicio</small>
                      <button className="btn btn-sm btn-outline-primary" onClick={addService} type="button">
                        + Añadir servicio
                      </button>
                    </div>

                    {(form.services || []).length === 0 && (
                      <div className="text-center py-3 rounded-3" style={{ background: "#f8f5f1", border: "2px dashed #d4c8b8" }}>
                        <i className="bi bi-grid fs-3 d-block mb-1" style={{ color: "#8C6A4A" }}></i>
                        <small className="text-muted">Sin servicios. Añade el primero.</small>
                      </div>
                    )}

                    <div className="d-grid gap-3 mt-2">
                      {(form.services || []).map((svc, idx) => (
                        <div key={idx} className="card border rounded-3 p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted fw-bold">Servicio #{idx + 1}</small>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeService(idx)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>

                          <label className="form-label">Ícono</label>
                          <select
                            className="form-select mb-2"
                            value={svc.icon || ""}
                            onChange={(e) => setServiceField(idx, "icon", e.target.value)}
                          >
                            <option value="">-- Seleccionar --</option>
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>

                          <label className="form-label">Título</label>
                          <input
                            className="form-control mb-2"
                            value={svc.title || ""}
                            onChange={(e) => setServiceField(idx, "title", e.target.value)}
                            placeholder="Ej: Cuidado Día"
                          />

                          <label className="form-label">Subtítulo / Horario</label>
                          <input
                            className="form-control mb-2"
                            value={svc.subtitle || ""}
                            onChange={(e) => setServiceField(idx, "subtitle", e.target.value)}
                            placeholder="Ej: 8:00–17:00 • sin contrato"
                          />

                          <label className="form-label">Descripción</label>
                          <textarea
                            className="form-control mb-2"
                            rows={3}
                            value={svc.description || ""}
                            onChange={(e) => setServiceField(idx, "description", e.target.value)}
                          />

                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* TAB: Highlights */}
                {tab === "highlights" && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted fw-bold">Franja de confianza</small>
                      <button className="btn btn-sm btn-outline-primary" onClick={addHighlight} type="button">
                        + Añadir diferencial
                      </button>
                    </div>

                    {(form.highlights || []).length === 0 && (
                      <div className="text-center py-3 rounded-3" style={{ background: "#f8f5f1", border: "2px dashed #d4c8b8" }}>
                        <i className="bi bi-award fs-3 d-block mb-1" style={{ color: "#8C6A4A" }}></i>
                        <small className="text-muted">Sin diferenciales. Añade el primero.</small>
                      </div>
                    )}

                    <div className="d-grid gap-3 mt-2">
                      {(form.highlights || []).map((hl, idx) => (
                        <div key={idx} className="card border rounded-3 p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted fw-bold">Diferencial #{idx + 1}</small>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeHighlight(idx)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>

                          <label className="form-label">Etiqueta superior</label>
                          <input
                            className="form-control mb-2"
                            value={hl.badge || ""}
                            onChange={(e) => setHighlightField(idx, "badge", e.target.value)}
                            placeholder="Ej: Diferencial"
                          />

                          <label className="form-label">Título</label>
                          <input
                            className="form-control mb-2"
                            value={hl.title || ""}
                            onChange={(e) => setHighlightField(idx, "title", e.target.value)}
                            placeholder="Ej: Envejecimiento activo"
                          />

                          <label className="form-label">Descripción</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={hl.description || ""}
                            onChange={(e) => setHighlightField(idx, "description", e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button className="btn btn-primary" onClick={onSave} type="button">
                Guardar
              </button>
            </div>
          </div>

          {/* DERECHA: preview */}
          <div className="col-lg-7">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa
            </p>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4" style={{ background: "#f8f9fa" }}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#5b4636" }}>
                    {form.sectionTitle || "Título"}
                  </h2>
                  <p className="text-muted">
                    {form.sectionSubtitle || "Subtítulo"}
                  </p>
                </div>

                {/* Services preview */}
                <div className="row g-3 mb-4">
                  {(form.services || []).map((svc, idx) => (
                    <div key={idx} className={`col-md-${(form.services || []).length === 1 ? "12" : "6"}`}>
                      <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
                        <div className="card-body p-3 d-flex flex-column align-items-center">
                          <div className="mb-2" style={{ color: "#8C6A4A" }}>
                            <i className={`${svc.icon || "bi bi-star"} fs-1`}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ color: "#5b4636" }}>
                            {svc.title || "Sin título"}
                          </h6>
                          <small className="text-muted d-block mb-2">
                            {svc.subtitle || ""}
                          </small>
                          <p className="text-muted small mb-2" style={{ fontSize: "0.85rem" }}>
                            {svc.description || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Highlights preview */}
                {(form.highlights || []).length > 0 && (
                  <div className="row g-3">
                    {(form.highlights || []).map((hl, idx) => (
                      <div key={idx} className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center">
                          <div className="card-body p-3">
                            <h6 className="text-uppercase fw-bold mb-1" style={{ color: "#8C6A4A", fontSize: "0.7rem" }}>
                              {hl.badge || "Etiqueta"}
                            </h6>
                            <h6 className="fw-bold mb-1" style={{ color: "#5b4636", fontSize: "0.9rem" }}>
                              {hl.title || "Título"}
                            </h6>
                            <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                              {hl.description || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
