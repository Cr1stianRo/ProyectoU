import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import homeConfigRoutes from "./routes/homeConfigRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/home-config", homeConfigRoutes);
app.use("/api/auth", authRoutes);

export default app;
