// src/pages/Admin/CategoriesManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../api/apiSlice";

const CategoriesManagement = () => {
  // Fetch categories (transformed to always be an array)
  const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  // Add category handler
  const handleAdd = async () => {
    if (!newCategory.trim()) return toast.error("Category name required");

    try {
      setAdding(true);
      await createCategory({ name: newCategory }).unwrap();
      toast.success("Category added successfully");
      setNewCategory("");
      refetch();
    } catch {
      toast.error("Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  // Delete category handler
  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading categories...</p>;
  if (isError) return <p className="text-red-500">Failed to load categories</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Categories Management</h1>

      {/* Add Category */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition ${
            adding ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">{cat.id}</td>
                <td className="py-3 px-6">{cat.name}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={loadingId === cat.id}
                    className={`px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50`}
                  >
                    {loadingId === cat.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManagement;
