

//bloque 1

{/* Overlay con contenido centrado */}
        <div className="hero-overlay">
          <div className="glass">
            <span className="badge bg-light text-dark fw-semibold mb-3">
              Hogar geriátrico • Pereira
            </span>

            <h1 className="hero-title display-5 display-md-4">
              Casa de Campo Geriátrica El Edén
            </h1>

            <p className="mb-4 lead">
              Atención integral y digna para <strong>adultos mayores</strong> —{" "}
              <em>Cuidado Día (8:00–17:00)</em> y <em>Cuidado Permanente</em>, con
              programas de <strong>envejecimiento activo</strong>.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/servicios" className="btn btn-primary btn-lg shadow">
                Conocer servicios
              </Link>

              <a
                href="https://wa.me/573005047057?text=Hola%2C%20quiero%20agendar%20una%20visita%20y%20conocer%20los%20servicios."
                className="btn btn-outline-cafe btn-lg shadow btn-whatsapp"
                target="_blank"
                rel="noopener"
              >
                <i className="bi bi-whatsapp me-2"></i> Agendar visita por WhatsApp
              </a>
            </div>

            <div className="hero-pills mt-3">
              <span className="pill">Fisioterapia • 2/sem</span>
              <span className="pill">Deportología • 2/sem</span>
              <span className="pill">Psicología • 1/sem</span>
              <span className="pill">5 tiempos de alimentación</span>
            </div>

            {/* Flecha para seguir bajando */}
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