import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/carrusel";

const initialSlide = () => ({ imageUrl: "", title: "", subtitle: "", altText: "" });

const initialForm = {
  slides: [],
};

export default function CarruselConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

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

  const setSlideField = (index, name, value) => {
    setForm((prev) => {
      const slides = [...(prev.slides || [])];
      slides[index] = { ...slides[index], [name]: value };
      return { ...prev, slides };
    });
  };

  const addSlide = () => {
    setForm((prev) => {
      const slides = [...(prev.slides || []), initialSlide()];
      return { ...prev, slides };
    });
    setActiveIndex((prev) => form.slides.length); // mover al nuevo
  };

  const removeSlide = (index) => {
    setForm((prev) => {
      const slides = [...(prev.slides || [])];
      slides.splice(index, 1);
      return { ...prev, slides };
    });
    setActiveIndex((prev) => Math.max(0, prev >= index ? prev - 1 : prev));
  };

  const moveSlide = (index, direction) => {
    setForm((prev) => {
      const slides = [...(prev.slides || [])];
      const target = index + direction;
      if (target < 0 || target >= slides.length) return prev;
      [slides[index], slides[target]] = [slides[target], slides[index]];
      return { ...prev, slides };
    });
    setActiveIndex((prev) => prev + direction);
  };

  const validSlides = (form.slides || []).filter((s) => s.imageUrl);

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">
              <i className="bi bi-images me-2"></i>Carrusel
            </h2>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={addSlide}
              type="button"
            >
              + Añadir imagen
            </button>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {(form.slides || []).length === 0 && (
            <div className="alert alert-light text-muted text-center py-4">
              <i className="bi bi-image fs-2 d-block mb-2"></i>
              No hay imágenes. Presiona <strong>+ Añadir imagen</strong> para comenzar.
            </div>
          )}

          <div className="d-grid gap-3">
            {(form.slides || []).map((slide, idx) => (
              <div
                key={idx}
                className={`card border-0 shadow-sm rounded-4 ${activeIndex === idx ? "border-primary border-2" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveIndex(idx)}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-semibold text-muted small">
                      Imagen {idx + 1}
                    </span>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary p-1 lh-1"
                        onClick={(e) => { e.stopPropagation(); moveSlide(idx, -1); }}
                        type="button"
                        disabled={idx === 0}
                        title="Mover arriba"
                      >
                        <i className="bi bi-chevron-up"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary p-1 lh-1"
                        onClick={(e) => { e.stopPropagation(); moveSlide(idx, 1); }}
                        type="button"
                        disabled={idx === (form.slides || []).length - 1}
                        title="Mover abajo"
                      >
                        <i className="bi bi-chevron-down"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger p-1 lh-1"
                        onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                        type="button"
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  <label className="form-label">URL de la imagen</label>
                  <input
                    className="form-control mb-2"
                    value={slide.imageUrl || ""}
                    onChange={(e) => setSlideField(idx, "imageUrl", e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {slide.imageUrl && (
                    <div
                      className="rounded-3 mb-2 overflow-hidden"
                      style={{ height: 80 }}
                    >
                      <img
                        src={slide.imageUrl}
                        alt={slide.altText || `Slide ${idx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}

                  <label className="form-label">Título (opcional)</label>
                  <input
                    className="form-control mb-2"
                    value={slide.title || ""}
                    onChange={(e) => setSlideField(idx, "title", e.target.value)}
                    placeholder="Ej: Nuestras instalaciones"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <label className="form-label">Subtítulo (opcional)</label>
                  <input
                    className="form-control mb-2"
                    value={slide.subtitle || ""}
                    onChange={(e) => setSlideField(idx, "subtitle", e.target.value)}
                    placeholder="Ej: Ambientes cálidos y seguros"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <label className="form-label">Texto alternativo (accesibilidad)</label>
                  <input
                    className="form-control"
                    value={slide.altText || ""}
                    onChange={(e) => setSlideField(idx, "altText", e.target.value)}
                    placeholder="Descripción breve de la imagen"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}
          </div>

          {(form.slides || []).length > 0 && (
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={onSave}
              type="button"
            >
              Guardar
            </button>
          )}
        </div>

        {/* DERECHA: preview */}
        <div className="col-lg-7">
          <p className="text-muted small mb-2">
            <i className="bi bi-eye me-1"></i>Vista previa del carrusel
          </p>

          {validSlides.length === 0 ? (
            <div
              className="rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center text-muted"
              style={{
                height: 420,
                background: "linear-gradient(135deg, rgba(140,106,74,.10), rgba(255,255,255,.8))",
                border: "2px dashed rgba(140,106,74,.3)",
              }}
            >
              <i className="bi bi-images fs-1 mb-2" style={{ color: "#8C6A4A" }}></i>
              <p className="mb-0">Agrega imágenes para ver la vista previa</p>
            </div>
          ) : (
            <div
              id="carruselPreview"
              className="carousel slide rounded-4 overflow-hidden shadow"
              style={{ height: 420 }}
            >
              {/* Indicators */}
              {validSlides.length > 1 && (
                <div className="carousel-indicators" style={{ marginBottom: "0.75rem" }}>
                  {validSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={idx === activeIndex % validSlides.length ? "active" : ""}
                      onClick={() => setActiveIndex(idx)}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: idx === activeIndex % validSlides.length ? "#8C6A4A" : "rgba(255,255,255,.6)",
                        border: "none",
                        margin: "0 3px",
                      }}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Slides */}
              <div className="carousel-inner" style={{ height: "100%" }}>
                {validSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`carousel-item${idx === activeIndex % validSlides.length ? " active" : ""}`}
                    style={{ height: "100%" }}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.altText || `Slide ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {(slide.title || slide.subtitle) && (
                      <div
                        className="carousel-caption d-flex flex-column align-items-center justify-content-end pb-4"
                        style={{ background: "linear-gradient(transparent, rgba(0,0,0,.55))", inset: 0, paddingTop: 0 }}
                      >
                        {slide.title && (
                          <h5 className="fw-bold mb-1 text-white">{slide.title}</h5>
                        )}
                        {slide.subtitle && (
                          <p className="mb-0 text-white-50 small">{slide.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              {validSlides.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        (prev - 1 + validSlides.length) % validSlides.length
                      )
                    }
                  >
                    <span
                      style={{
                        background: "rgba(140,106,74,.7)",
                        borderRadius: "50%",
                        padding: "0.5rem 0.6rem",
                      }}
                    >
                      <i className="bi bi-chevron-left text-white fs-5"></i>
                    </span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % validSlides.length)
                    }
                  >
                    <span
                      style={{
                        background: "rgba(140,106,74,.7)",
                        borderRadius: "50%",
                        padding: "0.5rem 0.6rem",
                      }}
                    >
                      <i className="bi bi-chevron-right text-white fs-5"></i>
                    </span>
                  </button>
                </>
              )}
            </div>
          )}

          {validSlides.length > 0 && (
            <p className="text-muted small text-center mt-2">
              {activeIndex % validSlides.length + 1} / {validSlides.length} imágenes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
