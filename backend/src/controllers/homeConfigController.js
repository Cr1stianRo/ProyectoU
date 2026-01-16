import HomeConfig from "../models/HomeConfig.js";

export const getHomeConfig = async (req, res) => {
  try {
    // Siempre devolvemos 1 config (la primera). Si no existe, la creamos.
    let config = await HomeConfig.findOne();
    if (!config) config = await HomeConfig.create({});
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener config", error: err.message });
  }
};

export const updateHomeConfig = async (req, res) => {
  try {
    const allowed = ["title", "subtitle", "description", "heroImageUrl", "ctaText"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    let config = await HomeConfig.findOne();
    if (!config) config = await HomeConfig.create(updates);
    else {
      Object.assign(config, updates);
      await config.save();
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar config", error: err.message });
  }
};
