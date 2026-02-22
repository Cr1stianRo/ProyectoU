import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "galeriahogar";

const DEFAULT_CONFIG = {
  title: "Así es nuestro hogar",
  subtitle: "Imágenes reales de actividades e instalaciones.",
  buttonText: "Ver más actividades",
  buttonLink: "/actividades",
  images: [],
};

const getOrCreate = async () => {
  let doc = await PageConfig.findOne();
  if (!doc) doc = await PageConfig.create({ sections: [] });
  return doc;
};

/** GET /api/home-config/galeriahogar */
export const getGaleriaHogar = async (req, res) => {
  try {
    const doc = await getOrCreate();
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getGaleriaHogar error:", error);
    return res.status(500).json({ message: "Error obteniendo Galería Hogar" });
  }
};

/** PUT /api/home-config/galeriahogar */
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

    const doc = await getOrCreate();
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
