
'use client'
import ProductForm from "../component/ProductForm/ProductForm";

export default function ProductFormPage() {
  return (
    <div className="p-6">
      <ProductForm onSuccess={() => alert("Product saved!")} />
    </div>
  );
}
