const EmptyState = ({
  title = "Nothing found",
  message = "There is nothing to display here.",
  icon,
  action,
  className = "",
}) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}

      <h3>{title}</h3>

      {message && <p>{message}</p>}

      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
