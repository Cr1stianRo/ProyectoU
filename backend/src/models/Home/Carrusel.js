import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    altText: { type: String, default: "" },
  },
  { _id: false }
);

const CarruselSchema = new mongoose.Schema(
  {
    slides: {
      type: [SlideSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Carrusel", CarruselSchema);
