// models/Cart.ts
import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [CartItemSchema]
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
