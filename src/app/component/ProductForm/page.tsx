'use client';
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

interface ProductFormProps {
  editingProduct?: {
    _id?: string;
    name?: string;
    price?: string | number;
    description?: string;
    category?: string;
    image?: string;
  };
  onSuccess: () => void;
}

const categories = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg"];

export default function ProductForm({ editingProduct }: ProductFormProps) {
  const [form, setForm] = useState({
    name: editingProduct?.name || "",
    price: editingProduct?.price || "",
    description: editingProduct?.description || "",
    category: editingProduct?.category || "",
    image: editingProduct?.image || "",
  });

  const [uploading, setUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price.toString());
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      if (editingProduct?._id) {
        await axios.put(`http://localhost:3000/api/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:3000/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
      setForm({ name: "", price: "", description: "", category: "", image: "" });
      setShowConfirm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
      console.error("Product save error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong!");
    }  }finally {
      setUploading(false);
    }
   
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingProduct) {
            setShowConfirm(true);
          } else {
            handleSubmit();
          }
        }}
        className="p-4 bg-gray-100 rounded mb-4"
      >
        <h2 className="text-xl font-bold mb-3">
          {editingProduct ? "Update Product" : "Add Product"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input type="file" onChange={handleImage} className="mb-2" />

        {form.image &&
          (typeof form.image === "string" ? (
            <Image
              src={form.image}
              alt="preview"
              className="w-20 h-20 mb-2 object-cover"
              width={200}
              height={200}
            />
          ) : (
            <Image
              src={URL.createObjectURL(form.image)}
              alt="preview"
              className="w-20 h-20 mb-2 object-cover"
              width={200}
              height={200}
            />
          ))}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={uploading}
        >
          {editingProduct ? "Update" : "Add"}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Update</h3>
            <p className="mb-4">Are you sure you want to update this product?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yes, Update
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
