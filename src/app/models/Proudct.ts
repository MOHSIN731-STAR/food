import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
   description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg"],
    required: true
  },
  image: { type: String,}
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
