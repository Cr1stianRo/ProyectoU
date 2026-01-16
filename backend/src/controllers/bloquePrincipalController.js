// backend/src/controllers/bloquePrincipalController.js
import BloquePrincipal from "../models/BloquePrincipal.js";

/**
 * GET /api/bloque-principal
 * Devuelve la configuración actual del bloque principal (si no existe, devuelve defaults).
 */
export const getBloquePrincipal = async (req, res) => {
  try {
    const doc = await BloquePrincipal.findOne().lean();

    // Si aún no hay documento guardado, devolvemos defaults (sin guardarlo todavía)
    if (!doc) {
      return res.status(200).json({
        badgeText: "",
        heroTitle: "Bienvenido",
        heroDescription: "Este es el home",
        button2Text: "Empezar",
        whatsappNumber: "",
      });
    }

    return res.status(200).json(doc);
  } catch (error) {
    console.error("getBloquePrincipal error:", error);
    return res.status(500).json({ message: "Error obteniendo BloquePrincipal" });
  }
};

/**
 * PUT /api/bloque-principal
 * Actualiza (o crea) la config del bloque principal.
 * Usamos upsert para asegurar que exista un único documento.
 */
export const updateBloquePrincipal = async (req, res) => {
  try {
    const {
      badgeText = "",
      heroTitle = "Bienvenido",
      heroDescription = "Este es el home",
      button2Text = "Empezar",
      whatsappNumber = "",
      pills = [],
    } = req.body || {};

    // Validación mínima: whatsapp solo dígitos
    const cleanWhatsapp = String(whatsappNumber).replace(/\D/g, "");

    const updated = await BloquePrincipal.findOneAndUpdate(
      {},
      {
        badgeText,
        heroTitle,
        heroDescription,
        button2Text,
        whatsappNumber: cleanWhatsapp,
        pills: Array.isArray(pills) ? pills.filter(p => String(p).trim() !== "") : [],
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return res.status(200).json(updated);
  } catch (error) {
    console.error("upsertBloquePrincipal error:", error);
    return res.status(500).json({ message: "Error guardando BloquePrincipal" });
  }
};
