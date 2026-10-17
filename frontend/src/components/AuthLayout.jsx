import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";
import { Sparkles } from "lucide-react";
export default function AuthLayout({ title, description, children }) {
  return (
    <div className="auth-page">
      <header>
        <Brand />
        <ThemeToggle />
      </header>
      <main className="auth-grid">
        <aside>
          <span className="eyebrow">A SPACE FOR YOUR NEXT IDEA</span>
          <h1>
            Great things start
            <br />
            with a little
            <br />
            <em>curiosity.</em>
          </h1>
          <p>
            Your thought partner for writing, coding, and making sense of what
            comes next.
          </p>
          <Sparkles size={44} />
        </aside>
        <section className="auth-card">
          <h2>{title}</h2>
          <p className="auth-description">{description}</p>
          {children}
        </section>
      </main>
    </div>
  );
}
