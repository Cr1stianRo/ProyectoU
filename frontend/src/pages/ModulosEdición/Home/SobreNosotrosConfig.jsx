// Editor del módulo "Sobre Nosotros".
// Permite editar descripción, imagen, filosofía institucional y pilares fundamentales.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const API_URL = "/home-config/sobrenosotros";
const UPLOAD_URL = "/upload";

// Estado inicial vacío: los datos se cargan desde la API o el usuario los completa
const initialForm = {
  sectionTitle: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  philosophyTitle: "",
  philosophyDescription: "",
  pillars: [],
};

export default function SobreNosotrosConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const setPillarField = (idx, field, value) => {
    const updated = [...form.pillars];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm((prev) => ({ ...prev, pillars: updated }));
  };

  const addPillar = () =>
    setForm((prev) => ({
      ...prev,
      pillars: [...prev.pillars, { title: "", description: "", icon: "bi bi-star" }],
    }));

  const removePillar = (idx) =>
    setForm((prev) => ({ ...prev, pillars: prev.pillars.filter((_, i) => i !== idx) }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await api.post(UPLOAD_URL, fd);
      setField("imageUrl", res.data.url);
    } catch {
      alert("Error al subir la imagen");
    }
  };

  const onSave = async () => {
    try {
      await api.put(API_URL, form);
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch {
      alert("No se pudo guardar");
    }
  };

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
        <h2 className="mb-3">
          <i className="bi bi-info-circle-fill me-2"></i>Sobre Nosotros
        </h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="row g-4">
          {/* Editor */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                {/* Título visible en la página pública */}
                <label className="form-label fw-bold">Título de la sección</label>
                <input
                  className="form-control mb-3"
                  value={form.sectionTitle}
                  onChange={(e) => setField("sectionTitle", e.target.value)}
                  placeholder="Aquí puedes escribir el título, ej: Sobre nosotros"
                />

                {/* Texto principal que describe al hogar geriátrico */}
                <label className="form-label fw-bold">Descripción principal</label>
                <textarea
                  className="form-control mb-3"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Escribe quiénes son, qué hacen y qué los diferencia como hogar geriátrico"
                />

                <label className="form-label fw-bold">Imagen de la sección</label>
                <div className="d-flex gap-2 mb-1">
                  <input
                    className="form-control"
                    placeholder="Pega aquí la URL de la imagen o usa el botón Subir"
                    value={form.imageUrl}
                    onChange={(e) => setField("imageUrl", e.target.value)}
                  />
                  <label className="btn btn-outline-secondary mb-0" style={{ whiteSpace: "nowrap" }}>
                    <i className="bi bi-upload me-1"></i>Subir
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </label>
                </div>
                <input
                  className="form-control mb-3"
                  placeholder="Describe la imagen para accesibilidad, ej: Fachada del hogar"
                  value={form.imageAlt}
                  onChange={(e) => setField("imageAlt", e.target.value)}
                />

                <hr />

                {/* Título de la subsección de filosofía institucional */}
                <label className="form-label fw-bold">Título de filosofía</label>
                <input
                  className="form-control mb-3"
                  value={form.philosophyTitle}
                  onChange={(e) => setField("philosophyTitle", e.target.value)}
                  placeholder="Aquí puedes escribir el título, ej: Nuestra filosofía"
                />

                {/* Texto que explica la filosofía o enfoque del hogar */}
                <label className="form-label fw-bold">Descripción de filosofía</label>
                <textarea
                  className="form-control mb-3"
                  rows={3}
                  value={form.philosophyDescription}
                  onChange={(e) => setField("philosophyDescription", e.target.value)}
                  placeholder="Describe la filosofía de cuidado y atención que guía a tu hogar"
                />

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">Pilares</label>
                  <button className="btn btn-sm btn-outline-primary" onClick={addPillar}>
                    <i className="bi bi-plus-lg me-1"></i>Agregar pilar
                  </button>
                </div>

                {form.pillars.map((p, idx) => (
                  <div key={idx} className="border rounded-3 p-3 mb-2 position-relative">
                    <button
                      className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1"
                      onClick={() => removePillar(idx)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    {/* Clase del ícono Bootstrap Icons para este pilar */}
                    <input
                      className="form-control mb-2"
                      placeholder="Ícono Bootstrap, ej: bi bi-heart-pulse"
                      value={p.icon}
                      onChange={(e) => setPillarField(idx, "icon", e.target.value)}
                    />
                    {/* Nombre corto del pilar institucional */}
                    <input
                      className="form-control mb-2"
                      placeholder="Aquí puedes escribir el nombre del pilar"
                      value={p.title}
                      onChange={(e) => setPillarField(idx, "title", e.target.value)}
                    />
                    {/* Explicación breve de este pilar */}
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Describe brevemente en qué consiste este pilar"
                      value={p.description}
                      onChange={(e) => setPillarField(idx, "description", e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="card-footer bg-transparent border-0 p-3">
                <button className="btn btn-primary w-100" onClick={onSave}>
                  Guardar Sobre Nosotros
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-6">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa
            </p>
            <div className="border rounded-4 p-4 bg-white shadow-sm">
              <h3 className="fw-bold mb-3" style={{ color: "var(--cafe-oscuro)" }}>
                {form.sectionTitle || ""}
              </h3>
              <div className="row g-3 align-items-center mb-4">
                <div className={form.imageUrl ? "col-md-7" : "col-12"}>
                  <p className="text-muted">{form.description || ""}</p>
                </div>
                {form.imageUrl && (
                  <div className="col-md-5">
                    <img
                      src={form.imageUrl}
                      alt={form.imageAlt}
                      className="w-100 rounded-3 shadow-sm"
                      style={{ objectFit: "cover", maxHeight: 200 }}
                    />
                  </div>
                )}
              </div>

              {form.philosophyTitle && (
                <>
                  <h5 className="fw-bold mb-2" style={{ color: "var(--cafe)" }}>
                    {form.philosophyTitle}
                  </h5>
                  <p className="text-muted mb-3">{form.philosophyDescription}</p>
                </>
              )}

              <div className="row g-3">
                {form.pillars.map((p, idx) => (
                  <div key={idx} className="col-md-4">
                    <div className="text-center p-3 border rounded-3">
                      <i className={`${p.icon} fs-2`} style={{ color: "var(--cafe)" }}></i>
                      <h6 className="fw-bold mt-2 mb-1" style={{ color: "var(--cafe-oscuro)" }}>{p.title}</h6>
                      <small className="text-muted">{p.description}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
