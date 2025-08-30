"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import {
  removeFromCart,
  decreaseQuantity,
  addToCart,
  clearCart,
  loadUserCart,
} from "../../redux/store/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const Cart: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    address: "",
  });

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    dispatch(loadUserCart());
    setMounted(true);
  }, [dispatch]);

 const handleCheckout = async () => {
  const { name, email, phone, postcode, address } = formData;
  if (!name || !email || !phone || !postcode || !address) {
    alert("Please fill in all the fields.");
    return;
  }

  const stripe = await stripePromise;
  if (!stripe) return;

  const res = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, customer: formData }),
  });

  if (!res.ok) {
    const err = await res.text();
    alert("Payment failed: " + err);
    return;
  }

  const session = await res.json();

  if (session.error) {
    alert(session.error);
    return;
  }

  await stripe.redirectToCheckout({ sessionId: session.id });
};


  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center mt-20">
        <Link href="/">
          <h1 className="text-2xl">Your cart is empty 🛒</h1>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4 grid md:grid-cols-2 gap-8">
      {/* Checkout Information */}
      <div className="p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Checkout Information</h2>
        {["name", "email", "phone", "postcode"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="block mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={`Enter your ${field}`}
              value={(formData as unknown as Record<string, string>)[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
            />
          </div>
        ))}
        <div className="mb-3">
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
            rows={3}
          />
        </div>

        <button
          onClick={handleCheckout}
          className="bg-green-700 text-white px-4 py-2 rounded w-full mt-3 hover:bg-green-600 transition"
        >
          Proceed to Payment
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4 rounded shadow-md h-auto">
        <Link href="/">
          <h1 className="text-xl mb-6 border-b-2 border-b-red-600 w-[80px] flex">
            Go Back
          </h1>
        </Link>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.image || "/placeholder.png"}
                alt='{item.title || "Product"}'
                width={80}
                height={80}
                className="rounded"
              />
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-gray-600">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-2 bg-gray-300 rounded"
                onClick={() => dispatch(decreaseQuantity(item.id))}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="px-2 bg-gray-300 rounded"
                onClick={() => dispatch(addToCart(item))}
              >
                +
              </button>
            </div>

            <button
              className="text-red-500"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-6 flex justify-between items-center pt-4">
          <h2 className="text-xl font-bold">
            Total: ${totalPrice.toFixed(2)}
          </h2>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
