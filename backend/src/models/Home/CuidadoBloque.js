// Modelo del bloque "Cuidado Día" — configuración visual y textos de la modalidad diurna
import mongoose from "mongoose";

const CuidadoDiaSchema = new mongoose.Schema(
  {
    iconClass: {
      type: String,
      default: "bi bi-sunrise",
    },

    iconColor: {
      type: String,
      default: "#8C6A4A",
    },

    title: {
      type: String,
      default: "",
    },

    titleColor: {
      type: String,
      default: "#5b4636",
    },

    subtitle: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CuidadoDia", CuidadoDiaSchema);