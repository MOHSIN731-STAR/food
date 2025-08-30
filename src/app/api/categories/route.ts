// app/api/products/category/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Product from "../../models/Proudct";

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const categoriesParam = searchParams.get("cat"); // e.g. ?cat=Salad,Rolls
    const categories = categoriesParam ? categoriesParam.split(",") : [];

    const filter = categories.length > 0 ? { category: { $in: categories } } : {};

    const products = await Product.find(filter)
      .select("name price description image category");

    return NextResponse.json(products);
  } catch (err:unknown) {
    if (err instanceof Error) {
    return NextResponse.json(
      { err: "Failed to fetch products" },
      { status: 500 }
    
    );
  }
}
}
