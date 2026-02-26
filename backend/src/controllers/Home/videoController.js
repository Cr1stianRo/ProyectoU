import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "video";

// Configuración inicial vacía: el usuario completará los datos desde el editor
const DEFAULT_CONFIG = {
  sectionTitle: "",
  sectionSubtitle: "",
  youtubeUrl: "",
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

export const getVideo = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getVideo error:", error);
    return res.status(500).json({ message: "Error obteniendo Video" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const {
      sectionTitle = "",
      sectionSubtitle = "",
      youtubeUrl = "",
    } = req.body || {};

    const config = {
      sectionTitle: String(sectionTitle).trim(),
      sectionSubtitle: String(sectionSubtitle).trim(),
      youtubeUrl: String(youtubeUrl).trim(),
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 8, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateVideo error:", error);
    return res.status(500).json({ message: "Error guardando Video" });
  }
};
