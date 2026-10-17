import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-icon">
        <Sparkles size={21} />
      </span>
      ChatGo<span className="brand-ai">AI</span>
    </Link>
  );
}
