import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config";

export default function HomeSettings() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    heroImageUrl: "",
    ctaText: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setForm({
        title: res.data.title || "",
        subtitle: res.data.subtitle || "",
        description: res.data.description || "",
        heroImageUrl: res.data.heroImageUrl || "",
        ctaText: res.data.ctaText || "",
      }))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      await axios.put(API_URL, form);
      setMsg("Guardado ✅");
    } catch {
      setError("No se pudo guardar ❌");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1>Home Settings</h1>

      {msg && <p>{msg}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="title" placeholder="Título" value={form.title} onChange={onChange} />
        <input name="subtitle" placeholder="Subtítulo" value={form.subtitle} onChange={onChange} />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={onChange}
          rows={4}
        />
        <input
          name="heroImageUrl"
          placeholder="URL imagen (opcional)"
          value={form.heroImageUrl}
          onChange={onChange}
        />
        <input name="ctaText" placeholder="Texto botón" value={form.ctaText} onChange={onChange} />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
