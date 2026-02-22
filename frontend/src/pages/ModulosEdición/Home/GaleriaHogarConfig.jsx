import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/galeriahogar";

const initialForm = {
  title: "Así es nuestro hogar",
  subtitle: "Imágenes reales de actividades e instalaciones.",
  buttonText: "Ver más actividades",
  buttonLink: "/actividades",
  images: [],
};

export default function GaleriaHogarConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(null);
  const navigate = useNavigate();

  const onSave = async () => {
    try {
      await axios.put(API_URL, form);
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch {
      alert("No se pudo guardar");
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

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), { url: "", alt: "", caption: "" }],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const images = [...(prev.images || [])];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const setImageField = (index, field, value) => {
    setForm((prev) => {
      const images = [...(prev.images || [])];
      images[index] = { ...images[index], [field]: value };
      return { ...prev, images };
    });
  };

  const handleUpload = async (index, file) => {
    if (!file) return;
    setUploading(index);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post("http://localhost:4000/api/upload", fd);
      setImageField(index, "url", res.data.url);
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploading(null);
    }
  };

  const validImages = (form.images || []).filter((img) => img.url);

  return (
    <>
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn .3s ease",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "1.5rem",
              padding: "2.5rem 3rem",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,.2)",
              animation: "scaleIn .4s ease",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#d4edda",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
              }}
            >
              <i
                className="bi bi-check-lg"
                style={{ fontSize: "2.5rem", color: "#198754" }}
              ></i>
            </div>
            <h3 className="fw-bold mb-2" style={{ color: "#5b4636" }}>
              Guardado exitoso
            </h3>
            <p className="text-muted mb-0">
              Redirigiendo al panel de administración...
            </p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { opacity:0; transform:scale(.8) } to { opacity:1; transform:scale(1) } }
      `}</style>

      <div className="container py-4">
        <div className="row g-4 align-items-start">
          {/* IZQUIERDA: editor */}
          <div className="col-lg-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="mb-0">
                <i className="bi bi-camera-fill me-2"></i>Así es nuestro hogar
              </h2>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <label className="form-label">Título de la sección</label>
                <input
                  className="form-control mb-3"
                  value={form.title || ""}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Ej: Así es nuestro hogar"
                />

                <label className="form-label">Subtítulo</label>
                <input
                  className="form-control mb-3"
                  value={form.subtitle || ""}
                  onChange={(e) => setField("subtitle", e.target.value)}
                  placeholder="Ej: Imágenes reales de actividades..."
                />

                <hr className="my-3" />

                {/* IMÁGENES */}
                <div className="d-flex align-items-center justify-content-between">
                  <label className="form-label mb-0 fw-bold">
                    <i className="bi bi-images me-1"></i>Fotos de la galería
                  </label>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={addImage}
                    type="button"
                  >
                    + Añadir foto
                  </button>
                </div>
                <small className="text-muted d-block mb-2">
                  Medida recomendada: <strong>600 x 400 px</strong> (3:2). Se
                  muestran en grid de 4 columnas.
                </small>

                {(form.images || []).length === 0 && (
                  <div
                    className="text-center py-3 rounded-3 mb-2"
                    style={{
                      background: "#f8f5f1",
                      border: "2px dashed #d4c8b8",
                    }}
                  >
                    <i
                      className="bi bi-images fs-3 d-block mb-1"
                      style={{ color: "#8C6A4A" }}
                    ></i>
                    <small className="text-muted">
                      Sin fotos. Agrega imágenes para la galería.
                    </small>
                  </div>
                )}

                <div className="mt-2 d-grid gap-3">
                  {(form.images || []).map((img, idx) => (
                    <div
                      key={idx}
                      className="card border rounded-3 p-3 bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted fw-bold">
                          Foto #{idx + 1}
                        </small>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => removeImage(idx)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <div className="d-flex gap-2 mb-2">
                        <input
                          className="form-control"
                          value={img.url || ""}
                          onChange={(e) =>
                            setImageField(idx, "url", e.target.value)
                          }
                          placeholder="URL o sube desde tu dispositivo"
                        />
                        <label
                          className="btn btn-outline-secondary d-flex align-items-center gap-1 flex-shrink-0"
                          style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          <i className="bi bi-upload"></i>
                          {uploading === idx ? "..." : "Subir"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="d-none"
                            onChange={(e) => {
                              handleUpload(idx, e.target.files[0]);
                              e.target.value = "";
                            }}
                            disabled={uploading === idx}
                          />
                        </label>
                      </div>

                      <input
                        className="form-control mb-2"
                        value={img.caption || ""}
                        onChange={(e) =>
                          setImageField(idx, "caption", e.target.value)
                        }
                        placeholder="Caption (ej: Actividad física)"
                      />

                      <input
                        className="form-control mb-2"
                        value={img.alt || ""}
                        onChange={(e) =>
                          setImageField(idx, "alt", e.target.value)
                        }
                        placeholder="Texto alternativo (accesibilidad)"
                      />

                      {img.url && (
                        <div
                          className="rounded-3 overflow-hidden"
                          style={{ height: 100 }}
                        >
                          <img
                            src={img.url}
                            alt={img.alt || `Galería ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={onSave}
                type="button"
              >
                Guardar
              </button>
            </div>
          </div>

          {/* DERECHA: preview */}
          <div className="col-lg-7">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa de la sección
            </p>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#5b4636" }}>
                    {form.title || "Título de la sección"}
                  </h2>
                  <p className="text-muted">
                    {form.subtitle || "Subtítulo de la sección"}
                  </p>
                </div>

                {validImages.length === 0 ? (
                  <div
                    className="rounded-4 d-flex flex-column align-items-center justify-content-center text-muted"
                    style={{
                      height: 250,
                      background:
                        "linear-gradient(135deg, rgba(140,106,74,.10), rgba(255,255,255,.8))",
                      border: "2px dashed rgba(140,106,74,.3)",
                    }}
                  >
                    <i
                      className="bi bi-images fs-1 mb-2"
                      style={{ color: "#8C6A4A" }}
                    ></i>
                    <p className="mb-0">
                      Agrega imágenes para ver la vista previa
                    </p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {validImages.map((img, idx) => (
                      <div className="col-6 col-lg-3" key={idx}>
                        <div
                          className="position-relative rounded overflow-hidden shadow-sm"
                          style={{ aspectRatio: "3/2" }}
                        >
                          <img
                            src={img.url}
                            alt={img.alt || `Galería ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          {img.caption && (
                            <div
                              className="position-absolute bottom-0 start-0 end-0 text-white text-center py-1"
                              style={{
                                background:
                                  "linear-gradient(transparent, rgba(0,0,0,.6))",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {img.caption}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {validImages.length > 0 && (
              <p className="text-muted small text-center mt-2">
                {validImages.length} imagen
                {validImages.length !== 1 ? "es" : ""} en la galería
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
