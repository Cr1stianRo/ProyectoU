// Modelo del bloque hero principal — textos, botón CTA y pills destacados
import mongoose from "mongoose";

const BloquePrincipalSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "",
    },

    heroTitle: {
      type: String,
      default: "Bienvenido",
    },

    heroDescription: {
      type: String,
      default: "Este es el home",
    },

    button2Text: {
      type: String,
      default: "Empezar",
    },

    whatsappNumber: {
      type: String,
      default: "",
    },

    pills: {
  type: [String],
  default: [],
},
  },
  { timestamps: true }
);

export default mongoose.model("BloquePrincipal", BloquePrincipalSchema);
