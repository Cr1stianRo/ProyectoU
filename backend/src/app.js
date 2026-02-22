import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import homeConfigRoutes from "./routes/homeConfigRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/home-config", homeConfigRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

export default app;
