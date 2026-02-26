// Controlador de exportación del sitio completo como archivo ZIP.
// Genera index.html + CSS + imágenes descargadas a partir de la configuración del usuario.
import archiver from "archiver";
import https from "https";
import http from "http";
import PageConfig from "../../models/Home/PageConfig.js";

/* ─── helpers ─── */

const DEFAULT_DESIGN = {
  primaryColor: "#8C6A4A", darkColor: "#5b4636", accentColor: "#E8D8C8",
  bgColor: "#ffffff", sectionBg: "#f8f5f1", font: "Poppins",
  headingFont: "", borderRadius: "22", fontSize: "16px", buttonRadius: "22",
};

// Escapa caracteres HTML para prevenir inyección en el markup generado
function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

/** Download a URL into a Buffer (follows redirects once) */
function downloadBuffer(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { timeout: 8000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve);
      }
      if (res.statusCode !== 200) { resolve(null); return; }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", () => resolve(null));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

// Extrae la extensión de imagen de una URL; por defecto .jpg
function ext(url) {
  const m = url.match(/\.(jpe?g|png|webp|gif)/i);
  return m ? m[0].toLowerCase() : ".jpg";
}

// Convierte cualquier formato de URL de YouTube a su versión embed
function youtubeEmbed(url) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
}

/* ─── section HTML generators ─── */

function heroHtml(cfg, images, whatsHref) {
  const imgTags = images.map((img, i) =>
    `<div class="carousel-item${i === 0 ? " active" : ""}">
      <img class="hero-img" src="${esc(img.localPath || img.url)}" alt="${esc(img.alt || "Hero")}" loading="${i === 0 ? "eager" : "lazy"}">
    </div>`
  ).join("\n");

  const indicators = images.length > 1 ? `<div class="carousel-indicators">${images.map((_, i) =>
    `<button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}" aria-label="Imagen ${i + 1}"></button>`
  ).join("")}</div>` : "";

  const pills = (cfg.pills || []).filter(Boolean).map(p => `<span class="pill">${esc(p)}</span>`).join("");

  return `<section class="hero-wrapper">
  <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="8000">
    ${indicators}
    <div class="carousel-inner">${imgTags}</div>
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
  </div>
  <div class="hero-overlay">
    <div class="glass">
      <span class="badge bg-light text-dark fw-semibold mb-3">${esc(cfg.badgeText)}</span>
      <h1 class="hero-title display-5">${esc(cfg.heroTitle)}</h1>
      <p class="mb-4 lead">${esc(cfg.heroDescription)}</p>
      <div class="d-flex flex-wrap justify-content-center gap-3">
        <a href="${esc(whatsHref)}" class="btn btn-outline-cafe btn-lg shadow btn-whatsapp" target="_blank" rel="noopener">
          <i class="bi bi-whatsapp me-2"></i>${esc(cfg.button2Text || "WhatsApp")}
        </a>
      </div>
      ${pills ? `<div class="hero-pills mt-3">${pills}</div>` : ""}
      <div class="text-center mt-3"><a href="#servicios-destacados" class="text-decoration-none"><i class="bi bi-chevron-double-down fs-2" style="color:var(--cafe)"></i></a></div>
    </div>
  </div>
</section>`;
}

function carruselHtml(cfg) {
  const slides = cfg.slides || [];
  if (!slides.length) return "";
  const id = "galeriaCarousel";
  return `<section class="py-5">
  <div class="container">
    <div class="text-center mb-4"><h2 class="fw-bold" style="color:var(--cafe-oscuro)">Galería</h2><p class="text-muted">Imágenes de nuestras instalaciones.</p></div>
    <div id="${id}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">${slides.map((_, i) => `<button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}"></button>`).join("")}</div>
      <div class="carousel-inner">${slides.map((s, i) => `<div class="carousel-item${i === 0 ? " active" : ""}"><img src="${esc(s.localPath || s.imageUrl)}" class="d-block w-100 rounded" alt="${esc(s.altText || s.title || "Imagen")}" style="max-height:500px;object-fit:cover">${s.title || s.subtitle ? `<div class="carousel-caption d-none d-md-block">${s.title ? `<h5>${esc(s.title)}</h5>` : ""}${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}</div>` : ""}</div>`).join("")}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
      <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
    </div>
  </div>
