// Panel de administración principal.
// Muestra todos los módulos editables como tarjetas con acceso directo a cada editor.
// Incluye exportación del sitio como ZIP estático.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function AdminPanel() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Descarga un ZIP con el sitio exportado como HTML estático
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get("/home-config/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mi-sitio.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error al exportar el sitio. Verifica que tengas contenido configurado.");
    } finally {
      setExporting(false);
    }
  };
  // Definición de los módulos editables con su metadata para renderizar las tarjetas
  const modules = [
    {
      id: "bloquep",
      title: "Bloque Principal (Hero)",
      description:
        "Edita el bloque hero de la página principal. Configura el badge superior, título principal, descripción, botón de WhatsApp y las píldoras informativas que aparecen en el overlay del carousel.",
      icon: "bi bi-star-fill",
      color: "#8C6A4A",
      route: "/Bloque1Config",
      purpose: "Primera impresión del sitio y llamado a la acción principal",
    },
    {
      id: "carrusel",
      title: "Carrusel de Galería",
      description:
        "Administra el carrusel de imágenes de la galería. Agrega, edita o elimina slides con sus respectivas imágenes, títulos, subtítulos y textos alternativos. Las imágenes se muestran en formato carousel de Bootstrap.",
      icon: "bi bi-images",
      color: "#5b4636",
      route: "/Carrusel",
      purpose: "Mostrar imágenes de instalaciones y actividades",
    },
    {
      id: "servicios",
      title: "Servicios y comodidades",
      description:
        "Administra todos los servicios del hogar (Cuidado Día, Cuidado Permanente, etc.) y la franja de diferenciales. Agrega, edita o elimina servicios con sus íconos, descripciones y botones.",
      icon: "bi bi-grid-1x2-fill",
      color: "#FF8C00",
      route: "/ServiciosConfig",
      purpose: "Presentar servicios y diferenciales del hogar",
    },
    {
      id: "mapa",
      title: "Mapa y Ubicación",
      description:
        "Administra el mapa de ubicación del hogar geriátrico. Configura las URLs de Google Maps y Waze, la URL del mapa embebido, el título de la sección, descripción y textos de los botones de navegación.",
      icon: "bi bi-geo-alt-fill",
      color: "#dc3545",
      route: "/MapaConfig",
      purpose: "Facilitar la ubicación y navegación al lugar",
    },
    {
      id: "valores",
      title: "Nuestros Valores",
      description:
        "Administra la sección de misión, visión y valores institucionales. Configura cada valor con su título, descripción e ícono. Esta sección muestra la identidad y filosofía del hogar geriátrico.",
      icon: "bi bi-heart-fill",
      color: "#e74c3c",
      route: "/ValoresConfig",
      purpose: "Mostrar misión, visión y valores institucionales",
    },
    {
      id: "diseno",
      title: "Colores y Diseño",
      description:
        "Personaliza la apariencia de todo el sitio. Elige entre paletas predefinidas o crea tu combinación de colores. Cambia la fuente y el redondeo de las tarjetas. Vista previa en tiempo real.",
      icon: "bi bi-palette-fill",
      color: "#9B59B6",
      route: "/DisenoConfig",
      purpose: "Personalizar colores, fuente y estilo del sitio",
    },
    {
      id: "sobrenosotros",
      title: "Sobre Nosotros",
      description:
        "Administra la sección 'Sobre nosotros'. Edita la descripción de la organización, imagen representativa, filosofía institucional y los pilares fundamentales del hogar.",
      icon: "bi bi-info-circle-fill",
      color: "#3498db",
      route: "/SobreNosotrosConfig",
      purpose: "Describir la función y filosofía de la organización",
    },
    {
      id: "equipo",
      title: "Nuestro Equipo Humano",
      description:
        "Administra la sección del equipo de trabajo. Agrega miembros con su foto, nombre y cargo profesional. Se muestra en un grid de tarjetas con fotos circulares.",
      icon: "bi bi-people-fill",
      color: "#1abc9c",
      route: "/EquipoConfig",
      purpose: "Mostrar el equipo interdisciplinario del hogar",
    },
    {
      id: "video",
      title: "Conoce más sobre nosotros",
      description:
        "Administra la sección de video institucional. Pega un link de YouTube y se mostrará embebido en la página. Ideal para mostrar instalaciones, actividades y testimonios.",
      icon: "bi bi-play-btn-fill",
      color: "#e67e22",
      route: "/VideoConfig",
      purpose: "Video institucional de YouTube",
    },
    {
      id: "galeriahogar",
      title: "Así es nuestro hogar",
      description:
        "Administra la galería de fotos del hogar. Sube imágenes de actividades e instalaciones con captions descriptivos. Se muestran en un grid responsive de 4 columnas.",
      icon: "bi bi-camera-fill",
      color: "#2ecc71",
      route: "/GaleriaHogarConfig",
      purpose: "Galería de imágenes reales del hogar",
    },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="h3 mb-1 fw-bold" style={{ color: "#5b4636" }}>
                Panel de Administración
              </h1>
              <p className="text-muted mb-0">
                Gestiona los módulos editables de la página Home
              </p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              {user && <span className="text-muted me-2">{user.name}</span>}
              <Link to="/Home" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i>
                Volver al sitio
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div className="container py-5">
        <div className="row g-4">
          {modules.map((module) => (
            <div key={module.id} className="col-md-6 col-lg-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                {/* Header de la tarjeta con color */}
                <div
                  className="p-3 text-white"
                  style={{ background: module.color }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="fs-1">
                      <i className={module.icon}></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">{module.title}</h5>
                      <small className="opacity-75">{module.purpose}</small>
                    </div>
                  </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="card-body p-4 d-flex flex-column">
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-2 text-muted text-uppercase small">
                      Descripción del módulo
                    </h6>
                    <p className="text-muted mb-3">{module.description}</p>
                  </div>

                  {/* Botón de acción */}
                  <Link
                    to={module.route}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: module.color,
                      borderColor: module.color,
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                    Editar {module.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="fs-3 text-primary">
                    <i className="bi bi-info-circle-fill"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Información importante</h5>
                    <ul className="mb-0 text-muted">
                      <li className="mb-2">
                        Todos los cambios se guardan en una base de datos única (PageConfig)
                      </li>
                      <li className="mb-2">
                        Los módulos se renderizan dinámicamente según su orden configurado
                      </li>
                      <li className="mb-2">
                        Cada módulo tiene vista previa en tiempo real antes de guardar
                      </li>
                      <li>
                        Los datos se cargan desde{" "}
                        <code>/api/home-config/page</code> en la página Home
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="row g-3 mt-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <div className="fs-1 mb-2" style={{ color: "#8C6A4A" }}>
                <i className="bi bi-box-seam"></i>
              </div>
              <h6 className="mb-0 fw-bold">10 Módulos</h6>
              <small className="text-muted">Activos</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <div className="fs-1 mb-2" style={{ color: "#5b4636" }}>
                <i className="bi bi-layout-text-window-reverse"></i>
              </div>
              <h6 className="mb-0 fw-bold">1 Página</h6>
              <small className="text-muted">Home</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <div className="fs-1 mb-2 text-success">
                <i className="bi bi-database-check"></i>
              </div>
              <h6 className="mb-0 fw-bold">MongoDB</h6>
              <small className="text-muted">Base de datos</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <div className="fs-1 mb-2 text-primary">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <h6 className="mb-0 fw-bold">API REST</h6>
              <small className="text-muted">Backend</small>
            </div>
          </div>
        </div>

        {/* Exportar sitio */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="p-3 text-white" style={{ background: "linear-gradient(135deg, #2c3e50, #3498db)" }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="fs-1"><i className="bi bi-cloud-download-fill"></i></div>
                  <div>
                    <h5 className="mb-0 fw-bold">Exportar mi sitio</h5>
                    <small className="opacity-75">Descarga tu sitio listo para publicar</small>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <p className="text-muted mb-3">
                  Genera un archivo ZIP con tu sitio completo como HTML, CSS e imagenes.
                  El resultado es un sitio estatico funcional que puedes subir directamente a
                  <strong> Netlify</strong>, <strong>Vercel</strong>, <strong>GitHub Pages</strong> o cualquier hosting.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-light text-dark border"><i className="bi bi-file-earmark-code me-1"></i>index.html</span>
                  <span className="badge bg-light text-dark border"><i className="bi bi-filetype-css me-1"></i>styles.css</span>
                  <span className="badge bg-light text-dark border"><i className="bi bi-images me-1"></i>Imagenes</span>
                  <span className="badge bg-light text-dark border"><i className="bi bi-bootstrap me-1"></i>Bootstrap CDN</span>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="btn btn-lg text-white fw-semibold d-inline-flex align-items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #2c3e50, #3498db)", border: "none" }}
                >
                  {exporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Generando ZIP...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download"></i>
                      Descargar mi sitio (.zip)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
