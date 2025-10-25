// src/pages/Admin/CategoriesManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} from "../../api/apiSlice";

const CategoriesManagement = () => {
  const { data: categories, isLoading, refetch } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [newCategory, setNewCategory] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  if (isLoading) return <p>Loading categories...</p>;

  const handleAdd = async () => {
    if (!newCategory.trim()) return toast.error("Category name required");
    try {
      await addCategory({ name: newCategory }).unwrap();
      toast.success("Category added");
      setNewCategory("");
      refetch();
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
      refetch();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>

      {/* Add Category */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-grow"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{cat.id}</td>
                <td className="py-2 px-4">{cat.name}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleDelete(cat.id)}
                    disabled={loadingId === cat.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManagement;
