// Editor de colores, tipografía, componentes y orden de secciones del sitio.
// Incluye paletas predefinidas, vista previa en tiempo real y reordenamiento drag de secciones.
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const API_URL = "/home-config/diseno";
const PAGE_URL = "/home-config/page";

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
  "Merriweather",
  "Source Sans 3",
  "Josefin Sans",
  "Quicksand",
  "Cabin",
];

const PALETTES = [
  { name: "Cafe (Original)", primaryColor: "#8C6A4A", darkColor: "#5b4636", accentColor: "#E8D8C8", bgColor: "#ffffff", sectionBg: "#f8f5f1" },
  { name: "Azul serenidad", primaryColor: "#4A7C8C", darkColor: "#2C4A56", accentColor: "#D0E8EF", bgColor: "#ffffff", sectionBg: "#f0f7fa" },
  { name: "Verde naturaleza", primaryColor: "#5A8C4A", darkColor: "#3B5B36", accentColor: "#D4E8C8", bgColor: "#ffffff", sectionBg: "#f2f8ef" },
  { name: "Violeta elegante", primaryColor: "#7A5C8C", darkColor: "#4A3656", accentColor: "#E0D0E8", bgColor: "#ffffff", sectionBg: "#f6f1f8" },
  { name: "Rosa suave", primaryColor: "#B5676A", darkColor: "#6E3A3D", accentColor: "#F0D4D5", bgColor: "#ffffff", sectionBg: "#fdf5f5" },
  { name: "Dorado calido", primaryColor: "#B8860B", darkColor: "#6B4E09", accentColor: "#F5E6C8", bgColor: "#ffffff", sectionBg: "#fdf8ef" },
  { name: "Gris moderno", primaryColor: "#6C757D", darkColor: "#343A40", accentColor: "#DEE2E6", bgColor: "#ffffff", sectionBg: "#f8f9fa" },
  { name: "Terracota", primaryColor: "#C4704A", darkColor: "#7A3F28", accentColor: "#F0D8C8", bgColor: "#ffffff", sectionBg: "#fdf5ef" },
];

// Etiquetas legibles para cada tipo de sección en el ordenador
const SECTION_LABELS = {
  bloquep: "Hero Principal",
  carrusel: "Carrusel / Galeria",
  servicios: "Servicios",
  valores: "Valores / Mision",
  sobrenosotros: "Sobre Nosotros",
  equipo: "Equipo Humano",
  video: "Video Institucional",
  mapa: "Mapa / Ubicacion",
  galeriahogar: "Galeria del Hogar",
  cuidadod: "Cuidado Dia",
  diseno: "Diseno",
};

const SECTION_ICONS = {
  bloquep: "bi-house-heart-fill",
  carrusel: "bi-images",
  servicios: "bi-grid-3x3-gap-fill",
  valores: "bi-heart-fill",
  sobrenosotros: "bi-info-circle-fill",
  equipo: "bi-people-fill",
  video: "bi-play-circle-fill",
  mapa: "bi-geo-alt-fill",
  galeriahogar: "bi-camera-fill",
  cuidadod: "bi-sunrise-fill",
};

