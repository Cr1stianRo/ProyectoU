// Configuración principal de la aplicación Express — middlewares y rutas
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import homeConfigRoutes from "./routes/homeConfigRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Necesario para obtener __dirname en módulos ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir imágenes subidas como archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Registro de rutas de la API
app.use("/api/home-config", homeConfigRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);

export default app;
