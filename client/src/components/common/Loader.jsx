const Loader = ({ size = "medium", text = "", className = "" }) => {
  return (
    <div className={`loader loader-${size} ${className}`}>
      <span className="loader-spinner" />
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
};

export default Loader;
