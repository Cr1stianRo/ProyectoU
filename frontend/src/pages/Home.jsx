import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const URLROOT = "/";
const API_URL = "http://localhost:4000/api/home-config/page";

export default function Home() {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const sortedSections = (res.data.sections || []).sort(
          (a, b) => a.order - b.order
        );
        setSections(sortedSections);
      })
      .catch(() => {
        setError("No se pudo cargar la configuración de la página.");
      });
  }, []);

  // Buscar la sección del bloquep para el hero
  const bloquepConfig = useMemo(() => {
    const bloquep = sections.find((s) => s.type === "bloquep");
    return bloquep?.config || {};
  }, [sections]);

  const whatsappHref = useMemo(() => {
    const number = String(bloquepConfig.whatsappNumber || "").replace(/\D/g, "");
    if (!number) return "#";
    const msg = "Hola, quiero agendar una visita y conocer los servicios.";
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }, [bloquepConfig.whatsappNumber]);

  const heroPills = useMemo(() => {
    return Array.isArray(bloquepConfig.pills)
      ? bloquepConfig.pills.filter(Boolean)
      : [];
  }, [bloquepConfig.pills]);

  // Función para renderizar cada sección según su tipo
  const renderSection = (section) => {
    const { type, config, id } = section;

    switch (type) {
      case "carrusel":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "#5b4636" }}>
                  Galería
                </h2>
                <p className="text-muted">Imágenes de nuestras instalaciones.</p>
              </div>

              {config.slides && config.slides.length > 0 ? (
                <div
                  id={`carousel-${id}`}
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    {config.slides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        data-bs-target={`#carousel-${id}`}
                        data-bs-slide-to={idx}
                        className={idx === 0 ? "active" : ""}
                        aria-current={idx === 0 ? "true" : "false"}
                        aria-label={`Slide ${idx + 1}`}
                      ></button>
                    ))}
                  </div>

                  <div className="carousel-inner">
                    {config.slides.map((slide, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? "active" : ""}`}
                      >
                        <img
                          src={slide.imageUrl}
                          className="d-block w-100 rounded"
                          alt={slide.altText || slide.title || "Imagen"}
                          style={{ maxHeight: "500px", objectFit: "cover" }}
                        />
                        {(slide.title || slide.subtitle) && (
                          <div className="carousel-caption d-none d-md-block">
                            {slide.title && <h5>{slide.title}</h5>}
                            {slide.subtitle && <p>{slide.subtitle}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#carousel-${id}`}
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Anterior</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#carousel-${id}`}
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Siguiente</span>
                  </button>
                </div>
              ) : (
                <p className="text-muted text-center">No hay imágenes disponibles</p>
              )}
            </div>
          </section>
        );

      case "cuidadod":
        return (
          <section key={id} id="servicios-destacados" className="py-5 bg-light">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "#5b4636" }}>
                  Servicios y comodidades
                </h2>
                <p className="text-muted">
                  Modalidades claras para las necesidades de tu familia.
                </p>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
                      <div>
                        <div
                          className="mb-3"
                          style={{ color: config.iconColor || "#8C6A4A" }}
                        >
                          <i
                            className={config.iconClass || "bi bi-sunrise fs-1"}
                          ></i>
                        </div>
                        <h5
                          className="fw-bold mb-1"
                          style={{ color: config.titleColor || "#5b4636" }}
                        >
                          {config.title || "Cuidado Día"}
                        </h5>
                        <small className="text-muted d-block mb-3">
                          {config.subtitle || "8:00–17:00 • sin contrato • pago por día"}
                        </small>
                      </div>

                      <p className="text-muted mb-3">
                        {config.description ||
                          "Programa diurno para mantener actividad física, mental y social."}
                      </p>

                      <div className="d-flex gap-2 justify-content-center">
                        <Link to="/servicios/cuidado-dia" className="btn btn-primary">
                          Ver detalle
                        </Link>
                        <a
                          href={whatsappHref}
                          className={`btn btn-outline-cafe btn-whatsapp ${
                            !bloquepConfig.whatsappNumber ? "disabled" : ""
                          }`}
                          target="_blank"
                          rel="noopener"
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
                        Hogar geriátrico interno con cuidado integral 24/7,
                        habitaciones confortables, supervisión continua y actividades
                        para una vida tranquila y acompañada.
                      </p>

                      <div className="d-flex gap-2 justify-content-center">
                        <Link
                          to="/servicios/cuidado-permanente"
                          className="btn btn-primary"
                        >
                          Ver detalle
                        </Link>
                        <a
                          href={whatsappHref}
                          className={`btn btn-outline-cafe btn-whatsapp ${
                            !bloquepConfig.whatsappNumber ? "disabled" : ""
                          }`}
                          target="_blank"
                          rel="noopener"
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
                      <h6
                        className="text-uppercase fw-bold mb-2"
                        style={{ color: "#8C6A4A" }}
                      >
                        Diferencial
                      </h6>
                      <h5 className="card-title" style={{ color: "#5b4636" }}>
                        Envejecimiento activo
                      </h5>
                      <p className="card-text">
                        Fisioterapia y deportología (2×/sem), psicología (1×/sem) y
                        apoyo universitario.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card card-feature h-100">
                    <div className="card-body">
                      <h6
                        className="text-uppercase fw-bold mb-2"
                        style={{ color: "#8C6A4A" }}
                      >
                        Respeto
                      </h6>
                      <h5 className="card-title" style={{ color: "#5b4636" }}>
                        Cuidado con dignidad
                      </h5>
                      <p className="card-text">
                        Lenguaje profesional y trato humano. Adultos mayores, nunca
                        diminutivos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card card-feature h-100">
                    <div className="card-body">
                      <h6
                        className="text-uppercase fw-bold mb-2"
                        style={{ color: "#8C6A4A" }}
                      >
                        Cercanía
                      </h6>
                      <h5 className="card-title" style={{ color: "#5b4636" }}>
                        Comunicación diaria
                      </h5>
                      <p className="card-text">
                        Fotos y videos reales para las familias vía WhatsApp
                        institucional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "mapa":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <div className="row g-4 align-items-center">
                <div className="col-lg-6">
                  <h3 className="fw-bold mb-3" style={{ color: "#5b4636" }}>
                    {config.title || "Visítanos"}
                  </h3>
                  <p className="text-muted mb-4">
                    {config.description ||
                      "Coordina tu visita y conoce nuestras instalaciones."}
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <a
                      href={config.googleMapsUrl || "#"}
                      className={`btn btn-outline-primary ${
                        !config.googleMapsUrl ? "disabled" : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !config.googleMapsUrl && e.preventDefault()}
                    >
                      {config.buttonText1 || "Ver en Google Maps"}
                    </a>
                    <a
                      href={config.wazeUrl || "#"}
                      className={`btn btn-outline-secondary ${
                        !config.wazeUrl ? "disabled" : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !config.wazeUrl && e.preventDefault()}
                    >
                      {config.buttonText2 || "Abrir en Waze"}
                    </a>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="ratio ratio-16x9 rounded shadow overflow-hidden">
                    {config.embedUrl ? (
                      <iframe
                        src={config.embedUrl}
                        title="Mapa de ubicación"
                        aria-label="Mapa de ubicación"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light">
                        <p className="text-muted">Mapa no configurado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "valores":
        return (
          <section key={id} className="py-5" style={{ background: "#f8f5f1" }}>
            <div className="container">
              {/* Misión y Visión */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3" style={{ color: "#8C6A4A" }}>
                        <i className="bi bi-bullseye me-2"></i>Misión
                      </h5>
                      <p className="text-muted mb-0">
                        {config.mision || "Sin misión configurada."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3" style={{ color: "#8C6A4A" }}>
                        <i className="bi bi-eye-fill me-2"></i>Visión
                      </h5>
                      <p className="text-muted mb-0">
                        {config.vision || "Sin visión configurada."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valores */}
              <h3 className="fw-bold text-center mb-4" style={{ color: "#5b4636" }}>
                {config.sectionTitle || "Nuestros valores"}
              </h3>
              <div className="row g-4 justify-content-center">
                {(config.valores || []).map((valor, idx) => (
                  <div key={idx} className="col-6 col-md-4 col-lg">
                    <div className="card border-0 shadow-sm rounded-4 text-center h-100">
                      <div className="card-body p-4">
                        <div className="fs-1 mb-3" style={{ color: "#8C6A4A" }}>
                          <i className={valor.icon || "bi bi-heart-fill"}></i>
                        </div>
                        <h6 className="fw-bold" style={{ color: "#5b4636" }}>
                          {valor.title}
                        </h6>
                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                          {valor.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {error && (
        <div className="container py-3">
          <div className="alert alert-warning mb-0">{error}</div>
        </div>
      )}

      {/* HERO / CAROUSEL */}
      <section className="hero-wrapper">
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="8000"
          data-bs-pause="hover"
          aria-label="Galería principal"
        >
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

          <div className="carousel-inner">
            <div className="carousel-item active">
              <picture className="hero-picture">
                <source
                  type="image/webp"
                  srcSet={`${URLROOT}web/ancianato_inicio-1280.webp`}
                />
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
                <source
                  type="image/webp"
                  srcSet={`${URLROOT}web/quienes-somos-1280.webp`}
                />
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

        {/* Overlay con datos del bloquep */}
        <div className="hero-overlay">
          <div className="glass">
            <span className="badge bg-light text-dark fw-semibold mb-3">
              {bloquepConfig.badgeText || " "}
            </span>

            <h1 className="hero-title display-5 display-md-4">
              {bloquepConfig.heroTitle || " "}
            </h1>

            <p className="mb-4 lead">{bloquepConfig.heroDescription || " "}</p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <a
                href={whatsappHref}
                className={`btn btn-outline-cafe btn-lg shadow btn-whatsapp ${
                  String(bloquepConfig.whatsappNumber || "").trim() ? "" : "disabled"
                }`}
                target="_blank"
                rel="noopener"
                aria-disabled={!String(bloquepConfig.whatsappNumber || "").trim()}
              >
                <i className="bi bi-whatsapp me-2"></i>
                {bloquepConfig.button2Text || " "}
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
                <i
                  className="bi bi-chevron-double-down fs-2"
                  style={{ color: "#8C6A4A" }}
                ></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RENDERIZAR SECCIONES DINÁMICAS */}
      {sections
        .filter((s) => s.type !== "bloquep")
        .map((section) => renderSection(section))}

      {/* GALERÍA */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#5b4636" }}>
              Así es nuestro hogar
            </h2>
            <p className="text-muted">
              Imágenes reales de actividades e instalaciones.
            </p>
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

      {/* CTA FINAL (HARDCODEADA - PENDIENTE DE MÓDULO) */}
      <section className="py-5" style={{ background: "#8C6A4A" }}>
        <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 text-white">
          <div>
            <h3 className="fw-bold mb-1">¿Listo para agendar una visita?</h3>
            <p className="mb-0">
              Escríbenos y te contamos disponibilidad para Cuidado Día o Cuidado
              Permanente.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link
              to="/contacto"
              className="btn btn-light btn-lg"
              style={{ color: "#8C6A4A" }}
            >
              Contacto
            </Link>

            <a
              href={whatsappHref}
              className={`btn btn-outline-light btn-lg btn-whatsapp ${
                String(bloquepConfig.whatsappNumber || "").trim() ? "" : "disabled"
              }`}
              target="_blank"
              rel="noopener"
              aria-disabled={!String(bloquepConfig.whatsappNumber || "").trim()}
            >
              <i className="bi bi-whatsapp me-2"></i> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
