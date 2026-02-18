import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // "bloquep" | "carrusel" | "cuidadod" | ...
    order: { type: Number, default: 0 },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageConfigSchema = new mongoose.Schema(
  {
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("PageConfig", PageConfigSchema);
