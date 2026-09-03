import { AlertCircle, X } from "lucide-react";

const ErrorMessage = ({
  message,
  title = "Something went wrong",
  onClose,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div className={`error-message ${className}`}>
      <AlertCircle size={20} />

      <div className="error-message-content">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          className="error-message-close"
          onClick={onClose}
          aria-label="Close error"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
