import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "/home-config/bloquep";

const initialForm = {
  badgeText: "",
  heroTitle: "",
  heroDescription: "",
  button2Text: "",
  whatsappNumber: "",
  pills: [],
  heroImages: [],
};





export default function HomeSettings() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const setPill = (index, value) => {
    setForm((prev) => {
      const pills = Array.isArray(prev.pills) ? [...prev.pills] : [];
      pills[index] = value;
      return { ...prev, pills };
    });
  };

  const addPill = () => {
    setForm((prev) => ({ ...prev, pills: [...(prev.pills || []), ""] }));
  };

  const removePill = (index) => {
    setForm((prev) => {
      const pills = [...(prev.pills || [])];
      pills.splice(index, 1);
      return { ...prev, pills };
    });
  };


  const addHeroImage = () => {
    setForm((prev) => ({
      ...prev,
      heroImages: [...(prev.heroImages || []), { url: "", alt: "" }],
    }));
  };

  const removeHeroImage = (index) => {
    setForm((prev) => {
      const imgs = [...(prev.heroImages || [])];
      imgs.splice(index, 1);
      return { ...prev, heroImages: imgs };
    });
  };

  const setHeroImageField = (index, field, value) => {
    setForm((prev) => {
      const imgs = [...(prev.heroImages || [])];
      imgs[index] = { ...imgs[index], [field]: value };
      return { ...prev, heroImages: imgs };
    });
  };

  const handleHeroUpload = async (index, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/upload", fd);
      setHeroImageField(index, "url", res.data.url);
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const whatsappHref = form.whatsappNumber
  ? `https://wa.me/${form.whatsappNumber}?text=Hola%2C%20quiero%20agendar%20una%20visita%20y%20conocer%20los%20servicios.`
  : "#";
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
            <h2 className="mb-0">Bloque Principal</h2>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <label className="form-label">Subtítulo arriba (badge)</label>
              <input
                className="form-control mb-3"
                value={form.badgeText || ""}
                onChange={(e) => setField("badgeText", e.target.value)}
                placeholder="Ej: Hogar geriátrico • Pereira"
              />

              <label className="form-label">Título principal</label>
              <input
                className="form-control mb-3"
                value={form.heroTitle || ""}
                onChange={(e) => setField("heroTitle", e.target.value)}
              />

              <label className="form-label">Descripción</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={form.heroDescription || ""}
                onChange={(e) => setField("heroDescription", e.target.value)}
              />

              <div className="row g-2 mt-2">



                <div className="col-6">
                  <label className="form-label">Título botón 2</label>
                  <input
                    className="form-control"
                    value={form.button2Text || ""}
                    onChange={(e) => setField("button2Text", e.target.value)}
                  />
                </div>



                <div className="col-6">
                  <label className="form-label">Número WhatsApp</label>
                    <input
                    className="form-control"
                    value={form.whatsappNumber || ""}
                    onChange={(e) => {
                        // deja solo dígitos
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        setField("whatsappNumber", onlyDigits);
                    }}
                    placeholder="Ej: 573005047057"
                    />
                    <small className="text-muted">
                    Solo números. Incluye el código del país (ej: 57).
                    </small>
                    
                </div>
              </div>

              <hr className="my-3" />

              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label mb-0">Píldoras</label>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={addPill}
                  type="button"
                >
                  + Añadir
                </button>
              </div>

              <div className="mt-2 d-grid gap-2">
                {(form.pills || []).map((pill, idx) => (
                  <div className="d-flex gap-2" key={idx}>
                    <input
                      className="form-control"
                      value={pill || ""}
                      onChange={(e) => setPill(idx, e.target.value)}
                      placeholder="Ej: Fisioterapia • 2/sem"
                    />
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => removePill(idx)}
                      aria-label="Eliminar pill"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              {/* SECCIÓN FOTOS HERO */}
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label mb-0 fw-bold">
                  <i className="bi bi-image me-1"></i>Fotos del Hero
                </label>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={addHeroImage}
                  type="button"
                >
                  + Añadir foto
                </button>
              </div>
              <small className="text-muted d-block mb-2">
                Medida recomendada: <strong>1280 x 720 px</strong> (16:9) o superior. Se ajustan a pantalla completa.
              </small>

              {(form.heroImages || []).length === 0 && (
                <div className="text-center py-3 rounded-3 mb-2"
                  style={{ background: "#f8f5f1", border: "2px dashed #d4c8b8" }}>
                  <i className="bi bi-images fs-3 d-block mb-1" style={{ color: "#8C6A4A" }}></i>
                  <small className="text-muted">Sin fotos. Agrega imágenes para el carrusel principal.</small>
                </div>
              )}

              <div className="mt-2 d-grid gap-3">
                {(form.heroImages || []).map((img, idx) => (
                  <div key={idx} className="card border rounded-3 p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted fw-bold">Foto #{idx + 1}</small>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => removeHeroImage(idx)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    <div className="d-flex gap-2 mb-2">
                      <input
                        className="form-control"
                        value={img.url || ""}
                        onChange={(e) => setHeroImageField(idx, "url", e.target.value)}
                        placeholder="URL o sube desde tu dispositivo"
                      />
                      <label className="btn btn-outline-secondary d-flex align-items-center gap-1 flex-shrink-0"
                        style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                        <i className="bi bi-upload"></i>
                        {uploading ? "..." : "Subir"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="d-none"
                          onChange={(e) => {
                            handleHeroUpload(idx, e.target.files[0]);
                            e.target.value = "";
                          }}
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    <input
                      className="form-control mb-2"
                      value={img.alt || ""}
                      onChange={(e) => setHeroImageField(idx, "alt", e.target.value)}
                      placeholder="Texto alternativo (ej: Vista del hogar)"
                    />

                    {img.url && (
                      <div className="rounded-3 overflow-hidden" style={{ height: 100 }}>
                        <img
                          src={img.url}
                          alt={img.alt || `Hero ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
            <button className="btn btn-primary" onClick={onSave} type="button">
    Guardar
  </button>
          </div>
        </div>

        

        {/* DERECHA: preview */}
        <div className="col-lg-7">
        <div className="position-relative rounded-4 overflow-hidden shadow">
            {/* Fondo del preview */}
            <div
            style={{
                height: 550,
                background: (form.heroImages || []).length > 0 && form.heroImages[0].url
                  ? `url(${form.heroImages[0].url}) center/cover no-repeat`
                  : "linear-gradient(135deg, rgba(140,106,74,.25), rgba(255,255,255,.65))",
            }}
            />

            {/* Overlay con contenido centrado */}
            <div className="hero-overlay" style={{ position: "absolute", inset: 0 }}>
            <div
                style={{
                transform: "scale(0.9)",          // ⬅️ reduce tamaño del bloque
                transformOrigin: "center",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                }}
            >
                <div className="glass">
                <span className="badge bg-light text-dark fw-semibold mb-3">
                    {form.badgeText || " "}
                </span>

                <h1 className="hero-title display-5 display-md-4">
                    {form.heroTitle || " "}
                </h1>

                <p className="mb-4 lead">
                    {form.heroDescription || " "}
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">

                    <a
                    href={whatsappHref}
                    className="btn btn-outline-cafe btn-lg shadow btn-whatsapp"
                    target="_blank"
                    rel="noopener"
                    >
                    <i className="bi bi-whatsapp me-2"></i>
                    {form.button2Text || " "}
                    </a>
                </div>

                <div className="hero-pills mt-3">
                    {(form.pills || []).filter(Boolean).map((p, i) => (
                    <span className="pill" key={i}>
                        {p}
                    </span>
                    ))}
                </div>

               
                </div>

                
            </div>
            </div>
            
        </div>
        </div>


        {/* fin derecha */}
      </div>
    </div>
    </>
  );
}
