import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "equipo";

const DEFAULT_CONFIG = {
  sectionTitle: "Nuestro equipo humano",
  sectionSubtitle:
    "La fortaleza de nuestro hogar está en su gente. Contamos con un equipo interdisciplinario que combina conocimiento, vocación y sensibilidad humana.",
  members: [
    {
      name: "Nombre del miembro",
      role: "Cargo / Profesión",
      photoUrl: "",
    },
  ],
};

const getOrCreate = async () => {
  let doc = await PageConfig.findOne();
  if (!doc) doc = await PageConfig.create({ sections: [] });
  return doc;
};

/** GET /api/home-config/equipo */
export const getEquipo = async (req, res) => {
  try {
    const doc = await getOrCreate();
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getEquipo error:", error);
    return res.status(500).json({ message: "Error obteniendo Equipo" });
  }
};

/** PUT /api/home-config/equipo */
export const updateEquipo = async (req, res) => {
  try {
    const {
      sectionTitle = "",
      sectionSubtitle = "",
      members = [],
    } = req.body || {};

    const cleanMembers = Array.isArray(members)
      ? members
          .filter((m) => m && String(m.name || "").trim() !== "")
          .map((m) => ({
            name: String(m.name || "").trim(),
            role: String(m.role || "").trim(),
            photoUrl: String(m.photoUrl || "").trim(),
          }))
      : [];

    const config = {
      sectionTitle: String(sectionTitle).trim(),
      sectionSubtitle: String(sectionSubtitle).trim(),
      members: cleanMembers,
    };

    const doc = await getOrCreate();
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({ id: `${TYPE}-1`, type: TYPE, order: 7, config });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("updateEquipo error:", error);
    return res.status(500).json({ message: "Error guardando Equipo" });
  }
};
