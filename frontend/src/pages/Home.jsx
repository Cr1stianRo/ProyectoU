import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config";

export default function Home() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setConfig(res.data))
      .catch(() => setError("No se pudo cargar el Home"));
  }, []);

  if (error) return <p>{error}</p>;
  if (!config) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{config.title}</h1>
      <h2>{config.subtitle}</h2>
      <p>{config.description}</p>

      {config.heroImageUrl ? (
        <img src={config.heroImageUrl} alt="Hero" style={{ maxWidth: 400 }} />
      ) : null}

      <button style={{ marginTop: 16 }}>{config.ctaText}</button>
    </div>
  );
}
