// // src/pages/Admin/UsersManagement.jsx
// import React, { useState } from "react";
// import {
//   useGetUsersQuery,
//   useUpdateUserRoleMutation,
// } from "../../api/apiSlice";
// import { toast } from "react-toastify";

// const UsersManagement = () => {
//   const { data: users, isLoading, refetch } = useGetUsersQuery();
//   const [updateUserRole] = useUpdateUserRoleMutation();
//   const [loadingUserId, setLoadingUserId] = useState(null);

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
//         Loading users...
//       </div>
//     );

//   const handleRoleChange = async (userId, newRole) => {
//     try {
//       setLoadingUserId(userId);
//       await updateUserRole({ userId, role: newRole }).unwrap();
//       toast.success("Role updated successfully");
//       refetch(); // refresh user list
//     } catch (error) {
//       toast.error("Failed to update role");
//     } finally {
//       setLoadingUserId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Users Management</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
//           <thead className="bg-indigo-500 text-white">
//             <tr>
//               <th className="py-3 px-6 text-left">ID</th>
//               <th className="py-3 px-6 text-left">Username</th>
//               <th className="py-3 px-6 text-left">Email</th>
//               <th className="py-3 px-6 text-left">Role</th>
//               <th className="py-3 px-6 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr
//                 key={user.id}
//                 className="border-b hover:bg-gray-50 transition-colors duration-200"
//               >
//                 <td className="py-3 px-6 font-medium text-gray-700">{user.id}</td>
//                 <td className="py-3 px-6 font-medium text-gray-800">{user.username}</td>
//                 <td className="py-3 px-6 text-gray-600">{user.email}</td>
//                 <td className="py-3 px-6 font-medium text-gray-700">{user.role}</td>
//                 <td className="py-3 px-6">
//                   <select
//                     className={`border rounded px-3 py-1 ${
//                       loadingUserId === user.id
//                         ? "bg-gray-200 cursor-not-allowed"
//                         : "bg-white"
//                     } transition-colors duration-200`}
//                     value={user.role}
//                     onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                     disabled={loadingUserId === user.id}
//                   >
//                     <option value="Admin">Admin</option>
//                     <option value="Editor">Editor</option>
//                     <option value="Author">Author</option>
//                     <option value="Reader">Reader</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UsersManagement;

// new Logic for crud operations

// // Import Modals
// import AddUserModal from "../../pages/Admin/Users/AddUserModal";
// import EditUserModal from "../../pages/Admin/Users/EditUserModal";
// import UpdateUserRoleModal from "../../pages/Admin/Users/UpdateUserRoleModal";
// import DeleteUserModal from "../../pages/Admin/Users/DeleteUserModal";

// src/pages/Admin/UsersManagement.jsx
// src/pages/Admin/UsersManagement.jsx
// src/pages/Admin/Users/UsersManagement.jsx
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   useGetUsersQuery,
//   useDeleteUserMutation,
//   useUpdateUserRoleMutation,
// } from "../../api/apiSlice";
// import EditUserModal from "../../pages/Admin/Users/EditUserModal";
// import AddUserModal from "../../pages/Admin/Users/AddUserModal";

// const UsersManagement = () => {
//   const { data, isLoading, refetch } = useGetUsersQuery();
//   const users = data || [];
//   const [deleteUser] = useDeleteUserMutation();
//   const [updateUserRole] = useUpdateUserRoleMutation();
//   const [loadingUserId, setLoadingUserId] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [addingUser, setAddingUser] = useState(false);

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
//         Loading users...
//       </div>
//     );

//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await deleteUser(userId).unwrap();
//       toast.success("User deleted successfully ✅");
//       refetch();
//     } catch (error) {
//       toast.error("Failed to delete user ❌");
//     }
//   };

//   return (
//     <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200 relative">
//       <h1 className="text-4xl font-bold mb-6 text-gray-800">
//         Users Management
//       </h1>

