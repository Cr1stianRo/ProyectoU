import mongoose from "mongoose";

const homeConfigSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Dreams" },
    subtitle: { type: String, default: "Bienvenido" },
    description: { type: String, default: "Este es el home" },
    heroImageUrl: { type: String, default: "" },
    ctaText: { type: String, default: "Empezar" },
  },
  { timestamps: true }
);

export default mongoose.model("HomeConfig", homeConfigSchema);
