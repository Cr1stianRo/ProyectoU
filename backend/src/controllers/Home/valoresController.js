import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "valores";

const DEFAULT_CONFIG = {
  sectionTitle: "Nuestros valores",
  mision: "",
  vision: "",
  valores: [],
};

const getOrCreate = async () => {
  let doc = await PageConfig.findOne();
  if (!doc) doc = await PageConfig.create({ sections: [] });
  return doc;
};

/** GET /api/home-config/valores */
export const getValores = async (req, res) => {
  try {
    const doc = await getOrCreate();
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getValores error:", error);
    return res.status(500).json({ message: "Error obteniendo Valores" });
  }
};

/** PUT /api/home-config/valores */
export const updateValores = async (req, res) => {
  try {
    const {
      sectionTitle = "Nuestros valores",
      mision = "",
      vision = "",
      valores = [],
    } = req.body || {};

    const config = {
      sectionTitle: String(sectionTitle).trim(),
      mision: String(mision).trim(),
      vision: String(vision).trim(),
      valores: Array.isArray(valores)
        ? valores
            .filter((v) => v && String(v.title || "").trim())
            .map((v) => ({
              title: String(v.title || "").trim(),
              description: String(v.description || "").trim(),
              icon: String(v.icon || "bi bi-heart-fill").trim(),
            }))
        : [],
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
    console.error("updateValores error:", error);
    return res.status(500).json({ message: "Error guardando Valores" });
  }
};
