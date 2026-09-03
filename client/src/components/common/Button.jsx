import Loader from "./Loader";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`button button-${variant} button-${size} ${
        fullWidth ? "button-full" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Loader size="small" /> : children}
    </button>
  );
};

export default Button;
