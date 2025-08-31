'use client';
import React, { useState } from "react";
import ProductForm from "./../ProductForm/ProductForm";
import ProductList from "../ProductList/ProductList";

interface Product {
  _id?: string;
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  image?: string;
}

export default function AdminPanel() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSuccess = () => {
    setEditingProduct(null);
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ProductForm 
        editingProduct={editingProduct || undefined} 
        onSuccess={handleSuccess} 
      />
      <ProductList onEdit={setEditingProduct} />
    </div>
  );
}