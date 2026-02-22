import PageConfig from "../../models/Home/PageConfig.js";

const defaultSections = [
  {
    id: "bloquep-1",
    type: "bloquep",
    order: 0,
    config: {
      badgeText: "",
      heroTitle: "",
      heroDescription: "",
      button2Text: "",
      whatsappNumber: "",
      pills: [],
    },
  },
  {
    id: "carrusel-1",
    type: "carrusel",
    order: 1,
    config: { slides: [] },
  },
  {
    id: "cuidadod-1",
    type: "cuidadod",
    order: 2,
    config: {
      iconClass: "bi bi-sunrise",
      iconColor: "#8C6A4A",
      title: "Cuidado Día",
      titleColor: "#5b4636",
      subtitle: "8:00–17:00 • sin contrato • pago por día",
      description:
        "Programa diurno para mantener actividad física, mental y social, con alimentación y acompañamiento profesional en un entorno seguro.",
    },
  },
];

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: defaultSections });
  return doc;
};

export const getPage = async (req, res) => {
  try {
    if (!req.userId) return res.json({ sections: [] });
    const doc = await getOrCreate(req.userId);
    const sorted = [...doc.sections].sort((a, b) => a.order - b.order);
    return res.json({ sections: sorted });
  } catch (err) {
    return res.status(500).json({ message: "Error obteniendo PageConfig", error: err.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { sections } = req.body || {};
    if (!Array.isArray(sections)) {
      return res.status(400).json({ message: "sections debe ser un array" });
    }
    const doc = await PageConfig.findOneAndUpdate(
      { userId: req.userId },
      { sections },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Error guardando PageConfig", error: err.message });
  }
};
