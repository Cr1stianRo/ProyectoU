import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000/api/home-config/bloquep";

const initialForm = {
  badgeText: "",
  heroTitle: "",
  heroDescription:
    "",
  button2Text: "",
  whatsappNumber: "",
  pills: [
  ],
};





export default function HomeSettings() {
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

  const setPill = (index, value) => {
    setForm((prev) => {
      const pills = Array.isArray(prev.pills) ? [...prev.pills] : [];
      pills[index] = value;
      return { ...prev, pills };
    });
  };

  const addPill = () => {
    setForm((prev) => ({ ...prev, pills: [...(prev.pills || []), ""] }));
  };

  const removePill = (index) => {
    setForm((prev) => {
      const pills = [...(prev.pills || [])];
      pills.splice(index, 1);
      return { ...prev, pills };
    });
  };


  const whatsappHref = form.whatsappNumber
  ? `https://wa.me/${form.whatsappNumber}?text=Hola%2C%20quiero%20agendar%20una%20visita%20y%20conocer%20los%20servicios.`
  : "#";
  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Bloque Principal</h2>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <label className="form-label">Subtítulo arriba (badge)</label>
              <input
                className="form-control mb-3"
                value={form.badgeText || ""}
                onChange={(e) => setField("badgeText", e.target.value)}
                placeholder="Ej: Hogar geriátrico • Pereira"
              />

              <label className="form-label">Título principal</label>
              <input
                className="form-control mb-3"
                value={form.heroTitle || ""}
                onChange={(e) => setField("heroTitle", e.target.value)}
              />

              <label className="form-label">Descripción</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={form.heroDescription || ""}
                onChange={(e) => setField("heroDescription", e.target.value)}
              />

              <div className="row g-2 mt-2">



                <div className="col-6">
                  <label className="form-label">Título botón 2</label>
                  <input
                    className="form-control"
                    value={form.button2Text || ""}
                    onChange={(e) => setField("button2Text", e.target.value)}
                  />
                </div>



                <div className="col-6">
                  <label className="form-label">Número WhatsApp</label>
                    <input
                    className="form-control"
                    value={form.whatsappNumber || ""}
                    onChange={(e) => {
                        // deja solo dígitos
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        setField("whatsappNumber", onlyDigits);
                    }}
                    placeholder="Ej: 573005047057"
                    />
                    <small className="text-muted">
                    Solo números. Incluye el código del país (ej: 57).
                    </small>
                    
                </div>
              </div>

              <hr className="my-3" />

              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label mb-0">Píldoras</label>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={addPill}
                  type="button"
                >
                  + Añadir
                </button>
              </div>

              <div className="mt-2 d-grid gap-2">
                {(form.pills || []).map((pill, idx) => (
                  <div className="d-flex gap-2" key={idx}>
                    <input
                      className="form-control"
                      value={pill || ""}
                      onChange={(e) => setPill(idx, e.target.value)}
                      placeholder="Ej: Fisioterapia • 2/sem"
                    />
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => removePill(idx)}
                      aria-label="Eliminar pill"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
            </div>
            <button className="btn btn-primary" onClick={onSave} type="button">
    Guardar
  </button>
          </div>
        </div>

        

        {/* DERECHA: preview */}
        <div className="col-lg-7">
        <div className="position-relative rounded-4 overflow-hidden shadow">
            {/* Fondo del preview */}
            <div
            style={{
                height: 550, // ⬅️ más bajo que antes
                background:
                "linear-gradient(135deg, rgba(140,106,74,.25), rgba(255,255,255,.65))",
            }}
            />

            {/* Overlay con contenido centrado */}
            <div className="hero-overlay" style={{ position: "absolute", inset: 0 }}>
            <div
                style={{
                transform: "scale(0.9)",          // ⬅️ reduce tamaño del bloque
                transformOrigin: "center",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                }}
            >
                <div className="glass">
                <span className="badge bg-light text-dark fw-semibold mb-3">
                    {form.badgeText || " "}
                </span>

                <h1 className="hero-title display-5 display-md-4">
                    {form.heroTitle || " "}
                </h1>

                <p className="mb-4 lead">
                    {form.heroDescription || " "}
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">

                    <a
                    href={whatsappHref}
                    className="btn btn-outline-cafe btn-lg shadow btn-whatsapp"
                    target="_blank"
                    rel="noopener"
                    >
                    <i className="bi bi-whatsapp me-2"></i>
                    {form.button2Text || " "}
                    </a>
                </div>

                <div className="hero-pills mt-3">
                    {(form.pills || []).filter(Boolean).map((p, i) => (
                    <span className="pill" key={i}>
                        {p}
                    </span>
                    ))}
                </div>

               
                </div>

                
            </div>
            </div>
            
        </div>
        </div>


        {/* fin derecha */}
      </div>
    </div>
  );
}
