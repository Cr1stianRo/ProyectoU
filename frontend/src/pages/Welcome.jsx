// Página de bienvenida / landing del gestor de contenidos.
// Diseño inmersivo full-screen con animaciones, partículas y secciones scrollables.
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

/* ── CSS completo ── */
const css = `
/* =============================================
   WELCOME — Landing inmersiva
   ============================================= */

/* Reset scroll suave */
.welcome-page { scroll-behavior: smooth; }

/* ---- HERO FULL SCREEN ---- */
.wlc-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: "Poppins", system-ui, sans-serif;
  background: linear-gradient(160deg, #1a0f08 0%, #3d2b1f 25%, #5b4636 50%, #8C6A4A 75%, #b8956a 100%);
}

/* Malla animada de fondo */
.wlc-hero::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridPulse 8s ease-in-out infinite;
  z-index: 0;
}
@keyframes gridPulse {
  0%,100% { opacity: .4; }
  50% { opacity: .7; }
}

/* Partículas brillantes */
.wlc-particles {
  position: absolute; inset: 0;
  overflow: hidden; z-index: 0;
  pointer-events: none;
}
.wlc-particle {
  position: absolute;
  width: 3px; height: 3px;
  background: rgba(232,201,166,.6);
  border-radius: 50%;
  animation: particleRise linear infinite;
}
@keyframes particleRise {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

/* Orbes gigantes */
.wlc-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}
.wlc-orb--1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(232,201,166,.2), transparent 70%);
  top: -20%; left: -15%;
  animation: orbDrift 20s ease-in-out infinite;
}
.wlc-orb--2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(199,159,116,.18), transparent 70%);
  bottom: -15%; right: -10%;
  animation: orbDrift 16s ease-in-out infinite reverse;
}
.wlc-orb--3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,.1), transparent 70%);
  top: 40%; left: 55%;
  animation: orbDrift 12s ease-in-out infinite 4s;
}
@keyframes orbDrift {
  0%,100% { transform: translate(0,0) scale(1); }
  25% { transform: translate(40px,-30px) scale(1.08); }
  50% { transform: translate(-20px,20px) scale(.95); }
  75% { transform: translate(25px,10px) scale(1.03); }
}

/* Contenido centrado */
.wlc-center {
  position: relative; z-index: 2;
  text-align: center;
  padding: 2rem 1.5rem;
  max-width: 820px; width: 100%;
}

/* Animación escalonada */
.wlc-anim { animation: wlcUp .9s cubic-bezier(.16,1,.3,1) both; }
.wlc-d1 { animation-delay: .1s; }
.wlc-d2 { animation-delay: .25s; }
.wlc-d3 { animation-delay: .4s; }
.wlc-d4 { animation-delay: .55s; }
.wlc-d5 { animation-delay: .7s; }
.wlc-d6 { animation-delay: .85s; }
.wlc-d7 { animation-delay: 1s; }
@keyframes wlcUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Icono principal animado */
.wlc-logo {
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 110px; height: 110px;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(255,255,255,.15), rgba(255,255,255,.05));
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,255,255,.2);
  margin-bottom: 2rem;
  position: relative;
  box-shadow: 0 8px 40px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.1);
}
.wlc-logo::after {
  content: "";
  position: absolute; inset: -4px;
  border-radius: 34px;
  background: conic-gradient(from 0deg, transparent 0%, rgba(232,201,166,.3) 25%, transparent 50%, rgba(199,159,116,.3) 75%, transparent 100%);
  animation: logoSpin 6s linear infinite;
  z-index: -1;
}
@keyframes logoSpin { to { transform: rotate(360deg); } }
.wlc-logo i {
  font-size: 3rem;
  background: linear-gradient(135deg, #f5e6d3, #e8c9a6);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}

/* Badge */
.wlc-badge {
  display: inline-flex; align-items: center; gap: .4rem;
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.85);
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: .5rem 1.5rem;
  border-radius: 999px;
  margin-bottom: 2rem;
}
.wlc-badge::before {
  content: "";
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(.7); }
}

/* Título gigante */
.wlc-title {
  font-size: clamp(2.8rem, 6.5vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.05;
  margin: 0 0 1.25rem;
  letter-spacing: -1px;
  text-wrap: balance;
}
.wlc-title em {
  font-style: normal;
  position: relative;
  background: linear-gradient(90deg, #f5e6d3, #e8c9a6, #c79f74);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.wlc-title em::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -.05em;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #e8c9a6, #c79f74);
  opacity: .5;
}

/* Subtítulo */
.wlc-sub {
  font-size: clamp(1.05rem, 2.5vw, 1.3rem);
  color: rgba(255,255,255,.6);
  max-width: 560px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}

/* Botones */
.wlc-btns {
  display: flex; gap: 1.25rem;
  justify-content: center; flex-wrap: wrap;
}
.wlc-btn {
  display: inline-flex; align-items: center; gap: .6rem;
  padding: 1rem 2.4rem;
  border-radius: 14px;
  font-weight: 700; font-size: 1.05rem;
  text-decoration: none !important;
  transition: all .3s cubic-bezier(.16,1,.3,1);
  cursor: pointer; border: none;
  position: relative; overflow: hidden;
}
.wlc-btn--main {
  background: linear-gradient(135deg, #fff 0%, #f5e6d3 100%);
  color: #3d2b1f;
  box-shadow: 0 6px 30px rgba(0,0,0,.2), 0 1px 0 rgba(255,255,255,.4) inset;
}
.wlc-btn--main::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(232,201,166,.4) 100%);
  opacity: 0;
  transition: opacity .3s;
}
.wlc-btn--main:hover::before { opacity: 1; }
.wlc-btn--main:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0,0,0,.3);
  color: #3d2b1f;
}

.wlc-btn--ghost {
  background: rgba(255,255,255,.06);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,.2);
  backdrop-filter: blur(8px);
}
.wlc-btn--ghost:hover {
  background: rgba(255,255,255,.15);
  border-color: rgba(255,255,255,.35);
  transform: translateY(-3px);
  color: #fff;
}

/* Scroll indicator */
.wlc-scroll {
  position: absolute; bottom: 2.5rem;
  left: 50%; transform: translateX(-50%);
  z-index: 2;
  display: flex; flex-direction: column;
  align-items: center; gap: .5rem;
  color: rgba(255,255,255,.35);
  font-size: .7rem; letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color .3s;
  text-decoration: none !important;
}
.wlc-scroll:hover { color: rgba(255,255,255,.6); }
.wlc-scroll-line {
  width: 1px; height: 40px;
  background: linear-gradient(to bottom, rgba(255,255,255,.4), transparent);
  animation: scrollBounce 2s ease-in-out infinite;
}
@keyframes scrollBounce {
  0%,100% { transform: scaleY(1); opacity: .5; }
  50% { transform: scaleY(.5); opacity: 1; }
}

/* ---- SECCIÓN FEATURES ---- */
.wlc-features {
  background: #faf7f4;
  padding: 6rem 1.5rem;
  font-family: "Poppins", system-ui, sans-serif;
}
.wlc-features-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}
.wlc-section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #8C6A4A, #b8956a);
  color: #fff;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: .4rem 1.2rem;
  border-radius: 999px;
  margin-bottom: 1.25rem;
}
.wlc-section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #3d2b1f;
  margin: 0 0 .75rem;
  letter-spacing: -.5px;
}
.wlc-section-sub {
  font-size: 1.1rem;
  color: #8C6A4A;
  max-width: 500px;
  margin: 0 auto 3.5rem;
}

/* Grid de cards */
.wlc-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
@media (max-width: 768px) {
  .wlc-cards { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
}

.wlc-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: left;
  border: 1px solid rgba(140,106,74,.08);
  box-shadow: 0 4px 24px rgba(91,70,54,.06);
  transition: all .35s cubic-bezier(.16,1,.3,1);
  position: relative;
  overflow: hidden;
}
.wlc-card::before {
  content: "";
  position: absolute; top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8C6A4A, #e8c9a6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .4s cubic-bezier(.16,1,.3,1);
}
.wlc-card:hover::before { transform: scaleX(1); }
.wlc-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(91,70,54,.12);
}

.wlc-card-icon {
  display: flex; align-items: center; justify-content: center;
  width: 60px; height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(140,106,74,.08), rgba(140,106,74,.04));
  margin-bottom: 1.5rem;
  transition: all .35s;
}
.wlc-card:hover .wlc-card-icon {
  background: linear-gradient(135deg, #8C6A4A, #b8956a);
}
.wlc-card-icon i {
  font-size: 1.6rem;
  color: #8C6A4A;
  transition: color .35s;
}
.wlc-card:hover .wlc-card-icon i { color: #fff; }

.wlc-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #3d2b1f;
  margin: 0 0 .6rem;
}
.wlc-card p {
  font-size: .92rem;
  color: #8C6A4A;
  line-height: 1.6;
  margin: 0;
}

/* ---- SECCIÓN STATS ---- */
.wlc-stats {
  background: linear-gradient(135deg, #5b4636, #8C6A4A);
  padding: 4.5rem 1.5rem;
  font-family: "Poppins", system-ui, sans-serif;
}
.wlc-stats-inner {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  text-align: center;
}
@media (max-width: 768px) {
  .wlc-stats-inner { grid-template-columns: repeat(2, 1fr); }
}

.wlc-stat-num {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: .4rem;
}
.wlc-stat-label {
  font-size: .85rem;
  color: rgba(255,255,255,.6);
  font-weight: 500;
}

/* ---- SECCIÓN CTA FINAL ---- */
.wlc-cta {
  background: #faf7f4;
  padding: 6rem 1.5rem;
  font-family: "Poppins", system-ui, sans-serif;
  text-align: center;
}
.wlc-cta-inner {
  max-width: 700px;
  margin: 0 auto;
}
.wlc-cta-box {
  background: linear-gradient(135deg, #3d2b1f 0%, #5b4636 50%, #8C6A4A 100%);
  border-radius: 28px;
  padding: 4rem 3rem;
  position: relative;
  overflow: hidden;
}
.wlc-cta-box::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 24px 24px;
}
.wlc-cta-box h2 {
  position: relative;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 1rem;
}
.wlc-cta-box p {
  position: relative;
  color: rgba(255,255,255,.6);
  font-size: 1.05rem;
  margin: 0 0 2rem;
}
.wlc-cta-box .wlc-btn { position: relative; }

/* ---- FOOTER ---- */
.wlc-footer {
  background: #1a0f08;
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: "Poppins", system-ui, sans-serif;
}
.wlc-footer p {
  color: rgba(255,255,255,.3);
  font-size: .8rem;
  margin: 0;
  letter-spacing: .5px;
}
.wlc-footer a {
  color: rgba(255,255,255,.5);
  text-decoration: none;
}
.wlc-footer a:hover { color: #e8c9a6; }

/* Animación de entrada en viewport */
.wlc-reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
}
.wlc-reveal.visible {
  opacity: 1; transform: translateY(0);
}
`;

