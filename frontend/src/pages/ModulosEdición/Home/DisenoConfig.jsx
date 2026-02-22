import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/diseno";

const FONTS = [
  "Poppins",
  "Inter",
  "Montserrat",
  "Roboto",
  "Lato",
  "Open Sans",
  "Playfair Display",
  "Nunito",
  "Raleway",
  "DM Sans",
];

const PALETTES = [
  {
    name: "Cafe (Original)",
    primaryColor: "#8C6A4A",
    darkColor: "#5b4636",
    accentColor: "#E8D8C8",
    bgColor: "#ffffff",
    sectionBg: "#f8f5f1",
  },
  {
    name: "Azul serenidad",
    primaryColor: "#4A7C8C",
    darkColor: "#2C4A56",
    accentColor: "#D0E8EF",
    bgColor: "#ffffff",
    sectionBg: "#f0f7fa",
  },
  {
    name: "Verde naturaleza",
    primaryColor: "#5A8C4A",
    darkColor: "#3B5B36",
    accentColor: "#D4E8C8",
    bgColor: "#ffffff",
    sectionBg: "#f2f8ef",
  },
  {
    name: "Violeta elegante",
    primaryColor: "#7A5C8C",
    darkColor: "#4A3656",
    accentColor: "#E0D0E8",
    bgColor: "#ffffff",
    sectionBg: "#f6f1f8",
  },
  {
    name: "Rosa suave",
    primaryColor: "#B5676A",
    darkColor: "#6E3A3D",
    accentColor: "#F0D4D5",
    bgColor: "#ffffff",
    sectionBg: "#fdf5f5",
  },
  {
    name: "Dorado cálido",
    primaryColor: "#B8860B",
    darkColor: "#6B4E09",
    accentColor: "#F5E6C8",
    bgColor: "#ffffff",
    sectionBg: "#fdf8ef",
  },
  {
    name: "Gris moderno",
    primaryColor: "#6C757D",
    darkColor: "#343A40",
    accentColor: "#DEE2E6",
    bgColor: "#ffffff",
    sectionBg: "#f8f9fa",
  },
  {
    name: "Terracota",
    primaryColor: "#C4704A",
    darkColor: "#7A3F28",
    accentColor: "#F0D8C8",
    bgColor: "#ffffff",
    sectionBg: "#fdf5ef",
  },
];

const initialForm = {
  primaryColor: "#8C6A4A",
  darkColor: "#5b4636",
  accentColor: "#E8D8C8",
  bgColor: "#ffffff",
  sectionBg: "#f8f5f1",
  font: "Poppins",
  borderRadius: "22",
};

