const SectionHeader = ({ title, subtitle, action, className = "" }) => {
  return (
    <div className={`section-header ${className}`}>
      <div className="section-header-content">
        <h2>{title}</h2>

        {subtitle && <p>{subtitle}</p>}
      </div>

      {action && <div className="section-header-action">{action}</div>}
    </div>
  );
};

export default SectionHeader;
