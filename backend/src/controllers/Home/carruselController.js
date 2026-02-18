import Carrusel from "../../models/Home/Carrusel.js";

export const getCarrusel = async (req, res) => {
  try {
    const doc = await Carrusel.findOne().lean();

    if (!doc) {
      return res.status(200).json({ slides: [] });
    }

    return res.status(200).json(doc);
  } catch (error) {
    console.error("getCarrusel error:", error);
    return res.status(500).json({ message: "Error obteniendo Carrusel" });
  }
};

export const updateCarrusel = async (req, res) => {
  try {
    const { slides = [] } = req.body || {};

    const cleanSlides = Array.isArray(slides)
      ? slides
          .filter((s) => s && String(s.imageUrl || "").trim() !== "")
          .map((s) => ({
            imageUrl: String(s.imageUrl || "").trim(),
            title: String(s.title || "").trim(),
            subtitle: String(s.subtitle || "").trim(),
            altText: String(s.altText || "").trim(),
          }))
      : [];

    const updated = await Carrusel.findOneAndUpdate(
      {},
      { slides: cleanSlides },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateCarrusel error:", error);
    return res.status(500).json({ message: "Error guardando Carrusel" });
  }
};
