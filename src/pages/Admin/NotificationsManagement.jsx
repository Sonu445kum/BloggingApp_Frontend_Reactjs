import React from 'react';
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../api/apiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const NotificationsManagement = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();

  const handleMarkRead = async (id) => {
    try {
      await markRead(id).unwrap();
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Error marking notification');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Notifications Management</h1>
      <ul className="space-y-4">
        {notifications.map((n) => (
          <li key={n.id} className={`border p-4 rounded shadow ${n.read ? 'bg-gray-100' : 'bg-white'}`}>
            <p>{n.message}</p>
            {!n.read && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="mt-2 bg-blue-600 text-white px-2 py-1 rounded"
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsManagement;
