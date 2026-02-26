// Rutas de usuario — lectura y actualización de preferencias del panel admin
import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

// GET preferences
router.get("/preferences", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("preferences");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener preferencias" });
  }
});

// PUT preferences
router.put("/preferences", verifyToken, async (req, res) => {
  try {
    const { lastVisitedRoute, lastEditedAt } = req.body;
    // Solo actualiza los campos que vienen en el body (actualización parcial)
    const update = {};
    if (lastVisitedRoute !== undefined) update["preferences.lastVisitedRoute"] = lastVisitedRoute;
    if (lastEditedAt !== undefined) update["preferences.lastEditedAt"] = lastEditedAt;

    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true }).select("preferences");
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar preferencias" });
  }
});

export default router;