</section>`;
}

function serviciosHtml(cfg, whatsHref) {
  const svcs = (cfg.services || []).map(svc => `<div class="col-md-${(cfg.services || []).length === 1 ? "8 mx-auto" : "6"}">
    <div class="card h-100 border-0 shadow-sm rounded-4 text-center"><div class="card-body p-4 d-flex flex-column align-items-center justify-content-between">
      <div><div class="mb-3" style="color:var(--cafe)"><i class="${esc(svc.icon || "bi bi-star")} fs-1"></i></div>
      <h5 class="fw-bold mb-1" style="color:var(--cafe-oscuro)">${esc(svc.title)}</h5>
      <small class="text-muted d-block mb-3">${esc(svc.subtitle)}</small></div>
      <p class="text-muted mb-3">${esc(svc.description)}</p>
      <a href="${esc(whatsHref)}" class="btn btn-outline-cafe btn-whatsapp" target="_blank" rel="noopener"><i class="bi bi-whatsapp me-1"></i> WhatsApp</a>
    </div></div></div>`).join("");

  const hls = (cfg.highlights || []).map(hl => `<div class="col-md-4"><div class="card card-feature h-100"><div class="card-body">
    <h6 class="text-uppercase fw-bold mb-2" style="color:var(--cafe)">${esc(hl.badge)}</h6>
    <h5 class="card-title" style="color:var(--cafe-oscuro)">${esc(hl.title)}</h5>
    <p class="card-text">${esc(hl.description)}</p></div></div></div>`).join("");

  return `<section id="servicios-destacados" class="py-5 bg-light"><div class="container">
  <div class="text-center mb-4"><h2 class="fw-bold" style="color:var(--cafe-oscuro)">${esc(cfg.sectionTitle || "Servicios y comodidades")}</h2>
  <p class="text-muted">${esc(cfg.sectionSubtitle || "Modalidades claras para las necesidades de tu familia.")}</p></div>
  <div class="row g-4">${svcs}</div>
  ${hls ? `<div class="row g-4 mt-4 justify-content-center text-center">${hls}</div>` : ""}
</div></section>`;
}

function valoresHtml(cfg) {
  const vals = (cfg.valores || []).map(v => `<div class="col-6 col-md-4 col-lg"><div class="card border-0 shadow-sm rounded-4 text-center h-100"><div class="card-body p-4">
    <div class="fs-1 mb-3" style="color:var(--cafe)"><i class="${esc(v.icon || "bi bi-heart-fill")}"></i></div>
    <h6 class="fw-bold" style="color:var(--cafe-oscuro)">${esc(v.title)}</h6>
    <p class="text-muted mb-0" style="font-size:.9rem">${esc(v.description)}</p></div></div></div>`).join("");

  return `<section class="py-5" style="background:var(--section-bg)"><div class="container">
  <div class="row g-4 mb-5">
    <div class="col-md-6"><div class="card border-0 shadow-sm rounded-4 h-100"><div class="card-body p-4">
      <h5 class="fw-bold mb-3" style="color:var(--cafe)"><i class="bi bi-bullseye me-2"></i>Misión</h5>
      <p class="text-muted mb-0">${esc(cfg.mision || "Sin misión configurada.")}</p></div></div></div>
    <div class="col-md-6"><div class="card border-0 shadow-sm rounded-4 h-100"><div class="card-body p-4">
      <h5 class="fw-bold mb-3" style="color:var(--cafe)"><i class="bi bi-eye-fill me-2"></i>Visión</h5>
      <p class="text-muted mb-0">${esc(cfg.vision || "Sin visión configurada.")}</p></div></div></div>
  </div>
  <h3 class="fw-bold text-center mb-4" style="color:var(--cafe-oscuro)">${esc(cfg.sectionTitle || "Nuestros valores")}</h3>
  <div class="row g-4 justify-content-center">${vals}</div>
