// src/pages/Admin/NotificationsManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAllNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from "../../api/apiSlice";

const NotificationsManagement = () => {
  const { data: notifications, isLoading, refetch } = useGetAllNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [loadingId, setLoadingId] = useState(null);

  if (isLoading) return <p>Loading notifications...</p>;

  const handleMarkRead = async (id) => {
    try {
      setLoadingId(id);
      await markRead(id).unwrap();
      toast.success("Notification marked as read");
      refetch();
    } catch {
      toast.error("Failed to mark as read");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted");
      refetch();
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Message</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((note) => (
              <tr key={note.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{note.id}</td>
                <td className="py-2 px-4">{note.message}</td>
                <td className="py-2 px-4">{note.user.username}</td>
                <td className="py-2 px-4">{note.is_read ? "Read" : "Unread"}</td>
                <td className="py-2 px-4 flex gap-2">
                  {!note.is_read && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                      onClick={() => handleMarkRead(note.id)}
                      disabled={loadingId === note.id}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleDelete(note.id)}
                    disabled={loadingId === note.id}
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

export default NotificationsManagement;
