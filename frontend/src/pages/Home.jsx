// Página Home pública del hogar geriátrico.
// Carga las secciones dinámicamente desde la API y las renderiza según su tipo y orden.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const URLROOT = "/";

export default function Home() {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState("");

  // Carga todas las secciones de la página y las ordena por su campo "order"
  useEffect(() => {
    api
      .get("/home-config/page")
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

  // Genera el enlace de WhatsApp con mensaje predefinido
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

  // Si no hay imágenes configuradas, usa imágenes por defecto como fallback
  const heroImages = useMemo(() => {
    return Array.isArray(bloquepConfig.heroImages) && bloquepConfig.heroImages.length > 0
      ? bloquepConfig.heroImages.filter((img) => img.url)
      : [
          { url: `${URLROOT}web/ancianato_inicio-1280.webp`, alt: "Hogar geriátrico: vista principal" },
          { url: `${URLROOT}web/quienes-somos-1280.webp`, alt: "Familias y residentes compartiendo" },
        ];
  }, [bloquepConfig.heroImages]);

  // Función para renderizar cada sección según su tipo
  const renderSection = (section) => {
    const { type, config, id } = section;

    switch (type) {
      case "carrusel":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
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

      case "servicios":
        return (
          <section key={id} id="servicios-destacados" className="py-5 bg-light">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
                  {config.sectionTitle || "Servicios y comodidades"}
                </h2>
                <p className="text-muted">
                  {config.sectionSubtitle || "Modalidades claras para las necesidades de tu familia."}
                </p>
              </div>

              {/* Tarjetas de servicios dinámicas */}
              <div className="row g-4">
                {(config.services || []).map((svc, idx) => (
                  <div key={idx} className={`col-md-${(config.services || []).length === 1 ? "8 mx-auto" : "6"}`}>
                    <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
                      <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
                        <div>
                          <div className="mb-3" style={{ color: "var(--cafe)" }}>
                            <i className={`${svc.icon || "bi bi-star"} fs-1`}></i>
                          </div>
                          <h5 className="fw-bold mb-1" style={{ color: "var(--cafe-oscuro)" }}>
                            {svc.title}
                          </h5>
                          <small className="text-muted d-block mb-3">
                            {svc.subtitle}
                          </small>
                        </div>

                        <p className="text-muted mb-3">{svc.description}</p>

                        <div className="d-flex gap-2 justify-content-center">
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
                ))}
              </div>

              {/* Franja de confianza dinámica */}
              {(config.highlights || []).length > 0 && (
                <div className="row g-4 mt-4 justify-content-center text-center">
                  {(config.highlights || []).map((hl, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="card card-feature h-100">
                        <div className="card-body">
                          <h6 className="text-uppercase fw-bold mb-2" style={{ color: "var(--cafe)" }}>
                            {hl.badge}
                          </h6>
                          <h5 className="card-title" style={{ color: "var(--cafe-oscuro)" }}>
                            {hl.title}
                          </h5>
                          <p className="card-text">{hl.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case "mapa":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <div className="row g-4 align-items-center">
                <div className="col-lg-6">
                  <h3 className="fw-bold mb-3" style={{ color: "var(--cafe-oscuro)" }}>
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
          <section key={id} className="py-5" style={{ background: "var(--section-bg)" }}>
            <div className="container">
              {/* Misión y Visión */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3" style={{ color: "var(--cafe)" }}>
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
                      <h5 className="fw-bold mb-3" style={{ color: "var(--cafe)" }}>
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
              <h3 className="fw-bold text-center mb-4" style={{ color: "var(--cafe-oscuro)" }}>
                {config.sectionTitle || "Nuestros valores"}
              </h3>
              <div className="row g-4 justify-content-center">
                {(config.valores || []).map((valor, idx) => (
                  <div key={idx} className="col-6 col-md-4 col-lg">
                    <div className="card border-0 shadow-sm rounded-4 text-center h-100">
                      <div className="card-body p-4">
                        <div className="fs-1 mb-3" style={{ color: "var(--cafe)" }}>
                          <i className={valor.icon || "bi bi-heart-fill"}></i>
                        </div>
                        <h6 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
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

      case "galeriahogar":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
                  {config.title || "Así es nuestro hogar"}
                </h2>
                <p className="text-muted">
                  {config.subtitle || "Imágenes reales de actividades e instalaciones."}
                </p>
              </div>

              {config.images && config.images.length > 0 ? (
                <div className="row g-3">
                  {config.images.map((img, idx) => (
                    <div className="col-6 col-lg-3" key={idx}>
                      <div className="position-relative rounded overflow-hidden shadow-sm"
                        style={{ aspectRatio: "3/2" }}>
                        <img
                          className="w-100 h-100"
                          src={img.url}
                          alt={img.alt || "Galería"}
                          loading="lazy"
                          style={{ objectFit: "cover", display: "block" }}
                        />
                        {img.caption && (
                          <div className="position-absolute bottom-0 start-0 end-0 text-white text-center py-1"
                            style={{
                              background: "linear-gradient(transparent, rgba(0,0,0,.6))",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}>
                            {img.caption}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No hay imágenes disponibles</p>
              )}

            </div>
          </section>
        );

      case "sobrenosotros":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <h2 className="fw-bold mb-4" style={{ color: "var(--cafe-oscuro)" }}>
                {config.sectionTitle || "Sobre nosotros"}
              </h2>

              <div className="row g-4 align-items-center mb-5">
                <div className={config.imageUrl ? "col-lg-7" : "col-12"}>
                  <p className="text-muted" style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                    {config.description || "Sin descripción."}
                  </p>
                </div>
                {config.imageUrl && (
                  <div className="col-lg-5">
                    <img
                      src={config.imageUrl}
                      alt={config.imageAlt || "Sobre nosotros"}
                      className="w-100 rounded-4 shadow"
                      style={{ objectFit: "cover", maxHeight: 320 }}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {config.philosophyTitle && (
                <div className="text-center mb-4">
                  <h3 className="fw-bold" style={{ color: "var(--cafe)" }}>
                    {config.philosophyTitle}
                  </h3>
                  <p className="text-muted mx-auto" style={{ maxWidth: 700 }}>
                    {config.philosophyDescription}
                  </p>
                </div>
              )}

              {(config.pillars || []).length > 0 && (
                <div className="row g-4 justify-content-center">
                  {config.pillars.map((p, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="card border-0 shadow-sm rounded-4 text-center h-100">
                        <div className="card-body p-4">
                          <div className="fs-1 mb-3" style={{ color: "var(--cafe)" }}>
                            <i className={p.icon || "bi bi-star"}></i>
                          </div>
                          <h6 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>{p.title}</h6>
                          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>{p.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case "equipo":
        return (
          <section key={id} className="py-5" style={{ background: "var(--section-bg)" }}>
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
                  {config.sectionTitle || "Nuestro equipo humano"}
                </h2>
                <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
                  {config.sectionSubtitle}
                </p>
              </div>

              <div className="row g-4 justify-content-center">
                {(config.members || []).map((m, idx) => (
                  <div key={idx} className="col-6 col-md-4 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 text-center h-100">
                      <div className="card-body p-4">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="rounded-circle shadow mb-3"
                            style={{ width: 100, height: 100, objectFit: "cover" }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: 100, height: 100 }}
                          >
                            <i className="bi bi-person fs-1 text-muted"></i>
                          </div>
                        )}
                        <h6 className="fw-bold mb-1" style={{ color: "var(--cafe-oscuro)" }}>{m.name}</h6>
                        <small className="text-muted">{m.role}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "video":
        return (
          <section key={id} className="py-5">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
                  {config.sectionTitle || "Conoce más sobre nosotros"}
                </h2>
                <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
                  {config.sectionSubtitle}
                </p>
              </div>

              {config.youtubeUrl ? (
                <div className="mx-auto" style={{ maxWidth: 800 }}>
                  <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow">
                    {/* Convierte cualquier formato de URL de YouTube a embed */}
                    <iframe
                      src={(() => {
                        const url = config.youtubeUrl;
                        if (url.includes("/embed/")) return url;
                        const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                        if (short) return `https://www.youtube.com/embed/${short[1]}`;
                        const full = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
                        if (full) return `https://www.youtube.com/embed/${full[1]}`;
                        return url;
                      })()}
                      title="Video institucional"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">No hay video configurado.</p>
              )}
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
          {heroImages.length > 1 && (
            <div className="carousel-indicators">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide-to={idx}
                  className={idx === 0 ? "active" : ""}
                  aria-current={idx === 0 ? "true" : undefined}
                  aria-label={`Imagen ${idx + 1}`}
                ></button>
              ))}
            </div>
          )}

          <div className="carousel-inner">
            {heroImages.map((img, idx) => (
              <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                <img
                  className="hero-img"
                  src={img.url}
                  alt={img.alt || `Hero ${idx + 1}`}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  decoding="async"
                />
              </div>
            ))}
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
                  style={{ color: "var(--cafe)" }}
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

      {/* GALERÍA "Así es nuestro hogar" — ahora se renderiza dinámicamente desde el módulo galeriahogar */}

      {/* CTA FINAL (HARDCODEADA - PENDIENTE DE MÓDULO) */}
      <section className="py-5" style={{ background: "var(--cafe)" }}>
        <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 text-white">
          <div>
            <h3 className="fw-bold mb-1">¿Listo para agendar una visita?</h3>
            <p className="mb-0">
              Escríbenos y te contamos nuestros planes,
            </p>
          </div>

          <div className="d-flex gap-2">

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
      {/* Botón flotante para ir al Admin */}
      <Link
        to="/admin"
        className="btn shadow-lg d-flex align-items-center justify-content-center"
        title="Panel de administración"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "var(--cafe-oscuro)",
          color: "#fff",
          fontSize: "1.5rem",
          zIndex: 1050,
          transition: "transform 0.2s, background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "var(--cafe)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "var(--cafe-oscuro)";
        }}
      >
        <i className="bi bi-gear-fill"></i>
      </Link>
    </>
  );
}
