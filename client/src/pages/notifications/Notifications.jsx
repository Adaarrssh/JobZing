import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../api/notification.api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      setNotifications(response?.notifications || response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to mark notification as read",
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to mark notifications as read",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <section className="notifications-page">
          <h1>Notifications</h1>
          <p>Loading notifications...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="notifications-page">
        <div className="section-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your latest activity.</p>
          </div>

          {notifications.some((notification) => !notification.isRead) && (
            <button
              type="button"
              className="button button-primary"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        {notifications.length === 0 ? (
          <div className="empty-state">
            <h2>No notifications</h2>
            <p>You are all caught up.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <article
                key={notification._id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
              >
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>

                    {!notification.isRead && (
                      <span className="notification-dot"></span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-meta">
                    <span>{notification.type}</span>

                    {notification.createdAt && (
                      <span>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      Mark as read
                    </button>
                  )}

                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => handleDelete(notification._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Notifications;
