// Controlador del carrusel de imágenes de la galería.
// Permite obtener y actualizar los slides con sus textos e imágenes.
import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "carrusel";

// Patrón getOrCreate: garantiza que siempre exista un documento para el usuario
const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

// Retorna los slides del carrusel o un array vacío si no hay configuración
export const getCarrusel = async (req, res) => {
  try {
    if (!req.userId) return res.json({ slides: [] });
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? { slides: [] });
  } catch (error) {
    console.error("getCarrusel error:", error);
    return res.status(500).json({ message: "Error obteniendo Carrusel" });
  }
};

// Actualiza los slides del carrusel: descarta entradas sin URL y sanitiza campos
export const updateCarrusel = async (req, res) => {
  try {
    const { slides = [] } = req.body || {};

    // Filtra slides sin imagen y normaliza los campos de texto
    const cleanSlides = Array.isArray(slides)
      ? slides
          .filter((s) => s && String(s.imageUrl || "").trim() !== "")
          .map((s) => ({
            imageUrl: String(s.imageUrl || "").trim(),
            title: String(s.title || "").trim(),
            subtitle: String(s.subtitle || "").trim(),
            altText: String(s.altText || "").trim(),
          }))
      : [];

    const config = { slides: cleanSlides };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 1, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateCarrusel error:", error);
    return res.status(500).json({ message: "Error guardando Carrusel" });
  }
};
