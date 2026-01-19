import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/**
 * Home.jsx
 * - Este componente SOLO "muestra" el Home.
 * - Los textos editables del HERO vienen del backend (si existe) y si no, de initialConfig.
 * - Las secciones de Servicios/Galería/etc quedan listas para editar después (por ahora fijas o vacías).
 */

const URLROOT = "/"; // en Vite, esto apunta a /public
const API_URL = "http://localhost:4000/api/home-config/bloquep";

/** ✅ Defaults del HERO (lo que se muestra si la API no responde o no hay datos aún) */
const initialConfig = {
  // HERO (editable)
  badgeText: "",
  heroTitle: "",
  heroDescription:
    "",
  button2Text: "",
  whatsappNumber: "",
  pills: [

  ],

  // FUTURO (dejar listo para editar después)
  services: null,
  gallery: null,
  cta: null,
};

export default function Home() {
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState("");

  /** Helper opcional (te sirve después cuando empieces a editar más bloques) */
  const setField = (name, value) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  /** 1) Cargar config desde backend y mezclarla con defaults */
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        // Mezclamos defaults + backend (backend tiene prioridad)
        setConfig((prev) => ({ ...prev, ...res.data }));
      })
      .catch(() => {
        // Si falla la API, igual se muestra initialConfig
        setError("No se pudo cargar la configuración (se muestran valores por defecto).");
      });
  }, []);

  /** 2) URLs derivadas (no se guardan en DB, se construyen aquí) */
  const whatsappHref = useMemo(() => {
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    if (!number) return "#";

    const msg = "Hola, quiero agendar una visita y conocer los servicios.";
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }, [config.whatsappNumber]);

  /** 3) Datos de render (limpios) */
  const heroPills = useMemo(() => {
    return Array.isArray(config.pills) ? config.pills.filter(Boolean) : [];
  }, [config.pills]);

  return (
    <>
      {/* Aviso si la API falló */}
      {error && (
        <div className="container py-3">
          <div className="alert alert-warning mb-0">{error}</div>
        </div>
      )}

      {/* =========================
            HERO / CAROUSEL
      ========================= */}
      <section className="hero-wrapper">
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="8000"
          data-bs-pause="hover"
          aria-label="Galería principal"
        >
          {/* Indicadores */}
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Imagen 1"
            ></button>
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="1"
              aria-label="Imagen 2"
            ></button>
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            <div className="carousel-item active">
              <picture className="hero-picture">
                <source type="image/webp" srcSet={`${URLROOT}web/ancianato_inicio-1280.webp`} />
                <img
                  className="hero-img"
                  src={`${URLROOT}web/ancianato_inicio-1280.webp`}
                  alt="Hogar geriátrico: vista principal"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>

            <div className="carousel-item">
              <picture className="hero-picture">
                <source type="image/webp" srcSet={`${URLROOT}web/quienes-somos-1280.webp`} />
                <img
                  className="hero-img"
                  src={`${URLROOT}web/quienes-somos-1280.webp`}
                  alt="Familias y residentes compartiendo"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
            aria-label="Anterior"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
            aria-label="Siguiente"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>

        {/* Overlay */}
        <div className="hero-overlay">
          <div className="glass">
            <span className="badge bg-light text-dark fw-semibold mb-3">
              {config.badgeText || " "}
            </span>

            <h1 className="hero-title display-5 display-md-4">
              {config.heroTitle || " "}
            </h1>

            <p className="mb-4 lead">{config.heroDescription || " "}</p>

            <div className="d-flex flex-wrap justify-content-center gap-3">

              <a
                href={whatsappHref}
                className={`btn btn-outline-cafe btn-lg shadow btn-whatsapp ${
                  String(config.whatsappNumber || "").trim() ? "" : "disabled"
                }`}
                target="_blank"
                rel="noopener"
                aria-disabled={!String(config.whatsappNumber || "").trim()}
              >
                <i className="bi bi-whatsapp me-2"></i>
                {config.button2Text || " "}
              </a>
            </div>

            <div className="hero-pills mt-3">
              {heroPills.map((p, i) => (
                <span className="pill" key={i}>
                  {p}
                </span>
              ))}
            </div>

            <div className="text-center mt-3">
              <a
                href="#servicios-destacados"
                className="text-decoration-none"
                aria-label="Ir a servicios"
              >
                <i className="bi bi-chevron-double-down fs-2" style={{ color: "#8C6A4A" }}></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SERVICIOS (FUTURO)
          - Dejo la sección completa, pero SIN valores editables aún.
          - Más adelante la conectamos a config.services
      ========================= */}
      <section id="servicios-destacados" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#5b4636" }}>
              Servicios y comodidades
            </h2>
            <p className="text-muted">Modalidades claras para las necesidades de tu familia.</p>
          </div>

          {/* Por ahora lo dejas tal cual (luego lo pasamos a config) */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
                  <div>
                    <div className="mb-3" style={{ color: "#8C6A4A" }}>
                      <i className="bi bi-sunrise fs-1"></i>
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: "#5b4636" }}>
                      Cuidado Día
                    </h5>
                    <small className="text-muted d-block mb-3">
                      8:00–17:00 • sin contrato • pago por día
                    </small>
                  </div>

                  <p className="text-muted mb-3">
                    Super Programa diurno para mantener actividad física, mental y social, con
                    alimentación y acompañamiento profesional en un entorno seguro.
                  </p>

                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="/servicios/cuidado-dia" className="btn btn-primary">
                      Ver detalle
                    </Link>
                    <a
                      href="#"
                      className="btn btn-outline-cafe btn-whatsapp disabled"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="bi bi-whatsapp me-1"></i> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
                  <div>
                    <div className="mb-3" style={{ color: "#8C6A4A" }}>
                      <i className="bi bi-house-heart fs-1"></i>
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: "#5b4636" }}>
                      Cuidado Permanente
                    </h5>
                    <small className="text-muted d-block mb-3">
                      Residencia completa • 5 tiempos de comida
                    </small>
                  </div>

                  <p className="text-muted mb-3">
                    Hogar geriátrico interno con cuidado integral 24/7, habitaciones confortables,
                    supervisión continua y actividades para una vida tranquila y acompañada.
                  </p>

                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="/servicios/cuidado-permanente" className="btn btn-primary">
                      Ver detalle
                    </Link>
                    <a
                      href="#"
                      className="btn btn-outline-cafe btn-whatsapp disabled"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="bi bi-whatsapp me-1"></i> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini franja de confianza */}
          <div className="row g-4 mt-4 justify-content-center text-center">
            <div className="col-md-4">
              <div className="card card-feature h-100">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold mb-2" style={{ color: "#8C6A4A" }}>
                    Diferencial
                  </h6>
                  <h5 className="card-title" style={{ color: "#5b4636" }}>
                    Envejecimiento activo
                  </h5>
                  <p className="card-text">
                    Fisioterapia y deportología (2×/sem), psicología (1×/sem) y apoyo universitario.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-feature h-100">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold mb-2" style={{ color: "#8C6A4A" }}>
                    Respeto
                  </h6>
                  <h5 className="card-title" style={{ color: "#5b4636" }}>
                    Cuidado con dignidad
                  </h5>
                  <p className="card-text">
                    Lenguaje profesional y trato humano. Adultos mayores, nunca diminutivos.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-feature h-100">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold mb-2" style={{ color: "#8C6A4A" }}>
                    Cercanía
                  </h6>
                  <h5 className="card-title" style={{ color: "#5b4636" }}>
                    Comunicación diaria
                  </h5>
                  <p className="card-text">
                    Fotos y videos reales para las familias vía WhatsApp institucional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          GALERÍA (FUTURO)
      ========================= */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#5b4636" }}>
              Así es nuestro hogar
            </h2>
            <p className="text-muted">Imágenes reales de actividades e instalaciones.</p>
          </div>

          <div className="row g-3">
            {["galeria1.webp", "galeria2.webp", "galeria3.webp", "galeria4.webp"].map(
              (img) => (
                <div className="col-6 col-lg-3" key={img}>
                  <img
                    className="img-fluid rounded shadow-sm"
                    src={`${URLROOT}web/${img}`}
                    alt="Galería"
                    loading="lazy"
                  />
                </div>
              )
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/actividades" className="btn btn-outline-primary">
              Ver más actividades
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          MAPA (FUTURO)
      ========================= */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h3 className="fw-bold mb-3" style={{ color: "#5b4636" }}>
                Visítanos
              </h3>
              <p className="text-muted mb-4">
                Coordina tu visita y conoce nuestras instalaciones. Atención sin contrato para Cuidado Día.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a href="#" className="btn btn-outline-primary disabled" aria-disabled="true" onClick={(e)=>e.preventDefault()}>
                  Ver en Google Maps
                </a>
                <a href="#" className="btn btn-outline-secondary disabled" aria-disabled="true" onClick={(e)=>e.preventDefault()}>
                  Abrir en Waze
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ratio ratio-16x9 rounded shadow overflow-hidden">
                <iframe
                  src="about:blank"
                  title="Mapa (pendiente)"
                  aria-label="Mapa (pendiente)"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA FINAL (FUTURO)
      ========================= */}
      <section className="py-5" style={{ background: "#8C6A4A" }}>
        <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 text-white">
          <div>
            <h3 className="fw-bold mb-1">¿Listo para agendar una visita?</h3>
            <p className="mb-0">
              Escríbenos y te contamos disponibilidad para Cuidado Día o Cuidado Permanente.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/contacto" className="btn btn-light btn-lg" style={{ color: "#8C6A4A" }}>
              Contacto
            </Link>

            <a
              href={whatsappHref}
              className={`btn btn-outline-light btn-lg btn-whatsapp ${
                String(config.whatsappNumber || "").trim() ? "" : "disabled"
              }`}
              target="_blank"
              rel="noopener"
              aria-disabled={!String(config.whatsappNumber || "").trim()}
            >
              <i className="bi bi-whatsapp me-2"></i> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Nota: setField queda listo para cuando empieces a manejar otros bloques desde config */}
      {/* setField("services", ...) etc */}
    </>
  );
}
