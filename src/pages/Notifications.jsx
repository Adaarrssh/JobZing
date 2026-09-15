import { AlertCircle, Bell, CheckCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import api, { getErrorMessage, unwrap } from "../services/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { formatRelative } from "../utils/helpers";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      const data = unwrap(response);

      setList(Array.isArray(data) ? data : data?.notifications || []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load notifications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const read = async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);

      const data = unwrap(response);

      setList((current) =>
        current.map((notification) =>
          notification._id === id ? data : notification,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not mark notification as read."));
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setList((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      setError(
        getErrorMessage(err, "Could not mark all notifications as read."),
      );
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setList((current) =>
        current.filter((notification) => notification._id !== id),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete notification."));
    }
  };

  return (
    <div className="page">
      <div className="container narrow">
        <div className="page-intro">
          <div>
            <span className="eyebrow">CAREER INBOX</span>

            <h1>Notifications.</h1>

            <p>
              Keep up with AI results, system updates and other career signals.
            </p>
          </div>

          <button
            className="btn btn-outline"
            onClick={markAllRead}
            type="button"
            disabled={loading || !list.length}
          >
            <CheckCheck size={17} />
            Mark all read
          </button>
        </div>

        {error && <div className="inline-error">{error}</div>}

        {loading ? (
          <div className="panel">
            <Spinner label="Loading notifications…" />
          </div>
        ) : list.length ? (
          <div className="notification-list">
            {list.map((notification) => (
              <article
                className={`notification ${
                  !notification.isRead ? "unread" : ""
                }`}
                key={notification._id}
              >
                <div className={`notification-icon ${notification.type || ""}`}>
                  <Bell size={17} />
                </div>

                <div className="notification-body">
                  <div>
                    <strong>{notification.title || "Notification"}</strong>

                    <span>{formatRelative(notification.createdAt)}</span>
                  </div>

                  <p>{notification.message || ""}</p>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        onClick={() => read(notification._id)}
                        type="button"
                      >
                        <CheckCheck size={14} />
                        Mark read
                      </button>
                    )}

                    <button
                      onClick={() => remove(notification._id)}
                      type="button"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="You're all caught up"
            text="New career notifications will appear here."
          />
        )}

        <div className="inline-tip">
          <AlertCircle size={18} />

          <span>
            Notifications are fetched from the protected notification endpoints.
          </span>
        </div>
      </div>
    </div>
  );
}