</div></section>`;
}

function galeriaHtml(cfg) {
  const imgs = (cfg.images || []).map(img => `<div class="col-6 col-lg-3"><div class="position-relative rounded overflow-hidden shadow-sm" style="aspect-ratio:3/2">
    <img class="w-100 h-100" src="${esc(img.localPath || img.url)}" alt="${esc(img.alt || "Galería")}" loading="lazy" style="object-fit:cover;display:block">
    ${img.caption ? `<div class="position-absolute bottom-0 start-0 end-0 text-white text-center py-1" style="background:linear-gradient(transparent,rgba(0,0,0,.6));font-size:.75rem;font-weight:600">${esc(img.caption)}</div>` : ""}
  </div></div>`).join("");
  if (!imgs) return "";
  return `<section class="py-5"><div class="container">
  <div class="text-center mb-4"><h2 class="fw-bold" style="color:var(--cafe-oscuro)">${esc(cfg.title || "Así es nuestro hogar")}</h2>
  <p class="text-muted">${esc(cfg.subtitle || "Imágenes reales de actividades e instalaciones.")}</p></div>
  <div class="row g-3">${imgs}</div></div></section>`;
}

function sobreNosotrosHtml(cfg) {
  const pillars = (cfg.pillars || []).map(p => `<div class="col-md-4"><div class="card border-0 shadow-sm rounded-4 text-center h-100"><div class="card-body p-4">
    <div class="fs-1 mb-3" style="color:var(--cafe)"><i class="${esc(p.icon || "bi bi-star")}"></i></div>
    <h6 class="fw-bold" style="color:var(--cafe-oscuro)">${esc(p.title)}</h6>
    <p class="text-muted mb-0" style="font-size:.9rem">${esc(p.description)}</p></div></div></div>`).join("");

  return `<section class="py-5"><div class="container">
  <h2 class="fw-bold mb-4" style="color:var(--cafe-oscuro)">${esc(cfg.sectionTitle || "Sobre nosotros")}</h2>
  <div class="row g-4 align-items-center mb-5">
    <div class="${cfg.imageUrl ? "col-lg-7" : "col-12"}"><p class="text-muted" style="font-size:1.1rem;line-height:1.8">${esc(cfg.description || "Sin descripción.")}</p></div>
    ${cfg.imageUrl ? `<div class="col-lg-5"><img src="${esc(cfg.localImageUrl || cfg.imageUrl)}" alt="${esc(cfg.imageAlt || "Sobre nosotros")}" class="w-100 rounded-4 shadow" style="object-fit:cover;max-height:320px" loading="lazy"></div>` : ""}
  </div>
  ${cfg.philosophyTitle ? `<div class="text-center mb-4"><h3 class="fw-bold" style="color:var(--cafe)">${esc(cfg.philosophyTitle)}</h3><p class="text-muted mx-auto" style="max-width:700px">${esc(cfg.philosophyDescription)}</p></div>` : ""}
  ${pillars ? `<div class="row g-4 justify-content-center">${pillars}</div>` : ""}