const FONT_SIZES = [
  { label: "Pequeno", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Grande", value: "18px" },
  { label: "Extra grande", value: "20px" },
];

const BUTTON_STYLES = [
  { label: "Redondeado", value: "22" },
  { label: "Muy redondeado", value: "50" },
  { label: "Semi redondeado", value: "12" },
  { label: "Suave", value: "6" },
  { label: "Recto", value: "0" },
];

const initialForm = {
  primaryColor: "#8C6A4A",
  darkColor: "#5b4636",
  accentColor: "#E8D8C8",
  bgColor: "#ffffff",
  sectionBg: "#f8f5f1",
  font: "Poppins",
  headingFont: "",
  borderRadius: "22",
  fontSize: "16px",
  buttonRadius: "22",
};

// Load Google Font dynamically for preview
function loadFont(fontName) {
  if (!fontName) return;
  const id = `gfont-${fontName.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

// Fallback order when no sections loaded yet
const defaultPreviewOrder = [
  { id: "bloquep-def", type: "bloquep" },
  { id: "servicios-def", type: "servicios" },
  { id: "valores-def", type: "valores" },
  { id: "galeriahogar-def", type: "galeriahogar" },
];

// Render a mini preview block for each section type
function renderMiniSection(type, form, headingFontFamily) {
  switch (type) {
    case "bloquep":
      return (
        <div className="text-center py-4 px-3"
          style={{ background: `linear-gradient(135deg, ${form.accentColor}, ${form.bgColor})` }}>
          <div className="d-inline-block p-3 mb-2"
            style={{
              background: "rgba(255,255,255,.85)",
              borderRadius: `${form.borderRadius}px`,
              backdropFilter: "blur(8px)",
            }}>
            <span className="badge mb-1" style={{ background: form.accentColor, color: form.darkColor, fontSize: "0.6rem" }}>
              Hogar geriatrico
            </span>
            <h6 className="fw-bold mb-1" style={{ color: form.primaryColor, fontSize: "0.95rem", fontFamily: headingFontFamily }}>
              Bienvenidos a nuestro hogar
            </h6>
            <p className="mb-2" style={{ color: form.darkColor, fontSize: "0.7rem" }}>
              Cuidado con amor y profesionalismo
            </p>
            <button className="btn btn-sm text-white"
              style={{ background: form.primaryColor, fontSize: "0.65rem", borderRadius: `${form.buttonRadius}px` }}>
              <i className="bi bi-whatsapp me-1"></i>WhatsApp
            </button>
          </div>
        </div>
      );
    case "servicios":
      return (
        <div className="px-3 py-3" style={{ background: form.sectionBg }}>
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Servicios y comodidades
          </h6>
          <div className="row g-2">
            {[{ icon: "bi-sunrise", name: "Cuidado Dia", sub: "8:00-17:00" }, { icon: "bi-house-heart", name: "Permanente", sub: "24/7" }].map((svc) => (
              <div key={svc.name} className="col-6">
                <div className="bg-white p-2 text-center shadow-sm" style={{ borderRadius: `${form.borderRadius}px` }}>
                  <i className={`bi ${svc.icon}`} style={{ color: form.primaryColor, fontSize: "1.2rem" }}></i>
                  <p className="fw-bold mb-0 mt-1" style={{ color: form.darkColor, fontSize: "0.7rem" }}>{svc.name}</p>
                  <small className="text-muted" style={{ fontSize: "0.6rem" }}>{svc.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "valores":
      return (
        <div className="px-3 py-3">
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Nuestros valores
          </h6>
          <div className="d-flex gap-2 justify-content-center">
            {["Dignidad", "Amor", "Compromiso"].map((v) => (
              <div key={v} className="bg-white p-2 text-center shadow-sm flex-fill"
                style={{ borderRadius: `${form.borderRadius}px` }}>
                <i className="bi bi-heart-fill" style={{ color: form.primaryColor, fontSize: "0.9rem" }}></i>
                <p className="fw-bold mb-0" style={{ color: form.darkColor, fontSize: "0.65rem" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "galeriahogar":
      return (
        <div className="px-3 py-3" style={{ background: form.sectionBg }}>
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Asi es nuestro hogar
          </h6>
          <div className="d-flex gap-1">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-fill" style={{
                height: 40, background: form.accentColor,
                borderRadius: `${Math.min(form.borderRadius, 12)}px`,
                border: `1px solid ${form.primaryColor}33`,
              }}></div>
            ))}
          </div>
        </div>
      );
    case "sobrenosotros":
      return (
        <div className="px-3 py-3">
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Sobre nosotros
          </h6>
          <div className="d-flex gap-2 align-items-center">
            <div className="flex-fill">
              <div style={{ height: 8, background: form.accentColor, borderRadius: 4, marginBottom: 4 }}></div>
              <div style={{ height: 8, background: form.accentColor, borderRadius: 4, marginBottom: 4, width: "80%" }}></div>
              <div style={{ height: 8, background: form.accentColor, borderRadius: 4, width: "60%" }}></div>
            </div>
            <div style={{ width: 50, height: 40, background: form.accentColor, borderRadius: `${Math.min(form.borderRadius, 12)}px`, border: `1px solid ${form.primaryColor}33` }}></div>
          </div>
        </div>
      );
    case "equipo":
      return (
        <div className="px-3 py-3" style={{ background: form.sectionBg }}>
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Equipo humano
          </h6>
          <div className="d-flex gap-2 justify-content-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="text-center">
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: form.accentColor, margin: "0 auto 2px", border: `1px solid ${form.primaryColor}33` }}></div>
                <div style={{ height: 4, width: 24, background: form.accentColor, borderRadius: 2, margin: "0 auto" }}></div>
              </div>
            ))}
          </div>
        </div>
      );
    case "video":
      return (
        <div className="px-3 py-3">
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Video institucional
          </h6>
          <div className="d-flex align-items-center justify-content-center" style={{
            height: 50, background: form.accentColor, borderRadius: `${Math.min(form.borderRadius, 12)}px`,
            border: `1px solid ${form.primaryColor}33`,
          }}>
            <i className="bi bi-play-circle-fill" style={{ fontSize: "1.5rem", color: form.primaryColor }}></i>
          </div>
        </div>
      );
    case "mapa":
      return (
        <div className="px-3 py-3" style={{ background: form.sectionBg }}>
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Ubicacion
          </h6>
          <div className="d-flex align-items-center justify-content-center" style={{
            height: 40, background: form.accentColor, borderRadius: `${Math.min(form.borderRadius, 12)}px`,
            border: `1px solid ${form.primaryColor}33`,
          }}>
            <i className="bi bi-geo-alt-fill" style={{ fontSize: "1.1rem", color: form.primaryColor }}></i>
          </div>
        </div>
      );
    case "carrusel":
      return (
        <div className="px-3 py-3">
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Galeria
          </h6>
          <div className="d-flex align-items-center justify-content-center" style={{
            height: 45, background: form.accentColor, borderRadius: `${Math.min(form.borderRadius, 12)}px`,
            border: `1px solid ${form.primaryColor}33`,
          }}>
            <i className="bi bi-images" style={{ fontSize: "1.2rem", color: form.primaryColor }}></i>
          </div>
        </div>
      );
    case "cuidadod":
      return (
        <div className="px-3 py-3" style={{ background: form.sectionBg }}>
          <h6 className="fw-bold text-center mb-2" style={{ color: form.darkColor, fontSize: "0.8rem", fontFamily: headingFontFamily }}>
            Cuidado Dia
          </h6>
          <div className="bg-white p-2 text-center shadow-sm mx-auto" style={{ borderRadius: `${form.borderRadius}px`, maxWidth: 140 }}>
            <i className="bi bi-sunrise" style={{ color: form.primaryColor, fontSize: "1rem" }}></i>
            <p className="fw-bold mb-0" style={{ color: form.darkColor, fontSize: "0.65rem" }}>Programa diurno</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function DisenoConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePalette, setActivePalette] = useState(null);
  const [activeTab, setActiveTab] = useState("colores");
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuracion"));
    api.get(PAGE_URL)
      .then((res) => {
        const sorted = (res.data.sections || [])
          .filter((s) => s.type !== "diseno")
          .sort((a, b) => a.order - b.order);
        setSections(sorted);
      })
      .catch(() => {})
      .finally(() => setSectionsLoading(false));
  }, []);

  // Load fonts when they change
  useEffect(() => { loadFont(form.font); }, [form.font]);
  useEffect(() => { loadFont(form.headingFont); }, [form.headingFont]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

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

  // Mueve una sección arriba o abajo y recalcula los índices de orden
  const moveSection = useCallback((idx, direction) => {
    setSections((prev) => {
      const arr = [...prev];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return prev;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return arr.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  // Guarda el tema de diseño y también persiste el nuevo orden de secciones
  const onSave = async () => {
    try {
      await api.put(API_URL, form);
      // También guarda el orden de secciones
      if (sections.length > 0) {
        // Re-include diseno section and merge with reordered sections
        const pageRes = await api.get(PAGE_URL);
        const allSections = pageRes.data.sections || [];
        const disenoSection = allSections.find((s) => s.type === "diseno");
        const reordered = sections.map((s, i) => ({ ...s, order: i }));
        if (disenoSection) {
          reordered.push({ ...disenoSection, order: 99 });
        }
        await api.put(PAGE_URL, { sections: reordered });
      }
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch {
      alert("No se pudo guardar");
    }
  };

  const headingFontFamily = form.headingFont
    ? `"${form.headingFont}", system-ui, sans-serif`
    : `"${form.font}", system-ui, sans-serif`;

  const tabs = [
    { id: "colores", label: "Colores", icon: "bi-palette-fill" },
    { id: "tipografia", label: "Tipografia", icon: "bi-fonts" },
    { id: "componentes", label: "Componentes", icon: "bi-puzzle-fill" },
    { id: "secciones", label: "Orden secciones", icon: "bi-list-ol" },
  ];

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
            <p className="text-muted mb-0">Redirigiendo al panel de administracion...</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
        .section-item { transition: all .2s ease; cursor: grab; }
        .section-item:hover { background: #f8f9fa !important; }
        .section-item.just-moved { animation: highlightMove .5s ease; }
        @keyframes highlightMove { 0%{background:#e8f4fd} 100%{background:transparent} }
        .move-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:none; border-radius:8px; background:#e9ecef; cursor:pointer; transition:all .15s; }
        .move-btn:hover { background:#dee2e6; transform:scale(1.1); }
        .move-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; }
        .tab-pill { border:none; background:none; padding:8px 16px; border-radius:12px; font-size:.85rem; font-weight:500; color:#6c757d; cursor:pointer; transition:all .2s; }
        .tab-pill:hover { background:#f0f0f0; }
        .tab-pill.active { background:var(--cafe,#8C6A4A); color:#fff; }
        .color-input-wrap { position:relative; width:42px; height:42px; border-radius:12px; overflow:hidden; border:2px solid #dee2e6; }
        .color-input-wrap input { position:absolute; inset:-4px; width:calc(100% + 8px); height:calc(100% + 8px); border:none; cursor:pointer; }
        .font-preview { padding:8px 12px; border-radius:8px; border:2px solid transparent; cursor:pointer; transition:all .15s; }
        .font-preview:hover { border-color:#dee2e6; background:#f8f9fa; }
        .font-preview.selected { border-color:var(--cafe,#8C6A4A); background:#fff5ee; }
      `}</style>

      <div className="container py-4">
        <div className="row g-4 align-items-start">
          {/* LEFT: Editor */}
          <div className="col-lg-5">
            <h2 className="mb-3">
              <i className="bi bi-palette-fill me-2"></i>Colores y diseno
            </h2>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {/* Tabs */}
            <div className="d-flex flex-wrap gap-1 mb-3">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`tab-pill ${activeTab === t.id ? "active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <i className={`bi ${t.icon} me-1`}></i>{t.label}
                </button>
              ))}
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">

                {/* TAB: Colores */}
                {activeTab === "colores" && (
                  <>
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
                          <span style={{
                            width: 14, height: 14, borderRadius: "50%",
                            background: p.primaryColor, border: "1px solid rgba(0,0,0,.2)",
                            display: "inline-block",
                          }}></span>
                          {p.name}
                        </button>
                      ))}
                    </div>

                    <hr className="my-3" />

                    <label className="form-label fw-bold mb-2">Colores personalizados</label>
                    <div className="row g-3 mb-3">
                      {[
                        { key: "primaryColor", label: "Principal" },
                        { key: "darkColor", label: "Oscuro" },
                        { key: "accentColor", label: "Acento" },
                        { key: "bgColor", label: "Fondo" },
                        { key: "sectionBg", label: "Fondo seccion" },
                      ].map(({ key, label }) => (
                        <div key={key} className="col-6">
                          <div className="d-flex align-items-center gap-2">
                            <div className="color-input-wrap">
                              <input
                                type="color"
                                value={form[key]}
                                onChange={(e) => setField(key, e.target.value)}
                              />
                            </div>
                            <div>
                              <small className="fw-semibold d-block">{label}</small>
                              <small className="text-muted">{form[key]}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* TAB: Tipografia */}
                {activeTab === "tipografia" && (
                  <>
                    <label className="form-label fw-bold">Fuente del cuerpo</label>
                    <div className="mb-3" style={{ maxHeight: 220, overflowY: "auto" }}>
                      {FONTS.map((f) => (
                        <div
                          key={f}
                          className={`font-preview ${form.font === f ? "selected" : ""}`}
                          onClick={() => { loadFont(f); setField("font", f); }}
                          style={{ fontFamily: `"${f}", sans-serif` }}
                        >
                          <span className="fw-semibold">{f}</span>
                          <br />
                          <small className="text-muted" style={{ fontFamily: `"${f}", sans-serif` }}>
                            Aa Bb Cc 123 - Vista previa
                          </small>
                        </div>
                      ))}
                    </div>

                    <label className="form-label fw-bold">Fuente de titulos</label>
                    <select
                      className="form-select mb-3"
                      value={form.headingFont || ""}
                      onChange={(e) => setField("headingFont", e.target.value)}
                    >
                      <option value="">Misma que el cuerpo</option>
                      {FONTS.map((f) => (
                        <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>{f}</option>
                      ))}
                    </select>

                    <label className="form-label fw-bold">Tamano de texto</label>
                    <div className="d-flex gap-2 mb-3">
                      {FONT_SIZES.map((fs) => (
                        <button
                          key={fs.value}
                          type="button"
                          className={`btn btn-sm ${form.fontSize === fs.value ? "btn-dark" : "btn-outline-secondary"}`}
                          onClick={() => setField("fontSize", fs.value)}
                        >
                          {fs.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* TAB: Componentes */}
                {activeTab === "componentes" && (
                  <>
                    <label className="form-label fw-bold">Estilo de botones</label>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {BUTTON_STYLES.map((bs) => (
                        <button
                          key={bs.value}
                          type="button"
                          className="btn btn-sm text-white"
                          style={{
                            background: form.primaryColor,
                            borderRadius: `${bs.value}px`,
                            border: form.buttonRadius === bs.value ? "2px solid #000" : "2px solid transparent",
                          }}
                          onClick={() => setField("buttonRadius", bs.value)}
                        >
                          {bs.label}
                        </button>
                      ))}
                    </div>

                    <label className="form-label fw-bold">Bordes redondeados (tarjetas)</label>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <input
                        type="range"
                        className="form-range flex-fill"
                        min="0"
                        max="50"
                        value={form.borderRadius}
                        onChange={(e) => setField("borderRadius", e.target.value)}
                      />
                      <span className="badge bg-secondary">{form.borderRadius}px</span>
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                      <div className="text-center">
                        <div style={{
                          width: 80, height: 60, background: form.accentColor,
                          borderRadius: `${form.borderRadius}px`,
                          border: `2px solid ${form.primaryColor}`,
                        }}></div>
                        <small className="text-muted mt-1 d-block">Tarjeta</small>
                      </div>
                      <div className="text-center">
                        <button
                          className="btn btn-sm text-white"
                          style={{
                            background: form.primaryColor,
                            borderRadius: `${form.buttonRadius}px`,
                            padding: "8px 20px",
                          }}
                        >
                          Boton
                        </button>
                        <small className="text-muted mt-1 d-block">Boton</small>
                      </div>
                    </div>
                  </>
                )}

                {/* TAB: Secciones */}
                {activeTab === "secciones" && (
                  <>
                    <label className="form-label fw-bold mb-1">Orden de las secciones</label>
                    <p className="text-muted small mb-3">
                      Usa las flechas para mover las secciones arriba o abajo.
                    </p>

                    {sectionsLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-muted"></div>
                      </div>
                    ) : sections.length === 0 ? (
                      <p className="text-muted text-center py-3">No hay secciones configuradas aun.</p>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {sections.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="section-item d-flex align-items-center gap-2 p-2 rounded-3"
                            style={{ border: "1px solid #e9ecef" }}
                          >
                            <span className="badge bg-light text-dark" style={{ minWidth: 28 }}>
                              {idx + 1}
                            </span>
                            <i className={`bi ${SECTION_ICONS[s.type] || "bi-square"}`} style={{ color: form.primaryColor, fontSize: "1.1rem" }}></i>
                            <span className="flex-fill fw-medium" style={{ fontSize: ".9rem" }}>
                              {SECTION_LABELS[s.type] || s.type}
                            </span>
                            <div className="d-flex gap-1">
                              <button
                                className="move-btn"
                                disabled={idx === 0}
                                onClick={() => moveSection(idx, -1)}
                                title="Subir"
                              >
                                <i className="bi bi-chevron-up"></i>
                              </button>
                              <button
                                className="move-btn"
                                disabled={idx === sections.length - 1}
                                onClick={() => moveSection(idx, 1)}
                                title="Bajar"
                              >
                                <i className="bi bi-chevron-down"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="card-footer bg-transparent border-0 p-3">
                <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={onSave} type="button">
                  <i className="bi bi-check-lg me-2"></i>Guardar diseno
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="col-lg-7">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa del sitio
              {activeTab === "secciones" && (
                <span className="ms-2 badge bg-info text-dark" style={{ fontSize: "0.65rem" }}>
                  <i className="bi bi-arrow-down-up me-1"></i>Mueve las secciones y mira el resultado aqui
                </span>
              )}
            </p>

            <div
              className="rounded-4 overflow-hidden shadow"
              style={{
                background: form.bgColor,
                fontFamily: `"${form.font}", sans-serif`,
                fontSize: form.fontSize || "0.72rem",
                border: "1px solid #dee2e6",
              }}
            >
              {/* Mini navbar - always first */}
              <div className="d-flex align-items-center justify-content-between px-3 py-2"
                style={{ background: form.darkColor }}>
                <span className="fw-bold text-white" style={{ fontSize: "0.8rem", fontFamily: headingFontFamily }}>Mi Hogar</span>
                <div className="d-flex gap-2">
                  {["Inicio", "Servicios", "Contacto"].map((t) => (
                    <span key={t} className="text-white-50" style={{ fontSize: "0.7rem" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Dynamic sections rendered in order */}
              {(sections.length > 0 ? sections : defaultPreviewOrder).map((s) => {
                const type = s.type || s;
                return (
                  <div key={s.id || type} style={{ transition: "all .3s ease" }}>
                    {renderMiniSection(type, form, headingFontFamily)}
                  </div>
                );
              })}

              {/* Mini CTA - always near bottom */}
              <div className="text-center text-white py-3 px-3" style={{ background: form.primaryColor }}>
                <p className="fw-bold mb-1" style={{ fontSize: "0.8rem", fontFamily: headingFontFamily }}>Agenda una visita</p>
                <button className="btn btn-sm btn-light" style={{ fontSize: "0.65rem", color: form.primaryColor, borderRadius: `${form.buttonRadius}px` }}>
                  Contacto
                </button>
              </div>

              {/* Mini footer - always last */}
              <div className="text-center py-2" style={{ background: form.darkColor }}>
                <small className="text-white-50" style={{ fontSize: "0.6rem" }}>
                  Hogar Geriatrico 2025
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