export default function DisenoConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePalette, setActivePalette] = useState(null);
  const navigate = useNavigate();

  const onSave = async () => {
    try {
      await axios.put(API_URL, form);
      // Apply to current page immediately
      const root = document.documentElement;
      root.style.setProperty("--cafe", form.primaryColor);
      root.style.setProperty("--cafe-oscuro", form.darkColor);
      root.style.setProperty("--arena", form.accentColor);
      root.style.setProperty("--bs-primary", form.primaryColor);
      root.style.setProperty("--bs-body-bg", form.bgColor);
      root.style.setProperty("--text-base", form.darkColor);
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

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const applyPalette = (palette, idx) => {
    setActivePalette(idx);
    setForm((prev) => ({
      ...prev,
      primaryColor: palette.primaryColor,
      darkColor: palette.darkColor,
      accentColor: palette.accentColor,
      bgColor: palette.bgColor,
      sectionBg: palette.sectionBg,
    }));
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
        <div className="row g-4 align-items-start">
          {/* IZQUIERDA: editor */}
          <div className="col-lg-5">
            <h2 className="mb-3">
              <i className="bi bi-palette-fill me-2"></i>Colores y diseño
            </h2>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">

                {/* Palettes */}
                <label className="form-label fw-bold">Paletas predefinidas</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {PALETTES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPalette(p, idx)}
                      className={`btn btn-sm d-flex align-items-center gap-1 ${activePalette === idx ? "btn-dark" : "btn-outline-secondary"}`}
                      style={{ fontSize: "0.8rem" }}
                    >
                      <span
                        style={{
                          width: 14, height: 14, borderRadius: "50%",
                          background: p.primaryColor, border: "1px solid rgba(0,0,0,.2)",
                          display: "inline-block",
                        }}
                      ></span>
                      {p.name}
                    </button>
                  ))}
                </div>

                <hr className="my-3" />

                {/* Custom colors */}
                <label className="form-label fw-bold">Colores personalizados</label>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small">Color primario</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={form.primaryColor}
                        onChange={(e) => { setField("primaryColor", e.target.value); setActivePalette(null); }}
                      />
                      <code className="small">{form.primaryColor}</code>
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Color oscuro (textos)</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={form.darkColor}
                        onChange={(e) => { setField("darkColor", e.target.value); setActivePalette(null); }}
                      />
                      <code className="small">{form.darkColor}</code>
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small">Color acento</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={form.accentColor}
                        onChange={(e) => { setField("accentColor", e.target.value); setActivePalette(null); }}
                      />
                      <code className="small">{form.accentColor}</code>
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Fondo general</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={form.bgColor}
                        onChange={(e) => { setField("bgColor", e.target.value); setActivePalette(null); }}
                      />
                      <code className="small">{form.bgColor}</code>
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small">Fondo secciones</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={form.sectionBg}
                        onChange={(e) => { setField("sectionBg", e.target.value); setActivePalette(null); }}
                      />
                      <code className="small">{form.sectionBg}</code>
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Redondeo (px)</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0" max="40" step="2"
                      value={form.borderRadius}
                      onChange={(e) => setField("borderRadius", e.target.value)}
                    />
                    <small className="text-muted">{form.borderRadius}px</small>
                  </div>
                </div>

                <hr className="my-3" />

                <label className="form-label fw-bold">Fuente</label>
                <select
                  className="form-select mb-3"
                  value={form.font}
                  onChange={(e) => setField("font", e.target.value)}
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary" onClick={onSave} type="button">
                Guardar diseño
              </button>
            </div>
          </div>

          {/* DERECHA: preview */}
          <div className="col-lg-7">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa del sitio
            </p>

            <div
              className="rounded-4 overflow-hidden shadow"
              style={{
                background: form.bgColor,
                fontFamily: `"${form.font}", sans-serif`,
                fontSize: "0.72rem",
                border: "1px solid #dee2e6",
              }}
            >
              {/* Mini navbar */}
              <div className="d-flex align-items-center justify-content-between px-3 py-2"
                style={{ background: form.darkColor }}>
                <span className="fw-bold text-white" style={{ fontSize: "0.8rem" }}>Mi Hogar</span>
                <div className="d-flex gap-2">
                  <span className="text-white-50" style={{ fontSize: "0.7rem" }}>Inicio</span>
                  <span className="text-white-50" style={{ fontSize: "0.7rem" }}>Servicios</span>
                  <span className="text-white-50" style={{ fontSize: "0.7rem" }}>Contacto</span>
                </div>
              </div>

              {/* Mini hero */}
              <div className="text-center py-4 px-3"
                style={{
                  background: `linear-gradient(135deg, ${form.accentColor}, ${form.bgColor})`,
                }}>
                <div className="d-inline-block p-3 mb-2"
                  style={{
                    background: "rgba(255,255,255,.85)",
                    borderRadius: `${form.borderRadius}px`,
                    backdropFilter: "blur(8px)",
                  }}>
                  <span className="badge mb-1" style={{ background: form.accentColor, color: form.darkColor, fontSize: "0.6rem" }}>
                    Hogar geriátrico
                  </span>
                  <h6 className="fw-bold mb-1" style={{ color: form.primaryColor, fontSize: "0.95rem" }}>
                    Bienvenidos a nuestro hogar
                  </h6>
                  <p className="mb-2" style={{ color: form.darkColor, fontSize: "0.7rem" }}>
                    Cuidado con amor y profesionalismo
                  </p>
                  <button className="btn btn-sm text-white"
                    style={{ background: form.primaryColor, fontSize: "0.65rem", borderRadius: `${form.borderRadius / 2}px` }}>
                    <i className="bi bi-whatsapp me-1"></i>WhatsApp
                  </button>
                </div>
              </div>

              {/* Mini servicios */}
              <div className="px-3 py-3" style={{ background: form.sectionBg }}>
                <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem" }}>
                  Servicios y comodidades
                </h6>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="bg-white rounded-3 p-2 text-center shadow-sm" style={{ borderRadius: `${form.borderRadius}px` }}>
                      <i className="bi bi-sunrise" style={{ color: form.primaryColor, fontSize: "1.2rem" }}></i>
                      <p className="fw-bold mb-0 mt-1" style={{ color: form.darkColor, fontSize: "0.7rem" }}>Cuidado Día</p>
                      <small className="text-muted" style={{ fontSize: "0.6rem" }}>8:00–17:00</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white rounded-3 p-2 text-center shadow-sm" style={{ borderRadius: `${form.borderRadius}px` }}>
                      <i className="bi bi-house-heart" style={{ color: form.primaryColor, fontSize: "1.2rem" }}></i>
                      <p className="fw-bold mb-0 mt-1" style={{ color: form.darkColor, fontSize: "0.7rem" }}>Permanente</p>
                      <small className="text-muted" style={{ fontSize: "0.6rem" }}>24/7</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini valores */}
              <div className="px-3 py-3">
                <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem" }}>
                  Nuestros valores
                </h6>
                <div className="d-flex gap-2 justify-content-center">
                  {["Dignidad", "Amor", "Compromiso"].map((v) => (
                    <div key={v} className="bg-white rounded-3 p-2 text-center shadow-sm flex-fill"
                      style={{ borderRadius: `${form.borderRadius}px` }}>
                      <i className="bi bi-heart-fill" style={{ color: form.primaryColor, fontSize: "0.9rem" }}></i>
                      <p className="fw-bold mb-0" style={{ color: form.darkColor, fontSize: "0.65rem" }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini galería */}
              <div className="px-3 py-3" style={{ background: form.sectionBg }}>
                <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem" }}>
                  Así es nuestro hogar
                </h6>
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex-fill rounded-2" style={{
                      height: 40, background: form.accentColor,
                      border: `1px solid ${form.primaryColor}33`,
                    }}></div>
                  ))}
                </div>
              </div>

              {/* Mini CTA */}
              <div className="text-center text-white py-3 px-3" style={{ background: form.primaryColor }}>
                <p className="fw-bold mb-1" style={{ fontSize: "0.8rem" }}>Agenda una visita</p>
                <button className="btn btn-sm btn-light" style={{ fontSize: "0.65rem", color: form.primaryColor }}>
                  Contacto
                </button>
              </div>

              {/* Mini footer */}
              <div className="text-center py-2" style={{ background: form.darkColor }}>
                <small className="text-white-50" style={{ fontSize: "0.6rem" }}>
                  Hogar Geriátrico 2025
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
