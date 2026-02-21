import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/valores";

const ICON_OPTIONS = [
  { value: "bi bi-heart-fill", label: "Corazón" },
  { value: "bi bi-people-fill", label: "Personas" },
  { value: "bi bi-shield-check", label: "Escudo" },
  { value: "bi bi-award-fill", label: "Premio" },
  { value: "bi bi-house-heart-fill", label: "Hogar" },
  { value: "bi bi-hand-thumbs-up-fill", label: "Pulgar" },
  { value: "bi bi-star-fill", label: "Estrella" },
  { value: "bi bi-emoji-smile-fill", label: "Sonrisa" },
  { value: "bi bi-brightness-high-fill", label: "Sol" },
  { value: "bi bi-gem", label: "Gema" },
];

const initialForm = {
  sectionTitle: "Nuestros valores",
  mision:
    "Brindar atención integral, cálida y profesional a los adultos mayores mediante servicios de cuidado permanente y cuidado día, asegurando bienestar físico, emocional y social. Promovemos un ambiente de dignidad, respeto y calidad humana que favorece la salud, la conexión social y la calidad de vida de nuestros residentes y sus familias.",
  vision:
    "Ser el hogar geriátrico referente en la ciudad de Pereira por la excelencia en la atención integral al adulto mayor, destacándonos por nuestro enfoque humano, la calidad de nuestros servicios y la constante innovación en programas de cuidado, bienestar y envejecimiento activo.",
  valores: [
    {
      title: "Dignidad",
      description: "Tratamos a cada residente con el máximo respeto.",
      icon: "bi bi-shield-check",
    },
    {
      title: "Amor y calidad humana",
      description: "Somos más que cuidadores; somos compañía y apoyo.",
      icon: "bi bi-heart-fill",
    },
    {
      title: "Compromiso",
      description: "Trabajamos con vocación y responsabilidad.",
      icon: "bi bi-hand-thumbs-up-fill",
    },
    {
      title: "Profesionalismo",
      description:
        "Nuestro equipo está preparado para brindar la mejor atención.",
      icon: "bi bi-award-fill",
    },
    {
      title: "Calidez",
      description:
        "Nuestras instalaciones y nuestro trato generan un verdadero hogar.",
      icon: "bi bi-house-heart-fill",
    },
  ],
};

export default function ValoresConfig() {
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

  const setValor = (index, field, value) => {
    setForm((prev) => {
      const valores = [...(prev.valores || [])];
      valores[index] = { ...valores[index], [field]: value };
      return { ...prev, valores };
    });
  };

  const addValor = () => {
    setForm((prev) => ({
      ...prev,
      valores: [
        ...(prev.valores || []),
        { title: "", description: "", icon: "bi bi-heart-fill" },
      ],
    }));
  };

  const removeValor = (index) => {
    setForm((prev) => {
      const valores = [...(prev.valores || [])];
      valores.splice(index, 1);
      return { ...prev, valores };
    });
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Nuestros Valores</h2>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <label className="form-label">Título de la sección</label>
              <input
                className="form-control mb-3"
                value={form.sectionTitle || ""}
                onChange={(e) => setField("sectionTitle", e.target.value)}
                placeholder="Ej: Nuestros valores"
              />

              <label className="form-label">Misión</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={form.mision || ""}
                onChange={(e) => setField("mision", e.target.value)}
                placeholder="Misión de la institución..."
              />

              <label className="form-label">Visión</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={form.vision || ""}
                onChange={(e) => setField("vision", e.target.value)}
                placeholder="Visión de la institución..."
              />

              <hr className="my-3" />

              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label mb-0 fw-bold">Valores</label>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={addValor}
                  type="button"
                >
                  + Añadir valor
                </button>
              </div>

              <div className="mt-2 d-grid gap-3">
                {(form.valores || []).map((valor, idx) => (
                  <div
                    key={idx}
                    className="card border rounded-3 p-3 bg-light"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted fw-bold">
                        Valor #{idx + 1}
                      </small>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => removeValor(idx)}
                      >
                        ✕
                      </button>
                    </div>

                    <input
                      className="form-control mb-2"
                      value={valor.title || ""}
                      onChange={(e) => setValor(idx, "title", e.target.value)}
                      placeholder="Nombre del valor"
                    />

                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      value={valor.description || ""}
                      onChange={(e) =>
                        setValor(idx, "description", e.target.value)
                      }
                      placeholder="Descripción del valor"
                    />

                    <select
                      className="form-select"
                      value={valor.icon || "bi bi-heart-fill"}
                      onChange={(e) => setValor(idx, "icon", e.target.value)}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
          {/* Misión y Visión preview */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{ background: "#f8f5f1" }}
                  >
                    <h5
                      className="fw-bold mb-2"
                      style={{ color: "#8C6A4A" }}
                    >
                      <i className="bi bi-bullseye me-2"></i>Misión
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      {form.mision || "Sin misión configurada"}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{ background: "#f8f5f1" }}
                  >
                    <h5
                      className="fw-bold mb-2"
                      style={{ color: "#8C6A4A" }}
                    >
                      <i className="bi bi-eye-fill me-2"></i>Visión
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      {form.vision || "Sin visión configurada"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Valores preview */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h3
                className="fw-bold text-center mb-4"
                style={{ color: "#5b4636" }}
              >
                {form.sectionTitle || "Nuestros valores"}
              </h3>

              <div className="row g-3">
                {(form.valores || []).map((valor, idx) => (
                  <div key={idx} className="col-md-6 col-lg-4">
                    <div className="text-center p-3 rounded-3 h-100"
                      style={{ background: "#f8f5f1" }}
                    >
                      <div
                        className="fs-2 mb-2"
                        style={{ color: "#8C6A4A" }}
                      >
                        <i className={valor.icon || "bi bi-heart-fill"}></i>
                      </div>
                      <h6 className="fw-bold" style={{ color: "#5b4636" }}>
                        {valor.title || "Sin título"}
                      </h6>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {valor.description || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
