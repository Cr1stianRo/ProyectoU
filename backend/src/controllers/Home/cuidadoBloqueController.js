import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "cuidadod";

const DEFAULT_CONFIG = {
  iconClass: "bi bi-sunrise",
  iconColor: "#8C6A4A",
  title: "Cuidado Día",
  titleColor: "#5b4636",
  subtitle: "8:00–17:00 • sin contrato • pago por día",
  description:
    "Programa diurno para mantener actividad física, mental y social, con alimentación y acompañamiento profesional en un entorno seguro.",
};

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

export const getCuidadoDia = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getCuidadoDia error:", error);
    return res.status(500).json({ message: "Error obteniendo CuidadoDia" });
  }
};

export const updateCuidadoDia = async (req, res) => {
  try {
    const {
      iconClass = DEFAULT_CONFIG.iconClass,
      iconColor = DEFAULT_CONFIG.iconColor,
      title = DEFAULT_CONFIG.title,
      titleColor = DEFAULT_CONFIG.titleColor,
      subtitle = DEFAULT_CONFIG.subtitle,
      description = DEFAULT_CONFIG.description,
    } = req.body || {};

    const config = {
      iconClass: String(iconClass).trim(),
      iconColor: hexColorRegex.test(iconColor) ? iconColor : DEFAULT_CONFIG.iconColor,
      title: String(title).trim(),
      titleColor: hexColorRegex.test(titleColor) ? titleColor : DEFAULT_CONFIG.titleColor,
      subtitle: String(subtitle).trim(),
      description: String(description).trim(),
    };

    const doc = await getOrCreate(req.userId);
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 2, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateCuidadoDia error:", error);
    return res.status(500).json({ message: "Error guardando CuidadoDia" });
  }
};
