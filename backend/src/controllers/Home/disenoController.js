// Controlador del módulo de diseño y tema visual.
// Gestiona colores, tipografías, border-radius y tamaño de fuente del sitio.
import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "diseno";

// Tema visual por defecto (paleta café, fuente Poppins)
const DEFAULT_CONFIG = {
  primaryColor: "#8C6A4A",
  darkColor: "#5b4636",
  accentColor: "#E8D8C8",
  bgColor: "#ffffff",
  sectionBg: "#f8f5f1",
  font: "Poppins",
  headingFont: "",
  borderRadius: "22",
  fontSize: "16px",
  buttonRadius: "22",
};

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

// Retorna la configuración de diseño actual del usuario
export const getDiseno = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getDiseno error:", error);
    return res.status(500).json({ message: "Error obteniendo Diseño" });
  }
};

// Actualiza las variables de diseño del tema (colores, fuentes, radios)
export const updateDiseno = async (req, res) => {
  try {
    const {
      primaryColor = DEFAULT_CONFIG.primaryColor,
      darkColor = DEFAULT_CONFIG.darkColor,
      accentColor = DEFAULT_CONFIG.accentColor,
      bgColor = DEFAULT_CONFIG.bgColor,
      sectionBg = DEFAULT_CONFIG.sectionBg,
      font = DEFAULT_CONFIG.font,
      headingFont = DEFAULT_CONFIG.headingFont,
      borderRadius = DEFAULT_CONFIG.borderRadius,
      fontSize = DEFAULT_CONFIG.fontSize,
      buttonRadius = DEFAULT_CONFIG.buttonRadius,
    } = req.body || {};

    const config = {
      primaryColor: String(primaryColor).trim(),
      darkColor: String(darkColor).trim(),
      accentColor: String(accentColor).trim(),
      bgColor: String(bgColor).trim(),
      sectionBg: String(sectionBg).trim(),
      font: String(font).trim(),
      headingFont: String(headingFont || "").trim(),
      borderRadius: String(borderRadius).trim(),
      fontSize: String(fontSize).trim(),
      buttonRadius: String(buttonRadius).trim(),
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 99, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateDiseno error:", error);
    return res.status(500).json({ message: "Error guardando Diseño" });
  }
};
