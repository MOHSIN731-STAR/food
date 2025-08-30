'use client';
import React, { useState } from "react";
import ProductForm from "./../ProductForm/page";
import ProductList from "./../ProductList/page";

export default function AdminPanel() {
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleSuccess = () => {
    setEditingProduct(null);
    window.location.reload(); // refresh products
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ProductForm editingProduct={editingProduct} onSuccess={handleSuccess} />
      <ProductList onEdit={setEditingProduct} />
    </div>
  );
}
