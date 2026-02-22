import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/equipo";
const UPLOAD_URL = "http://localhost:4000/api/upload";

const initialForm = {
  sectionTitle: "Nuestro equipo humano",
  sectionSubtitle: "",
  members: [],
};

export default function EquipoConfig() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const setMemberField = (idx, field, value) => {
    const updated = [...form.members];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm((prev) => ({ ...prev, members: updated }));
  };

  const addMember = () =>
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, { name: "", role: "", photoUrl: "" }],
    }));

  const removeMember = (idx) =>
    setForm((prev) => ({ ...prev, members: prev.members.filter((_, i) => i !== idx) }));

  const handlePhotoUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await axios.post(UPLOAD_URL, fd);
      setMemberField(idx, "photoUrl", res.data.url);
    } catch {
      alert("Error al subir la imagen");
    }
  };

  const onSave = async () => {
    try {
      await axios.put(API_URL, form);
      setShowSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch {
      alert("No se pudo guardar");
    }
  };

  return (
    <>
      {showSuccess && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn .3s ease",
          }}
        >
          <div
            style={{
              background: "#fff", borderRadius: "1.5rem", padding: "2.5rem 3rem",
              textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
              animation: "scaleIn .4s ease",
            }}
          >
            <div
              style={{
                width: 80, height: 80, borderRadius: "50%", background: "#d4edda",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.2rem",
              }}
            >
              <i className="bi bi-check-lg" style={{ fontSize: "2.5rem", color: "#198754" }}></i>
            </div>
            <h3 className="fw-bold mb-2" style={{ color: "#5b4636" }}>Guardado exitoso</h3>
            <p className="text-muted mb-0">Redirigiendo al panel de administración...</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div className="container py-4">
        <h2 className="mb-3">
          <i className="bi bi-people-fill me-2"></i>Nuestro Equipo Humano
        </h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="row g-4">
          {/* Editor */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <label className="form-label fw-bold">Título de la sección</label>
                <input
                  className="form-control mb-3"
                  value={form.sectionTitle}
                  onChange={(e) => setField("sectionTitle", e.target.value)}
                />

                <label className="form-label fw-bold">Subtítulo</label>
                <textarea
                  className="form-control mb-3"
                  rows={2}
                  value={form.sectionSubtitle}
                  onChange={(e) => setField("sectionSubtitle", e.target.value)}
                />

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">Miembros del equipo</label>
                  <button className="btn btn-sm btn-outline-primary" onClick={addMember}>
                    <i className="bi bi-plus-lg me-1"></i>Agregar miembro
                  </button>
                </div>

                {form.members.map((m, idx) => (
                  <div key={idx} className="border rounded-3 p-3 mb-3 position-relative">
                    <button
                      className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1"
                      onClick={() => removeMember(idx)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                    <div className="text-center mb-2">
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          className="rounded-circle shadow-sm"
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                          style={{ width: 80, height: 80 }}
                        >
                          <i className="bi bi-person fs-2 text-muted"></i>
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2 mb-2">
                      <input
                        className="form-control"
                        placeholder="URL de la foto"
                        value={m.photoUrl}
                        onChange={(e) => setMemberField(idx, "photoUrl", e.target.value)}
                      />
                      <label className="btn btn-outline-secondary mb-0" style={{ whiteSpace: "nowrap" }}>
                        <i className="bi bi-upload me-1"></i>Subir
                        <input type="file" accept="image/*" hidden onChange={(e) => handlePhotoUpload(e, idx)} />
                      </label>
                    </div>

                    <input
                      className="form-control mb-2"
                      placeholder="Nombre completo"
                      value={m.name}
                      onChange={(e) => setMemberField(idx, "name", e.target.value)}
                    />
                    <input
                      className="form-control"
                      placeholder="Cargo / Profesión"
                      value={m.role}
                      onChange={(e) => setMemberField(idx, "role", e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="card-footer bg-transparent border-0 p-3">
                <button className="btn btn-primary w-100" onClick={onSave}>
                  Guardar Equipo
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-6">
            <p className="text-muted small mb-2">
              <i className="bi bi-eye me-1"></i>Vista previa
            </p>
            <div className="border rounded-4 p-4 bg-white shadow-sm">
              <div className="text-center mb-4">
                <h3 className="fw-bold" style={{ color: "var(--cafe-oscuro)" }}>
                  {form.sectionTitle || "Nuestro equipo humano"}
                </h3>
                <p className="text-muted">{form.sectionSubtitle}</p>
              </div>

              <div className="row g-3 justify-content-center">
                {form.members.map((m, idx) => (
                  <div key={idx} className="col-6 col-md-4">
                    <div className="text-center p-3">
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          className="rounded-circle shadow mb-2"
                          style={{ width: 90, height: 90, objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-2"
                          style={{ width: 90, height: 90 }}
                        >
                          <i className="bi bi-person fs-1 text-muted"></i>
                        </div>
                      )}
                      <h6 className="fw-bold mb-0" style={{ color: "var(--cafe-oscuro)" }}>{m.name || "Nombre"}</h6>
                      <small className="text-muted">{m.role || "Cargo"}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