</div></section>`;
}

function equipoHtml(cfg) {
  const members = (cfg.members || []).map(m => `<div class="col-6 col-md-4 col-lg-3"><div class="card border-0 shadow-sm rounded-4 text-center h-100"><div class="card-body p-4">
    ${m.photoUrl ? `<img src="${esc(m.localPhoto || m.photoUrl)}" alt="${esc(m.name)}" class="rounded-circle shadow mb-3" style="width:100px;height:100px;object-fit:cover" loading="lazy">` : `<div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style="width:100px;height:100px"><i class="bi bi-person fs-1 text-muted"></i></div>`}
    <h6 class="fw-bold mb-1" style="color:var(--cafe-oscuro)">${esc(m.name)}</h6>
    <small class="text-muted">${esc(m.role)}</small></div></div></div>`).join("");

  return `<section class="py-5" style="background:var(--section-bg)"><div class="container">
  <div class="text-center mb-4"><h2 class="fw-bold" style="color:var(--cafe-oscuro)">${esc(cfg.sectionTitle || "Nuestro equipo humano")}</h2>
  <p class="text-muted mx-auto" style="max-width:600px">${esc(cfg.sectionSubtitle || "")}</p></div>
  <div class="row g-4 justify-content-center">${members}</div></div></section>`;
}

function videoHtml(cfg) {
  const embed = youtubeEmbed(cfg.youtubeUrl);
  if (!embed) return "";
  return `<section class="py-5"><div class="container">
  <div class="text-center mb-4"><h2 class="fw-bold" style="color:var(--cafe-oscuro)">${esc(cfg.sectionTitle || "Conoce más sobre nosotros")}</h2>
  <p class="text-muted mx-auto" style="max-width:600px">${esc(cfg.sectionSubtitle || "")}</p></div>
  <div class="mx-auto" style="max-width:800px"><div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow">
    <iframe src="${esc(embed)}" title="Video institucional" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe>
  </div></div></div></section>`;
}

function mapaHtml(cfg) {
  return `<section class="py-5"><div class="container"><div class="row g-4 align-items-center">
  <div class="col-lg-6">
    <h3 class="fw-bold mb-3" style="color:var(--cafe-oscuro)">${esc(cfg.title || "Visítanos")}</h3>
    <p class="text-muted mb-4">${esc(cfg.description || "Coordina tu visita y conoce nuestras instalaciones.")}</p>
    <div class="d-flex flex-wrap gap-3">
      ${cfg.googleMapsUrl ? `<a href="${esc(cfg.googleMapsUrl)}" class="btn btn-outline-primary" target="_blank" rel="noopener">${esc(cfg.buttonText1 || "Ver en Google Maps")}</a>` : ""}
      ${cfg.wazeUrl ? `<a href="${esc(cfg.wazeUrl)}" class="btn btn-outline-secondary" target="_blank" rel="noopener">${esc(cfg.buttonText2 || "Abrir en Waze")}</a>` : ""}
    </div>
  </div>
  <div class="col-lg-6"><div class="ratio ratio-16x9 rounded shadow overflow-hidden">
    ${cfg.embedUrl ? `<iframe src="${esc(cfg.embedUrl)}" title="Mapa" style="border:0" allowfullscreen loading="lazy"></iframe>` : `<div class="d-flex align-items-center justify-content-center bg-light"><p class="text-muted">Mapa no configurado</p></div>`}
  </div></div></div></div></section>`;
}

function ctaHtml(whatsHref) {
  return `<section class="py-5" style="background:var(--cafe)">
  <div class="container d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 text-white">
    <div><h3 class="fw-bold mb-1">¿Listo para agendar una visita?</h3><p class="mb-0">Escríbenos y te contamos nuestros planes,</p></div>
    <a href="${esc(whatsHref)}" class="btn btn-outline-light btn-lg btn-whatsapp" target="_blank" rel="noopener"><i class="bi bi-whatsapp me-2"></i> WhatsApp</a>
  </div></section>`;
}

/* ─── render a section by type ─── */
function renderSection(section, whatsHref) {
  const c = section.config || {};
  switch (section.type) {
    case "carrusel": return carruselHtml(c);
    case "servicios": return serviciosHtml(c, whatsHref);
    case "valores": return valoresHtml(c);
    case "galeriahogar": return galeriaHtml(c);
    case "sobrenosotros": return sobreNosotrosHtml(c);
    case "equipo": return equipoHtml(c);
    case "video": return videoHtml(c);
    case "mapa": return mapaHtml(c);
    default: return "";
  }
}

/* ─── Recolecta URLs de imagen de todas las secciones para descargarlas ─── */
function collectImages(sections, bloquepCfg) {
  const list = []; // { url, key, section, field, index }
  // hero images
  (bloquepCfg.heroImages || []).forEach((img, i) => {
    if (img.url) list.push({ url: img.url, key: `hero-${i}`, section: "bloquep", field: "heroImages", index: i });
  });
  for (const s of sections) {
    const c = s.config || {};
    if (s.type === "carrusel") {
      (c.slides || []).forEach((sl, i) => {
        if (sl.imageUrl) list.push({ url: sl.imageUrl, key: `carrusel-${i}`, section: s.id, field: "slides", index: i });
      });
    }
    if (s.type === "galeriahogar") {
      (c.images || []).forEach((img, i) => {
        if (img.url) list.push({ url: img.url, key: `galeria-${i}`, section: s.id, field: "images", index: i });
      });
    }
    if (s.type === "sobrenosotros" && c.imageUrl) {
      list.push({ url: c.imageUrl, key: "sobrenosotros-img", section: s.id, field: "imageUrl" });
    }
    if (s.type === "equipo") {
      (c.members || []).forEach((m, i) => {
        if (m.photoUrl) list.push({ url: m.photoUrl, key: `equipo-${i}`, section: s.id, field: "members", index: i });
      });
    }
  }
  return list;
}

/* ─── Handler principal: genera y envía el ZIP con el sitio estático ─── */
export const exportSite = async (req, res) => {
  try {
    const doc = await PageConfig.findOne({ userId: req.userId });
    if (!doc) return res.status(404).json({ message: "No hay configuración" });

    const sections = [...doc.sections].sort((a, b) => (a.order || 0) - (b.order || 0));
    const designSec = sections.find(s => s.type === "diseno");
    const design = { ...DEFAULT_DESIGN, ...(designSec?.config || {}) };
    const bloquepSec = sections.find(s => s.type === "bloquep");
    const bloquepCfg = bloquepSec?.config || {};

    // WhatsApp link
    const waNum = String(bloquepCfg.whatsappNumber || "").replace(/\D/g, "");
    const whatsHref = waNum
      ? `https://wa.me/${waNum}?text=${encodeURIComponent("Hola, quiero agendar una visita y conocer los servicios.")}`
      : "#";

    // Descarga las imágenes en paralelo y las guarda en un Map para el ZIP
    const imgList = collectImages(sections, bloquepCfg);
    const imgBuffers = new Map();

    await Promise.all(imgList.map(async (item) => {
      const buf = await downloadBuffer(item.url);
      if (buf) {
        const filename = `assets/img/${item.key}${ext(item.url)}`;
        imgBuffers.set(item.key, { buf, filename });
        // Patch local path into config for HTML generation
        if (item.field === "heroImages") {
          bloquepCfg.heroImages[item.index].localPath = filename;
        } else {
          const sec = sections.find(s => s.id === item.section);
          if (!sec) return;
          const c = sec.config;
          if (item.field === "slides") c.slides[item.index].localPath = filename;
          else if (item.field === "images") c.images[item.index].localPath = filename;
          else if (item.field === "imageUrl") c.localImageUrl = filename;
          else if (item.field === "members") c.members[item.index].localPhoto = filename;
        }
      }
    }));

    // Default hero images if none
    const heroImages = (bloquepCfg.heroImages || []).filter(i => i.url);
    if (!heroImages.length) {
      heroImages.push({ url: "https://placehold.co/1280x720/E8D8C8/5b4636?text=Hogar+Geriatrico", alt: "Hogar geriátrico" });
    }

    // Genera el HTML de cada sección (excepto hero y diseño que se tratan aparte)
    const bodyParts = sections
      .filter(s => s.type !== "bloquep" && s.type !== "diseno")
      .map(s => renderSection(s, whatsHref))
      .filter(Boolean);

    const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(design.font)}:wght@400;600;700;800&display=swap`;
    const headingFontLink = design.headingFont
      ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(design.headingFont)}:wght@400;600;700;800&display=swap">`
      : "";

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(bloquepCfg.heroTitle || "Mi Hogar Geriátrico")}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link rel="stylesheet" href="${fontUrl}">
  ${headingFontLink}
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
${heroHtml(bloquepCfg, heroImages, whatsHref)}

