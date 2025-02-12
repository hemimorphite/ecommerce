"use client";

import { useEffect, useState } from "react";
import "alertifyjs/build/css/alertify.min.css";
import Product from "@/types/Product";
import Adjustment from "@/types/Adjustment";
import { UseProductStore } from "@/stores/UseProductStore";

export default function AdjustmentTable() {
  const { addAdjustment, editAdjustment, deleteAdjustment } = UseProductStore();
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(1);
  const [totalRows, setTotalrows] = useState(0);
  const [selectedAdjustment, setSelectedAdjustment] = useState<Adjustment | null>(null);

  const [isEditAdjustmentModalOpen, setIsEditAdjustmentModalOpen] = useState(false);

  const [isAddAdjustmentModalOpen, setIsAddAdjustmentModalOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchAdjustments = async (page: number) => {
    try {
      const res = await fetch(`${baseUrl}/adjustments?page=${page}&limit=10`);
      const data = await res.json();
    
      setAdjustments(data.data);
      setTotalPages(data.totalPages);
      setLimit(10);
      setTotalrows(data.total);
    } catch (error) {
      console.error("Failed to fetch adjustments:", error);
    }    
  };

  const [alertify, setAlertify] = useState<typeof import("alertifyjs") | null>(null);

  useEffect(() => {
    import("alertifyjs").then((module) => {
      setAlertify(module.default);
    });
  }, []);

  useEffect(() => {
    fetchAdjustments(page);
  }, [page]);
  
  useEffect(() => {
    fetch(`${baseUrl}/all-products`)
    .then((res) => res.json())
    .then((data) => {
      setProducts(data.data);
    })
    .catch((err) => console.error("Failed to load products:", err));
  }, []);

  const handleSelectProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setSelectedAdjustment({ ...selectedAdjustment, product_id: productId, quantity: 0 });
    }
  };

  const handleAdd = async () => {
    await fetch(`${baseUrl}/adjustments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: selectedAdjustment.product_id, quantity: selectedAdjustment.quantity }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        alertify.error("Failed to add adjustment");
        closeAddAdjustmentModal(); 
        throw new Error(errorData.message || `Failed to add adjustment`);
      } 
      else {
        addAdjustment(selectedAdjustment.product_id, selectedAdjustment.quantity)
        fetchAdjustments(page);
        closeAddAdjustmentModal(); 
        alertify.success("Adjustment added successfully");
      }
    })
    .catch((err) => {
      console.error("Error adding adjustment:", err.message);
      closeAddAdjustmentModal(); 
      alertify.error("Failed to add adjustment");
    });
  };

  const handleUpdate = async () => {
    const oldQty = adjustments.find((adj) => adj.id === selectedAdjustment.id)?.quantity || 0;

    await fetch(`${baseUrl}/adjustments/${selectedAdjustment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: selectedAdjustment.product_id, quantity: selectedAdjustment.quantity }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        closeEditAdjustmentModal();
        alertify.error("Failed to update adjustment");
        throw new Error(errorData.message || `Failed to update adjustment`);
      }
      else {
        editAdjustment(selectedAdjustment.id, selectedAdjustment.product_id, oldQty, selectedAdjustment.quantity);
        fetchAdjustments(page);
        closeEditAdjustmentModal();
        alertify.success("Adjustment updated successfully");
      }
    })
    .catch((err) => {
      console.error("Error updating adjustment:", err.message);
      closeEditAdjustmentModal();
      alertify.error("Failed to update adjustment");
    });
    
  };

  const handleDelete = (adjustment: Adjustment) => {
    alertify.confirm(
      "Delete Confirmation",
      "Are you sure you want to delete this adjustment?",
      function () {
        fetch(`${baseUrl}/adjustments/${adjustment.id}`, { method: "DELETE" })
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              alertify.error("Failed to delete adjustment");
              throw new Error(errorData.message || "Failed to delete adjustment");
            } else {
              deleteAdjustment(adjustment.product_id, adjustment.quantity);
              alertify.success("Adjustment deleted successfully");
              fetchAdjustments(page);
            }
          })
          .catch((err) => {
            console.error("Error deleting adjustment:", err.message);
            alertify.error("Failed to delete adjustment");
          });
      },
      function () {
        alertify.error("Failed to delete adjustment");
      }
    );
  };

  const openAddAdjustmentModal = () => {
    setIsAddAdjustmentModalOpen(true);
  };

  const closeAddAdjustmentModal = () => {
    setSelectedAdjustment(null);
    setSelectedProduct(null);
    setIsAddAdjustmentModalOpen(false);
  };

  const openEditAdjustmentModal = (adjustment: Adjustment) => {
    if (adjustment) {
      const product = products.find((p) => p.id === adjustment.product_id);
      if (product) {
        setSelectedProduct(product);
        setSelectedAdjustment(adjustment);
      }
    }
    setIsEditAdjustmentModalOpen(true);
  };

  const closeEditAdjustmentModal = () => {
    setIsEditAdjustmentModalOpen(false);
    setSelectedAdjustment(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Adjustments</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => openAddAdjustmentModal()}>
          Add Adjustment
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border border-gray-300 p-4">No</th>
            <th className="border border-gray-300 p-4">Image</th>
            <th className="border border-gray-300 p-4">Title</th>
            <th className="border border-gray-300 p-4">Quantity</th>
            <th className="border border-gray-300 p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map((adjustment) => (
            <tr key={adjustment.id} className="text-center border border-gray-300 hover:bg-gray-50 transition duration-200">
              <td className="border border-gray-300 p-4 text-gray-700">{adjustment.no}</td>
              <td className="border border-gray-300 p-4">
                <img 
                  src={adjustment.image} 
                  alt={adjustment.title} 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                />
              </td>
              <td className="border border-gray-300 p-4 text-gray-700">{adjustment.title}</td>
              <td className="border border-gray-300 p-4 text-gray-700">{adjustment.quantity}</td>
              <td className="border border-gray-300 p-4">
                <button 
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 mr-2" 
                  onClick={() => openEditAdjustmentModal(adjustment)}
                >
                  Edit
                </button>
                <button 
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200" 
                  onClick={() => handleDelete(adjustment)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-center mt-4">
        {totalPages === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              Showing {Math.min(page * limit, totalRows)} of {totalRows} records
            </p>
            <div className="flex space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {(isAddAdjustmentModalOpen || isEditAdjustmentModalOpen) ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] max-w-4xl">
            <h2 className="text-lg font-semibold mb-4">{isAddAdjustmentModalOpen ? ("Add Adjustment") : ("")}{isEditAdjustmentModalOpen ? ("Edit Adjustment") : ("")}</h2>
            
            <select
              className="w-full border p-2 rounded mb-2"
              value={selectedAdjustment?.product_id || 0}
              onChange={(e) => handleSelectProduct(Number(e.target.value))}
            >
              <option value={0} disabled>Select a Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} - {product.title}
                </option>
              ))}
            </select>
            
            {selectedProduct && (
              <>
                <div className="flex justify-center mb-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-32 h-32 object-cover rounded-md shadow"
                  />
                </div>

                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Product Name"
                  value={selectedProduct.title}
                  disabled={true}
                />
              </>
            )}

            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-2"
              placeholder="Quantity"
              value={selectedAdjustment?.quantity || 0}
              onChange={(e) => setSelectedAdjustment({ ...selectedAdjustment, quantity: Number(e.target.value) })}
            />

            <div className="flex justify-end space-x-2">
            {isAddAdjustmentModalOpen ? (
              <>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={closeAddAdjustmentModal}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleAdd}>
                    Add
                </button>
              </>
            ) : ("")}
            {isEditAdjustmentModalOpen ? (
              <>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={closeEditAdjustmentModal}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleUpdate}>
                    Update
                </button>
              </>
            ) : ("")}
            </div>
          </div>
        </div>
      ):("")}
    </div>
  );
}

