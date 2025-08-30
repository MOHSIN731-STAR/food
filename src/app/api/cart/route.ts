// /pages/api/cart.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../lib/db";
import Cart from "../../models/Cart";
import { middleware } from "../../lib/jwt"; // helper to decode JWT

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const user = await middleware(req); // JWT verify
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "POST") {
      const { item } = req.body;

      let cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        cart = new Cart({ user: user._id, items: [item] });
      } else {
        const existingItem = cart.items.find((i: any) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      }

      await cart.save();
      return res.status(200).json({ message: "Cart updated", cart });
    }

    if (req.method === "GET") {
      const cart = await Cart.findOne({ user: user._id }).populate("user");
      return res.status(200).json(cart || { items: [] });
    }

    // Agar method GET/POST ke ilawa ho
    return res.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