${bodyParts.join("\n\n")}

${ctaHtml(whatsHref)}

<footer class="text-center py-4" style="background:var(--cafe-oscuro)">
  <small class="text-white-50">&copy; ${new Date().getFullYear()} ${esc(bloquepCfg.heroTitle || "Hogar Geriátrico")}. Todos los derechos reservados.</small>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><\/script>
</body>
</html>`;

    // Build CSS
    const css = `/* ═══ Variables del tema ═══ */
:root {
  --cafe: ${design.primaryColor};
  --cafe-oscuro: ${design.darkColor};
  --arena: ${design.accentColor};
  --bs-primary: ${design.primaryColor};
  --bs-body-bg: ${design.bgColor};
  --text-base: ${design.darkColor};
  --section-bg: ${design.sectionBg};
  --glass-radius: ${design.borderRadius}px;
}
html, body {
  font-family: "${design.font}", system-ui, sans-serif;
  background: var(--bs-body-bg);
  color: var(--text-base);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--cafe); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ═══ Hero ═══ */
.hero-wrapper { position: relative; min-height: 85vh; }
.carousel { --bs-carousel-transition-duration: .9s; }
.carousel-item { position: relative; overflow: hidden; height: 85vh; }
@media (max-width: 992px) { .carousel-item { height: 70vh; } }
.hero-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center;
}
.hero-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: clamp(1.25rem, 3vw, 2rem); text-align: center;
}
.hero-overlay::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(140,106,74,.06) 40%, rgba(140,106,74,.18) 100%);
}
.glass {
  position: relative; z-index: 2; max-width: min(920px, 98%);
  padding: clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 4vw, 2.5rem);
  border-radius: var(--glass-radius);
  color: var(--cafe-oscuro);
  background: radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,.92) 0%, rgba(255,255,255,.78) 100%);
  border: 1px solid rgba(140,106,74,.18);
  box-shadow: 0 18px 60px rgba(0,0,0,.14);
  backdrop-filter: blur(8px) saturate(130%);
}
.hero-title { font-weight: 800; line-height: 1.05; color: var(--cafe); letter-spacing: .3px; }
.glass p { color: var(--cafe-oscuro); font-size: 1.125rem; }
.hero-pills { display: flex; justify-content: center; flex-wrap: wrap; gap: .5rem; }
.pill {
  background: #fff; border: 1px solid rgba(140,106,74,.25);
  color: var(--cafe-oscuro); border-radius: 999px;
  padding: .5rem .85rem; font-weight: 600; font-size: .95rem;
}

