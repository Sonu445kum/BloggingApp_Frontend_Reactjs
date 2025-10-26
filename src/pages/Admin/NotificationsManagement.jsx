import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAdminNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteAdminNotificationMutation,
} from "../../api/apiSlice";
import { Loader2, CheckCircle, Trash2, Bell } from "lucide-react";

const NotificationsManagement = () => {
  const { data: notifications = [], isLoading, isError, refetch } =
    useGetAdminNotificationsQuery();

  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotification] = useDeleteAdminNotificationMutation();
  const [loadingId, setLoadingId] = useState(null);

  const handleMarkRead = async (id) => {
    try {
      setLoadingId(id);
      await markRead(id).unwrap();
      toast.success("✅ Notification marked as read");
      refetch();
    } catch {
      toast.error("❌ Failed to mark as read");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteNotification(id).unwrap();
      toast.success("🗑️ Notification deleted");
      refetch();
    } catch {
      toast.error("❌ Failed to delete notification");
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  if (isError) return <p className="text-red-500">Failed to fetch notifications.</p>;

  if (!notifications.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Bell className="w-10 h-10 mb-2 text-gray-400" />
        <p>No notifications found.</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔔 Notifications Management</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((note) => (
              <tr
                key={note.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{note.id}</td>
                <td className="py-3 px-4">{note.message}</td>
                <td className="py-3 px-4">{note.user?.username || "—"}</td>
                <td className="py-3 px-4">
                  {note.is_read ? (
                    <span className="text-green-600 font-semibold">Read</span>
                  ) : (
                    <span className="text-orange-600 font-semibold">Unread</span>
                  )}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {!note.is_read && (
                    <button
                      onClick={() => handleMarkRead(note.id)}
                      disabled={loadingId === note.id}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition disabled:opacity-50"
                    >
                      {loadingId === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={loadingId === note.id}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition disabled:opacity-50"
                  >
                    {loadingId === note.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
