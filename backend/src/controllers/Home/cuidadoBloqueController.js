// backend/src/controllers/cuidadoDiaController.js
import CuidadoDia from "../../models/Home/CuidadoBloque.js";

/**
 * GET /api/cuidado-dia
 * Devuelve la configuración actual del Cuidado Día (si no existe, devuelve defaults).
 */
export const getCuidadoDia = async (req, res) => {
  try {
    const doc = await CuidadoDia.findOne().lean();

    // Si aún no hay documento guardado, devolvemos defaults (sin guardarlo todavía)
    if (!doc) {
      return res.status(200).json({
        iconClass: "bi bi-sunrise",
        iconColor: "#8C6A4A",
        title: "Cuidado Día",
        titleColor: "#5b4636",
        subtitle: "8:00–17:00 • sin contrato • pago por día",
        description: "Programa diurno para mantener actividad física, mental y social, con alimentación y acompañamiento profesional en un entorno seguro.",
      });
    }

    return res.status(200).json(doc);
  } catch (error) {
    console.error("getCuidadoDia error:", error);
    return res.status(500).json({ message: "Error obteniendo CuidadoDia" });
  }
};

/**
 * PUT /api/cuidado-dia
 * Actualiza (o crea) la config del Cuidado Día.
 * Usamos upsert para asegurar que exista un único documento.
 */
export const updateCuidadoDia = async (req, res) => {
  try {
    const {
      iconClass = "bi bi-sunrise",
      iconColor = "#8C6A4A",
      title = "Cuidado Día",
      titleColor = "#5b4636",
      subtitle = "8:00–17:00 • sin contrato • pago por día",
      description = "Programa diurno para mantener actividad física, mental y social, con alimentación y acompañamiento profesional en un entorno seguro.",
    } = req.body || {};

    // Validación básica de colores hexadecimales
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    const validIconColor = hexColorRegex.test(iconColor) ? iconColor : "#8C6A4A";
    const validTitleColor = hexColorRegex.test(titleColor) ? titleColor : "#5b4636";

    const updated = await CuidadoDia.findOneAndUpdate(
      {},
      {
        iconClass: String(iconClass).trim(),
        iconColor: validIconColor,
        title: String(title).trim(),
        titleColor: validTitleColor,
        subtitle: String(subtitle).trim(),
        description: String(description).trim(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateCuidadoDia error:", error);
    return res.status(500).json({ message: "Error guardando CuidadoDia" });
  }
};