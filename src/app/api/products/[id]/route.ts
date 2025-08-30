import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Product from "../../../models/Proudct";
import cloudinary from "cloudinary";

export const config = {
  api: { bodyParser: false }, // ❌ disable default parser
};

// ✅ Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// ✅ PUT - update product
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const formData = await req.formData();
  const id = params.id;  // ✅ yahan se ID aayegi (URL se)

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File | null;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  let imageUrl = undefined;
  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<unknown>((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err);
          else resolve(result);
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
  context: { params: { id: string } } // must be called `context`
) {
  try {
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(context.params.id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
