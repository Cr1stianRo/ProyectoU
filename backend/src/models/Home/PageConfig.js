// Modelo de configuración de página — almacena el orden y config de cada sección del sitio por usuario
import mongoose from "mongoose";

// Sub-esquema para cada sección (sin _id propio, se identifica por su campo id)
const SectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    order: { type: Number, default: 0 },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageConfigSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("PageConfig", PageConfigSchema);
