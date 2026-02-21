import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/mapa";

const initialForm = {
  title: "",
  description: "",
  googleMapsUrl: "",
  wazeUrl: "",
  embedUrl: "",
  buttonText1: "",
  buttonText2: "",
};

export default function MapaConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

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

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Mapa y Ubicación</h2>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <label className="form-label">Título de la sección</label>
              <input
                className="form-control mb-3"
                value={form.title || ""}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Ej: Visítanos"
              />

              <label className="form-label">Descripción</label>
              <textarea
                className="form-control mb-3"
                rows={3}
                value={form.description || ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Ej: Coordina tu visita y conoce nuestras instalaciones."
              />

              <hr className="my-3" />

              <label className="form-label">URL de Google Maps</label>
              <input
                className="form-control mb-3"
                value={form.googleMapsUrl || ""}
                onChange={(e) => setField("googleMapsUrl", e.target.value)}
                placeholder="https://www.google.com/maps/search/?api=1&query=..."
              />

              <label className="form-label">URL de Waze</label>
              <input
                className="form-control mb-3"
                value={form.wazeUrl || ""}
                onChange={(e) => setField("wazeUrl", e.target.value)}
                placeholder="https://waze.com/ul?q=..."
              />

              <label className="form-label">URL del mapa embebido (iframe)</label>
              <input
                className="form-control mb-3"
                value={form.embedUrl || ""}
                onChange={(e) => setField("embedUrl", e.target.value)}
                placeholder="https://www.google.com/maps?q=...&output=embed"
              />

              <hr className="my-3" />

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Texto botón Google Maps</label>
                  <input
                    className="form-control"
                    value={form.buttonText1 || ""}
                    onChange={(e) => setField("buttonText1", e.target.value)}
                    placeholder="Ej: Ver en Google Maps"
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">Texto botón Waze</label>
                  <input
                    className="form-control"
                    value={form.buttonText2 || ""}
                    onChange={(e) => setField("buttonText2", e.target.value)}
                    placeholder="Ej: Abrir en Waze"
                  />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={onSave} type="button">
              Guardar
            </button>
          </div>
        </div>

        {/* DERECHA: preview */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-4">
              <div className="row g-4 align-items-center">
                <div className="col-lg-12">
                  <h3 className="fw-bold mb-3" style={{ color: "#5b4636" }}>
                    {form.title || "Título del mapa"}
                  </h3>
                  <p className="text-muted mb-4">
                    {form.description || "Descripción del mapa"}
                  </p>

                  <div className="d-flex flex-wrap gap-3 mb-4">
                    <a
                      href={form.googleMapsUrl || "#"}
                      className={`btn btn-outline-primary ${
                        !form.googleMapsUrl ? "disabled" : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !form.googleMapsUrl && e.preventDefault()}
                    >
                      {form.buttonText1 || "Ver en Google Maps"}
                    </a>
                    <a
                      href={form.wazeUrl || "#"}
                      className={`btn btn-outline-secondary ${
                        !form.wazeUrl ? "disabled" : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !form.wazeUrl && e.preventDefault()}
                    >
                      {form.buttonText2 || "Abrir en Waze"}
                    </a>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="ratio ratio-16x9 rounded shadow overflow-hidden">
                    {form.embedUrl ? (
                      <iframe
                        src={form.embedUrl}
                        title="Mapa de ubicación"
                        aria-label="Mapa de ubicación"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light">
                        <p className="text-muted">
                          Vista previa del mapa (ingresa la URL del iframe)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
