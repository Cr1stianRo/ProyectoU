// Controlador de la galería de imágenes del hogar.
// Administra título, subtítulo, botón y la lista de imágenes con caption.
import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "galeriahogar";

// Configuración inicial vacía: el usuario completará los datos desde el editor
const DEFAULT_CONFIG = {
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  images: [],
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

// Retorna la configuración de la galería del hogar
export const getGaleriaHogar = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getGaleriaHogar error:", error);
    return res.status(500).json({ message: "Error obteniendo Galería Hogar" });
  }
};

// Actualiza la galería: filtra imágenes sin URL y sanitiza url/alt/caption
export const updateGaleriaHogar = async (req, res) => {
  try {
    const {
      title = "",
      subtitle = "",
      buttonText = "",
      buttonLink = "",
      images = [],
    } = req.body || {};

    const cleanImages = Array.isArray(images)
      ? images
          .filter((img) => img && String(img.url || "").trim() !== "")
          .map((img) => ({
            url: String(img.url).trim(),
            alt: String(img.alt || "").trim(),
            caption: String(img.caption || "").trim(),
          }))
      : [];

    const config = {
      title: String(title).trim(),
      subtitle: String(subtitle).trim(),
      buttonText: String(buttonText).trim(),
      buttonLink: String(buttonLink).trim(),
      images: cleanImages,
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 5, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateGaleriaHogar error:", error);
    return res.status(500).json({ message: "Error guardando Galería Hogar" });
  }
};
