// Controlador de la sección "Equipo Humano".
// Administra los miembros del equipo con nombre, cargo y foto.
import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "equipo";

// Configuración por defecto con un miembro de ejemplo
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

const getOrCreate = async (userId) => {
  let doc = await PageConfig.findOne({ userId });
  if (!doc) doc = await PageConfig.create({ userId, sections: [] });
  return doc;
};

// Retorna la lista de miembros del equipo
export const getEquipo = async (req, res) => {
  try {
    if (!req.userId) return res.json(DEFAULT_CONFIG);
    const doc = await getOrCreate(req.userId);
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? DEFAULT_CONFIG);
  } catch (error) {
    console.error("getEquipo error:", error);
    return res.status(500).json({ message: "Error obteniendo Equipo" });
  }
};

// Actualiza el equipo: descarta miembros sin nombre y sanitiza campos
export const updateEquipo = async (req, res) => {
  try {
    const {
      sectionTitle = "",
      sectionSubtitle = "",
      members = [],
    } = req.body || {};

    // Filtra miembros sin nombre para evitar tarjetas vacías
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

    const doc = await getOrCreate(req.userId);
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
