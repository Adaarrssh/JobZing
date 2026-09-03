import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      value,
      onChange,
      placeholder = "",
      error,
      helperText,
      required = false,
      disabled = false,
      icon,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`input-group ${className}`}>
        {label && (
          <label htmlFor={name}>
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        <div className={`input-wrapper ${error ? "input-error" : ""}`}>
          {icon && <span className="input-icon">{icon}</span>}

          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            {...props}
          />
        </div>

        {error && <span className="input-error-text">{error}</span>}

        {!error && helperText && (
          <span className="input-helper-text">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
