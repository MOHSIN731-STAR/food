import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Product from "../../models/Proudct";
import cloudinary from "cloudinary";

export const config = {
  api: { bodyParser: false },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ GET - all products
export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

// ✅ POST - add new product
export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File | null;

    let imageUrl = "";
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({}, (err, result) => {
            if (err) {
              reject(err);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("Cloudinary upload failed: no result"));
            }
          })
          .end(buffer);
      });

      imageUrl = upload.secure_url;
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: imageUrl,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}