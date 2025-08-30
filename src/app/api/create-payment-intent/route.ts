import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20", // use latest Stripe API version
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { items, customer } = body;

    // Example: calculate total (you should improve this in real app)
    const amount = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
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
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