/* ═══ Botones ═══ */
.btn-primary {
  --bs-btn-bg: var(--cafe); --bs-btn-border-color: var(--cafe);
  --bs-btn-hover-bg: ${design.darkColor}; --bs-btn-hover-border-color: ${design.darkColor};
}
.btn-outline-cafe {
  color: var(--cafe-oscuro) !important;
  border-color: rgba(140,106,74,.55) !important;
  background: transparent !important;
}
.btn-outline-cafe:hover { color: #fff !important; background: var(--cafe) !important; border-color: var(--cafe) !important; }
.btn-whatsapp:hover { background: #25D366 !important; border-color: #25D366 !important; color: #fff !important; }
.card-feature { border: 1px solid rgba(140,106,74,.15); border-radius: 1rem; box-shadow: 0 12px 30px rgba(0,0,0,.06); }
.bg-light { background-color: var(--section-bg) !important; }
@media (max-width: 576px) { .glass { backdrop-filter: blur(5px) saturate(125%); } }
`;

    // Empaqueta HTML, CSS e imágenes en un archivo ZIP y lo envía como respuesta
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=mi-sitio.zip");

    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.pipe(res);

    archive.append(html, { name: "index.html" });
    archive.append(css, { name: "assets/css/styles.css" });

    for (const [, { buf, filename }] of imgBuffers) {
      archive.append(buf, { name: filename });
    }

    await archive.finalize();
  } catch (err) {
    console.error("Export error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error exportando sitio", error: err.message });
    }
  }
};
