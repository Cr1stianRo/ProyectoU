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
      default: "Cuidado Día",
    },

    titleColor: {
      type: String,
      default: "#5b4636",
    },

    subtitle: {
      type: String,
      default: "8:00–17:00 • sin contrato • pago por día",
    },

    description: {
      type: String,
      default: "Programa diurno para mantener actividad física, mental y social, con alimentación y acompañamiento profesional en un entorno seguro.",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CuidadoDia", CuidadoDiaSchema);