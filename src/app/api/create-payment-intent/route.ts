import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// Define the shape of cart items
interface CartItem {
  id: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
}

// Define the request body
interface RequestBody {
  items: CartItem[];
  customer: {
    email: string;
  };
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { items, customer } = body;

    // Optional: calculate total (if you want to double-check the amount)
    // const amount = items.reduce(
    //   (total, item) => total + item.price * item.quantity,
    //   0
    // );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100), // in cents
          product_data: {
            name: item.title || "Product",
            images: item.image ? [item.image] : [],
          },
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      customer_email: customer.email,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Stripe error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // Fallback for unexpected non-Error cases
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
