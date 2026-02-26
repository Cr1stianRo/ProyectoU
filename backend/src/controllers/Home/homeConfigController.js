// Controlador de configuración general del Home (modelo legacy HomeConfig).
// Maneja título, subtítulo, descripción, imagen hero y texto CTA.
import HomeConfig from "../../models/Home/HomeConfig.js";

// Obtiene la config del home; crea un documento por defecto si no existe
export const getHomeConfig = async (req, res) => {
  try {
    if (!req.userId) return res.json({ title: "Dreams", subtitle: "Bienvenido", description: "Este es el home", heroImageUrl: "", ctaText: "Empezar" });
    let config = await HomeConfig.findOne({ userId: req.userId });
    if (!config) config = await HomeConfig.create({ userId: req.userId });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener config", error: err.message });
  }
};

// Actualiza solo los campos permitidos (whitelist) para evitar escrituras no autorizadas
export const updateHomeConfig = async (req, res) => {
  try {
    const allowed = ["title", "subtitle", "description", "heroImageUrl", "ctaText"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    let config = await HomeConfig.findOne({ userId: req.userId });
    if (!config) config = await HomeConfig.create({ userId: req.userId, ...updates });
    else {
      Object.assign(config, updates);
      await config.save();
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar config", error: err.message });
  }
};
