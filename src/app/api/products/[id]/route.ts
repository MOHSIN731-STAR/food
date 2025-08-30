import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Product from "../../../models/Proudct";
import cloudinary from "cloudinary";

export const config = {
  api: { bodyParser: false },
};

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ PUT - update product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } } // <-- Fix type here
) {
  await connectDB();

  const id = params.id;

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err);
          else resolve(result as { secure_url: string });
        })
        .end(buffer);
    });

    imageUrl = upload.secure_url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      price,
      description,
      category,
      ...(imageUrl && { image: imageUrl }),
    },
    { new: true }
  );

  if (!updatedProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updatedProduct);
}

// ✅ DELETE - remove product
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } // <-- Same fix
) {
  try {
    await connectDB();

    const id = params.id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
