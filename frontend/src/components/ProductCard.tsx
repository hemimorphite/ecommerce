"use client";
import React, { useState } from "react";
import Product from "@/types/Product";

const ProductCard: React.FC<{ product: Product; handleEdit: (product: Product) => void; handleDelete: (id: number) => void }> = ({ product, handleEdit, handleDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>(product);

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform hover:scale-105">
        {product.image && (
          <img src={product.image} alt={product.title} className="w-full h-40 object-cover" />
        )}

        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600 truncate">{product.description}</p>

          <div className="mt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">${product.price}</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700" onClick={() => setIsEditModalOpen(true)}>
                Edit
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700" onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] max-w-4xl">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Image URL"
              value={product.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />

            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="SKU"
              value={product.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />

            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Product Title"
              value={product.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            />

            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full border p-2 rounded mb-2"
              placeholder="Product Description"
              value={product.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            ></textarea>

            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-2"
              placeholder="Price"
              value={product.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />

          <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-2"
              placeholder="Stock"
              value={product.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => { handleEdit(newProduct); }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Product?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete <strong>{product.title}</strong>?</p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={() => { handleDelete(product.id); }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </> 
  );
};

export default ProductCard;

