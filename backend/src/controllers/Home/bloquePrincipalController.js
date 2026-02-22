import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "bloquep";

const DEFAULT_CONFIG = {
  badgeText: "",
  heroTitle: "",
  heroDescription: "",
  button2Text: "",
  whatsappNumber: "",
  pills: [],
  heroImages: [],
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

export const getBloquePrincipal = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getBloquePrincipal error:", error);
    return res.status(500).json({ message: "Error obteniendo BloquePrincipal" });
  }
};

export const updateBloquePrincipal = async (req, res) => {
  try {
    const {
      badgeText = "",
      heroTitle = "",
      heroDescription = "",
      button2Text = "",
      whatsappNumber = "",
      pills = [],
      heroImages = [],
    } = req.body || {};

    const cleanImages = Array.isArray(heroImages)
      ? heroImages
          .filter((img) => img && String(img.url || "").trim() !== "")
          .map((img) => ({
            url: String(img.url).trim(),
            alt: String(img.alt || "").trim(),
          }))
      : [];

    const config = {
      badgeText,
      heroTitle,
      heroDescription,
      button2Text,
      whatsappNumber: String(whatsappNumber).replace(/\D/g, ""),
      pills: Array.isArray(pills) ? pills.filter((p) => String(p).trim() !== "") : [],
      heroImages: cleanImages,
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 0, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateBloquePrincipal error:", error);
    return res.status(500).json({ message: "Error guardando BloquePrincipal" });
  }
};