const features = [
  {
    icon: "bi bi-palette2",
    title: "Diseño personalizado",
    desc: "Cambia colores, fuentes y estilos visuales para reflejar la identidad única de tu hogar.",
  },
  {
    icon: "bi bi-grid-1x2-fill",
    title: "Módulos arrastrables",
    desc: "Servicios, equipo, galería, video y más. Activa solo los que necesites.",
  },
  {
    icon: "bi bi-cloud-arrow-down-fill",
    title: "Exporta como sitio web",
    desc: "Descarga un ZIP con HTML y CSS listo para publicar en cualquier hosting.",
  },
  {
    icon: "bi bi-phone-fill",
    title: "100% responsive",
    desc: "Tu sitio se ve perfecto en celulares, tablets y computadores de escritorio.",
  },
  {
    icon: "bi bi-images",
    title: "Galería y carrusel",
    desc: "Sube fotos de tu hogar y crea presentaciones visuales impactantes.",
  },
  {
    icon: "bi bi-shield-check",
    title: "Panel seguro",
    desc: "Acceso protegido con autenticación JWT. Solo tú editas tu contenido.",
  },
];

const stats = [
  { num: "10+", label: "Módulos editables" },
  { num: "0", label: "Líneas de código necesarias" },
  { num: "100%", label: "Personalizable" },
  { num: "1 clic", label: "Para exportar" },
];