//       <div className="flex gap-4 mb-6">
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//           onClick={() => setAddingUser(true)}
//         >
//           ➕ Add User
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
//           <thead className="bg-indigo-500 text-white">
//             <tr>
//               <th className="py-3 px-6 text-left">ID</th>
//               <th className="py-3 px-6 text-left">Username</th>
//               <th className="py-3 px-6 text-left">Email</th>
//               <th className="py-3 px-6 text-left">Role</th>
//               <th className="py-3 px-6 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr
//                 key={user.id}
//                 className="border-b hover:bg-gray-50 transition-colors duration-200"
//               >
//                 <td className="py-3 px-6 font-medium text-gray-700">
//                   {user.id}
//                 </td>
//                 <td className="py-3 px-6 font-medium text-gray-800">
//                   {user.username}
//                 </td>
//                 <td className="py-3 px-6 text-gray-600">{user.email}</td>
//                 <td className="py-3 px-6 font-medium text-gray-700">
//                   <select
//                     className={`border rounded px-3 py-1 ${
//                       loadingUserId === user.id
//                         ? "bg-gray-200 cursor-not-allowed"
//                         : "bg-white"
//                     } transition-colors duration-200`}
//                     value={user.role}
//                     onChange={async (e) => {
//                       try {
//                         setLoadingUserId(user.id);
//                         await updateUserRole({
//                           userId: user.id,
//                           role: e.target.value,
//                         }).unwrap();
//                         toast.success("Role updated successfully");
//                         refetch();
//                       } catch {
//                         toast.error("Failed to update role");
//                       } finally {
//                         setLoadingUserId(null);
//                       }
//                     }}
//                     disabled={loadingUserId === user.id}
//                   >
//                     <option value="Admin">Admin</option>
//                     <option value="Editor">Editor</option>
//                     <option value="Author">Author</option>
//                     <option value="Reader">Reader</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 flex gap-2">
//                   <button
//                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
//                     onClick={() => setSelectedUser(user)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                     onClick={() => handleDelete(user.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedUser && (
//         <EditUserModal
//           close={() => setSelectedUser(null)}
//           selectedUser={selectedUser}
//           refetch={refetch}
//         />
//       )}

//       {addingUser && (
//         <AddUserModal
//           close={() => setAddingUser(false)}
//           refetch={refetch}
//         />
//       )}
//     </div>
//   );
// };

// export default UsersManagement;


import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../../api/apiSlice";
import EditUserModal from "./Users/EditUserModal";
import AddUserModal from "./Users/AddUserModal";

const UsersManagement = () => {
  const { data, isLoading, refetch } = useGetUsersQuery();
  const users = data || [];
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading users...
      </div>
    );

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully ✅");
      refetch();
    } catch (error) {
      toast.error("Failed to delete user ❌");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200 relative">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Users Management
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 font-medium text-gray-700">{user.id}</td>
                <td className="py-3 px-6 font-medium text-gray-800">{user.username}</td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                <td className="py-3 px-6 font-medium text-gray-700">
                  <select
                    className={`border rounded px-3 py-1 ${
                      loadingUserId === user.id
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white"
                    } transition-colors duration-200`}
                    value={user.role}
                    onChange={async (e) => {
                      try {
                        setLoadingUserId(user.id);
                        await updateUserRole({
                          userId: user.id,
                          role: e.target.value,
                        }).unwrap();
                        toast.success("Role updated successfully");
                        refetch();
                      } catch {
                        toast.error("Failed to update role");
                      } finally {
                        setLoadingUserId(null);
                      }
                    }}
                    disabled={loadingUserId === user.id}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                  </select>
                </td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => setSelectedUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserModal
          close={() => setSelectedUser(null)}
          selectedUser={selectedUser}
          refetch={refetch}
        />
      )}

      {showAddModal && (
        <AddUserModal
          close={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default UsersManagement;


