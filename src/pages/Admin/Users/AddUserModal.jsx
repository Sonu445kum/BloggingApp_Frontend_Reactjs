import React, { useState } from "react";
import { toast } from "react-toastify";

const AddUserModal = ({ close, createUser, refetch }) => {
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "Reader" });

  const handleCreate = async () => {
    if (!newUser.username || !newUser.email) {
      toast.error("Please enter username and email");
      return;
    }
    try {
      await createUser(newUser).unwrap();
      toast.success("User created successfully");
      refetch();
      close();
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
        <input
          type="text"
          placeholder="Username"
          className="border rounded px-3 py-2 w-full mb-3"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2 w-full mb-3"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2 w-full mb-3"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Author">Author</option>
          <option value="Reader">Reader</option>
        </select>
        <div className="flex justify-end gap-3">
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={close}>Cancel</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
