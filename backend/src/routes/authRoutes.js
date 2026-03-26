// Rutas de autenticación — registro e inicio de sesión (públicas, sin token)
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Endpoint ligero para warm-up — no requiere DB, solo despierta el servidor
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is awake",
    timestamp: Date.now()
  });
});

router.post("/register", register);
router.post("/login", login);

export default router;
