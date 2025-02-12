"use client";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";
import Product from "@/types/Product";
import { UseProductStore } from "@/stores/UseProductStore";
import "alertifyjs/build/css/alertify.min.css";

export default function ProductList() {
  const { products, fetchProducts, hasMore } = UseProductStore();
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [alertify, setAlertify] = useState<typeof import("alertifyjs") | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    import("alertifyjs").then((module) => {
      setAlertify(module.default);
    });
  }, []);

  const handleAddProduct = async () => {
    await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: newProduct?.title, 
        description: newProduct?.description, 
        price: newProduct?.price, 
        image: newProduct?.image, 
        sku: newProduct?.sku 
      }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        alertify.error("Failed to add product");
        throw new Error(errorData.message || `Failed to add product`);
      }
      else {
        setNewProduct(null);
        // Refresh Products List
        fetchProducts();
        
        // Close Modal
        setIsAddModalOpen(false);

        alertify.success("Product added successfully");
      }
    })
    .catch((err) => {
      console.error("Error adding product:", err.message);
      alertify.error("Failed to add product");
    });
  };
 
  const handleEdit = async (product: Product) => {
    await fetch(`${baseUrl}/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: product.title,
        description: product.description,
        price: product.price,
        sku: product.sku,
        image: product.image,
      }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        alertify.error("Failed to update product");
        throw new Error(errorData.message || `Failed to update product`);
      } 
      else {
        setLocalProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
        alertify.success("Product updated successfully");
      }
    })
    .catch((err) => {
      console.error("Error updating product:", err.message);
      alertify.error("Failed to update product");
    });
  };

  const handleDelete = async (id: number) => {
    const product = localProducts.find((p) => p.id === id);
    if (!product) return;

    await fetch(`${baseUrl}/products/${product.id}`, {
      method: "DELETE"
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        alertify.error("Failed to delete product");
        throw new Error(errorData.message || `Failed to delete product`);
      } 
      else {
        setLocalProducts((prev) => prev.filter((p) => p.id !== id));
        alertify.success("Product deleted successfully");
      }
    })
    .catch((err) => {
      console.error("Error deleting product:", err.message);
      alertify.error("Failed to delete product");
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);


  return (
    <> 
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
      
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] max-w-4xl">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>

            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="SKU"
              value={newProduct?.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />

            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Product Title"
              value={newProduct?.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            />

            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full border p-2 rounded mb-2"
              placeholder="Product Description"
              value={newProduct?.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-2"
              placeholder="Price"
              value={newProduct?.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />

            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Image URL"
              value={newProduct?.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleAddProduct}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <InfiniteScroll
        dataLength={products.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={hasMore ? <p className="text-center text-gray-500">Loading more...</p> : null}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {localProducts.map((product) => (
            <ProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