// Genera partículas aleatorias
function makeParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 6 + Math.random() * 10,
    delay: Math.random() * 8,
    opacity: .3 + Math.random() * .5,
  }));
}

export default function Welcome() {
  const [particles] = useState(() => makeParticles(30));
  const revealRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: .15 }
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="welcome-page">
      <style>{css}</style>

      {/* ======== HERO ======== */}
      <section className="wlc-hero">
        <div className="wlc-orb wlc-orb--1" />
        <div className="wlc-orb wlc-orb--2" />
        <div className="wlc-orb wlc-orb--3" />

        <div className="wlc-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="wlc-particle"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        <div className="wlc-center">
          <div className="wlc-anim wlc-d1">
            <div className="wlc-logo">
              <i className="bi bi-house-heart-fill" />
            </div>
          </div>

          <div className="wlc-badge wlc-anim wlc-d2">Plataforma activa</div>

          <h1 className="wlc-title wlc-anim wlc-d3">
            Construye la web ideal{"\n"}para tu <em>hogar geriátrico</em>
          </h1>

          <p className="wlc-sub wlc-anim wlc-d4">
            Edita contenido, sube imágenes y personaliza el diseño completo
            de tu sitio desde un panel visual e intuitivo — sin tocar una sola línea de código.
          </p>

          <div className="wlc-btns wlc-anim wlc-d5">
            <Link to="/login" className="wlc-btn wlc-btn--main">
              <i className="bi bi-box-arrow-in-right" />
              Iniciar Sesión
            </Link>
            <Link to="/register" className="wlc-btn wlc-btn--ghost">
              <i className="bi bi-person-plus-fill" />
              Crear Cuenta Gratis
            </Link>
          </div>
        </div>

        <a href="#features" className="wlc-scroll wlc-anim wlc-d7">
          <span>Descubre más</span>
          <div className="wlc-scroll-line" />
        </a>
      </section>

      {/* ======== FEATURES ======== */}
      <section className="wlc-features" id="features">
        <div className="wlc-features-inner">
          <div className="wlc-reveal" ref={addRevealRef}>
            <div className="wlc-section-badge">Funcionalidades</div>
            <h2 className="wlc-section-title">Todo lo que necesitas en un solo lugar</h2>
            <p className="wlc-section-sub">
              Herramientas poderosas diseñadas para que gestionar tu sitio sea simple y rápido.
            </p>
          </div>

          <div className="wlc-cards">
            {features.map((f, i) => (
              <div className="wlc-card wlc-reveal" ref={addRevealRef} key={i}
                style={{ transitionDelay: `${i * .1}s` }}>
                <div className="wlc-card-icon">
                  <i className={f.icon} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== STATS ======== */}
      <section className="wlc-stats">
        <div className="wlc-stats-inner">
          {stats.map((s, i) => (
            <div className="wlc-reveal" ref={addRevealRef} key={i}
              style={{ transitionDelay: `${i * .12}s` }}>
              <div className="wlc-stat-num">{s.num}</div>
              <div className="wlc-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== CTA FINAL ======== */}
      <section className="wlc-cta">
        <div className="wlc-cta-inner wlc-reveal" ref={addRevealRef}>
          <div className="wlc-cta-box">
            <h2>¿Listo para empezar?</h2>
            <p>Crea tu cuenta en segundos y comienza a diseñar la página web de tu hogar geriátrico.</p>
            <Link to="/register" className="wlc-btn wlc-btn--main">
              <i className="bi bi-rocket-takeoff-fill" />
              Crear mi cuenta ahora
            </Link>
          </div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="wlc-footer">
        <p>© {new Date().getFullYear()} Gestor de Contenidos — Proyecto Universitario</p>
      </footer>
    </div>
  );
}
