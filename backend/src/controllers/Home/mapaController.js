// Controlador de la sección de mapa/ubicación.
// Gestiona URLs de Google Maps, Waze, iframe embed y textos de botones.
import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "mapa";

const DEFAULT_CONFIG = {
  title: "",
  description: "",
  googleMapsUrl: "",
  wazeUrl: "",
  embedUrl: "",
  buttonText1: "",
  buttonText2: "",
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

// Retorna la configuración del mapa de ubicación
export const getMapa = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getMapa error:", error);
    return res.status(500).json({ message: "Error obteniendo Mapa" });
  }
};

// Actualiza la configuración de mapa y enlaces de navegación
export const updateMapa = async (req, res) => {
  try {
    const {
      title = "",
      description = "",
      googleMapsUrl = "",
      wazeUrl = "",
      embedUrl = "",
      buttonText1 = "",
      buttonText2 = "",
    } = req.body || {};

    const config = {
      title: String(title || "").trim(),
      description: String(description || "").trim(),
      googleMapsUrl: String(googleMapsUrl || "").trim(),
      wazeUrl: String(wazeUrl || "").trim(),
      embedUrl: String(embedUrl || "").trim(),
      buttonText1: String(buttonText1 || "").trim(),
      buttonText2: String(buttonText2 || "").trim(),
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 3, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateMapa error:", error);
    return res.status(500).json({ message: "Error guardando Mapa" });
  }
};
