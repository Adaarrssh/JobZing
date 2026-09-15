import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="panel not-found">
          <SearchX size={45} />

          <span className="eyebrow">404</span>

          <h1>That page doesn't exist.</h1>

          <p>The route you opened isn't part of this JobZing frontend.</p>

          <Link className="btn btn-primary" to="/">
            <ArrowLeft size={17} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
