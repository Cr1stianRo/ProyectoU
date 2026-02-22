import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/video";

const initialForm = {
  sectionTitle: "Conoce más sobre nosotros",
  sectionSubtitle: "",
  youtubeUrl: "",
};

/** Convierte cualquier URL de YouTube a formato embed */
function toEmbedUrl(url) {
  if (!url) return "";
  // Ya es embed
  if (url.includes("/embed/")) return url;
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  // youtube.com/watch?v=ID
  const full = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (full) return `https://www.youtube.com/embed/${full[1]}`;
  return url;
}

export default function VideoConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const onSave = async () => {
    try {
      await axios.put(API_URL, form);
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch {
      alert("No se pudo guardar");
    }
  };

  const embedUrl = toEmbedUrl(form.youtubeUrl);

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
          <i className="bi bi-play-btn-fill me-2"></i>Conoce más sobre nosotros
        </h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="row g-4">
          {/* Editor */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <label className="form-label fw-bold">Título de la sección</label>
                <input
                  className="form-control mb-3"
                  value={form.sectionTitle}
                  onChange={(e) => setField("sectionTitle", e.target.value)}
                />

                <label className="form-label fw-bold">Subtítulo</label>
                <textarea
                  className="form-control mb-3"
                  rows={2}
                  value={form.sectionSubtitle}
                  onChange={(e) => setField("sectionSubtitle", e.target.value)}
                />

                <label className="form-label fw-bold">Link de YouTube</label>
                <input
                  className="form-control mb-2"
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  value={form.youtubeUrl}
                  onChange={(e) => setField("youtubeUrl", e.target.value)}
                />
                <small className="text-muted d-block mb-3">
                  Pega cualquier link de YouTube. Se convierte automáticamente al formato correcto.
                </small>
              </div>

              <div className="card-footer bg-transparent border-0 p-3">
                <button className="btn btn-primary w-100" onClick={onSave}>
                  Guardar Video
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-7">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa
            </p>
            <div className="border rounded-4 p-4 bg-white shadow-sm">
              <div className="text-center mb-4">
                <h3 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
                  {form.sectionTitle || "Conoce más sobre nosotros"}
                </h3>
                <p className="text-muted">{form.sectionSubtitle}</p>
              </div>

              {embedUrl ? (
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow">
                  <iframe
                    src={embedUrl}
                    title="Video institucional"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded-3"
                  style={{ height: 250 }}
                >
                  <div className="text-center text-muted">
                    <i className="bi bi-play-circle fs-1 d-block mb-2"></i>
                    <p className="mb-0">Pega un link de YouTube para ver la vista previa</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
