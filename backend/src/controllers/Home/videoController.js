import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "video";

const DEFAULT_CONFIG = {
  sectionTitle: "Conoce más sobre nosotros",
  sectionSubtitle:
    "Te invitamos a descubrir nuestro entorno, actividades y la alegría que se vive cada día en nuestro hogar.",
  youtubeUrl: "",
};

const getOrCreate = async () => {
  let doc = await PageConfig.findOne();
  if (!doc) doc = await PageConfig.create({ sections: [] });
  return doc;
};

/** GET /api/home-config/video */
export const getVideo = async (req, res) => {
  try {
    const doc = await getOrCreate();
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getVideo error:", error);
    return res.status(500).json({ message: "Error obteniendo Video" });
  }
};

/** PUT /api/home-config/video */
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

    const doc = await getOrCreate();
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
