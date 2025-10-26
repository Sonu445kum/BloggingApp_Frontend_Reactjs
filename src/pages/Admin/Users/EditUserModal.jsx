import React, { useState } from "react";
import { toast } from "react-toastify";

const EditUserModal = ({ close, users, refetch }) => {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || null);
  const [formData, setFormData] = useState({
    username: users[0]?.username || "",
    email: users[0]?.email || "",
  });

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = users.find((u) => u.id === userId);
    setFormData({ username: user.username, email: user.email });
  };

  const handleUpdate = async () => {
    if (!formData.username || !formData.email) {
      toast.error("Please enter username and email");
      return;
    }
    try {
      await fetch(`/api/users/${selectedUserId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success("User updated successfully");
      refetch();
      close();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>

        <select
          className="border rounded px-3 py-2 w-full mb-3"
          value={selectedUserId}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Username"
          className="border rounded px-3 py-2 w-full mb-3"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2 w-full mb-3"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={close}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
