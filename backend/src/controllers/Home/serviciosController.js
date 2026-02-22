import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "servicios";

const DEFAULT_CONFIG = {
  sectionTitle: "Servicios y comodidades",
  sectionSubtitle: "Modalidades claras para las necesidades de tu familia.",
  services: [
    {
      icon: "bi bi-sunrise",
      title: "Cuidado Día",
      subtitle: "8:00–17:00 • sin contrato • pago por día",
      description:
        "Programa diurno para mantener actividad física, mental y social, con alimentación y acompañamiento profesional en un entorno seguro.",
      buttonText: "Ver detalle",
      buttonLink: "/servicios/cuidado-dia",
    },
    {
      icon: "bi bi-house-heart",
      title: "Cuidado Permanente",
      subtitle: "Residencia completa • 5 tiempos de comida",
      description:
        "Hogar geriátrico interno con cuidado integral 24/7, habitaciones confortables, supervisión continua y actividades para una vida tranquila y acompañada.",
      buttonText: "Ver detalle",
      buttonLink: "/servicios/cuidado-permanente",
    },
  ],
  highlights: [
    {
      badge: "Diferencial",
      title: "Envejecimiento activo",
      description:
        "Fisioterapia y deportología (2×/sem), psicología (1×/sem) y apoyo universitario.",
    },
    {
      badge: "Respeto",
      title: "Cuidado con dignidad",
      description:
        "Lenguaje profesional y trato humano. Adultos mayores, nunca diminutivos.",
    },
    {
      badge: "Cercanía",
      title: "Comunicación diaria",
      description:
        "Fotos y videos reales para las familias vía WhatsApp institucional.",
    },
  ],
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

export const getServicios = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getServicios error:", error);
    return res.status(500).json({ message: "Error obteniendo Servicios" });
  }
};

export const updateServicios = async (req, res) => {
  try {
    const {
      sectionTitle = "",
      sectionSubtitle = "",
      services = [],
      highlights = [],
    } = req.body || {};

    const cleanServices = Array.isArray(services)
      ? services
          .filter((s) => s && String(s.title || "").trim() !== "")
          .map((s) => ({
            icon: String(s.icon || "bi bi-star").trim(),
            title: String(s.title || "").trim(),
            subtitle: String(s.subtitle || "").trim(),
            description: String(s.description || "").trim(),
            buttonText: String(s.buttonText || "").trim(),
            buttonLink: String(s.buttonLink || "").trim(),
          }))
      : [];

    const cleanHighlights = Array.isArray(highlights)
      ? highlights
          .filter((h) => h && String(h.title || "").trim() !== "")
          .map((h) => ({
            badge: String(h.badge || "").trim(),
            title: String(h.title || "").trim(),
            description: String(h.description || "").trim(),
          }))
      : [];

    const config = {
      sectionTitle: String(sectionTitle).trim(),
      sectionSubtitle: String(sectionSubtitle).trim(),
      services: cleanServices,
      highlights: cleanHighlights,
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 2, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateServicios error:", error);
    return res.status(500).json({ message: "Error guardando Servicios" });
  }
};
