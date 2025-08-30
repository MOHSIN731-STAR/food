'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/api/products");
    setProducts(res.data);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      fetchProducts();
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      price: p.price.toString(),
      description: p.description,
      category: p.category,
      image: p.image, // existing image URL
    });
  };

const handleUpdate = async () => {
  if (!editingProduct) return;

  try {
    const fd = new FormData();
    fd.append("id", editingProduct._id);
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("category", form.category);

    // ✅ sirf nayi file di ho to append karein
    if (form.image instanceof File) {
      fd.append("image", form.image);
    }

    await axios.patch(
      `http://localhost:3000/api/products/${editingProduct._id}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setEditingProduct(null);
    fetchProducts();
  } catch (error: any) {
    console.error("Update error:", error.response?.data || error.message);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Products</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b text-center">
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.description}</td>
              <td>{p.category}</td>
              <td>
                <Image
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover"
                  width={100}
                  height={100}
                  unoptimized
                />
              </td>
              <td>
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Edit Popup Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Product</h3>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 mb-2"
            />

            {/* File Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, image: file });
              }}
              className="w-full border p-2 mb-2"
            />

            {/* Show old image preview */}
            {!(form.image instanceof File) && (
              <Image
                src={form.image}
                alt="Current"
                width={80}
                height={80}
                className="mb-2"
                unoptimized
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
