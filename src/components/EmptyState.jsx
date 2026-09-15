import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  text = "Try adjusting your filters or check back later.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <SearchX size={24} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
