import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "sobrenosotros";

const DEFAULT_CONFIG = {
  sectionTitle: "Sobre nosotros",
  description:
    "Somos un hogar geriátrico dedicado a brindar una atención integral, humana y profesional a adultos mayores. Contamos con un equipo interdisciplinario altamente capacitado y con instalaciones diseñadas para ofrecer bienestar, seguridad y calidad de vida.",
  imageUrl: "",
  imageAlt: "Sobre nosotros",
  philosophyTitle: "Nuestra filosofía",
  philosophyDescription:
    "Entendemos que el bienestar de un adulto mayor va mucho más allá del cuidado físico. Nuestro propósito es preservar la autonomía, la alegría y la dignidad, fomentando el sentido de pertenencia y la participación social.",
  pillars: [
    {
      title: "Acompañamiento integral",
      description:
        "Nuestro modelo combina atención médica, terapéutica y emocional, asegurando un equilibrio entre cuerpo, mente y espíritu.",
      icon: "bi bi-heart-pulse",
    },
    {
      title: "Envejecimiento activo",
      description:
        "Fomentamos la participación diaria en actividades físicas, recreativas, artísticas y sociales que estimulan la mente y fortalecen los vínculos.",
      icon: "bi bi-people",
    },
    {
      title: "Apoyo familiar",
      description:
        "Compartimos avances, fotos y momentos diarios con familiares mediante comunicación constante en nuestros canales oficiales.",
      icon: "bi bi-house-heart",
    },
  ],
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

export const getSobreNosotros = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getSobreNosotros error:", error);
    return res.status(500).json({ message: "Error obteniendo Sobre Nosotros" });
  }
};

export const updateSobreNosotros = async (req, res) => {
  try {
    const {
      sectionTitle = "",
      description = "",
      imageUrl = "",
      imageAlt = "",
      philosophyTitle = "",
      philosophyDescription = "",
      pillars = [],
    } = req.body || {};

    const cleanPillars = Array.isArray(pillars)
      ? pillars
          .filter((p) => p && String(p.title || "").trim() !== "")
          .map((p) => ({
            title: String(p.title || "").trim(),
            description: String(p.description || "").trim(),
            icon: String(p.icon || "bi bi-star").trim(),
          }))
      : [];

    const config = {
      sectionTitle: String(sectionTitle).trim(),
      description: String(description).trim(),
      imageUrl: String(imageUrl).trim(),
      imageAlt: String(imageAlt).trim(),
      philosophyTitle: String(philosophyTitle).trim(),
      philosophyDescription: String(philosophyDescription).trim(),
      pillars: cleanPillars,
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 6, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateSobreNosotros error:", error);
    return res.status(500).json({ message: "Error guardando Sobre Nosotros" });
  }
};
