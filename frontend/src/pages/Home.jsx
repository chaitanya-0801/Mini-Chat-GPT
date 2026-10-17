import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  PenLine,
  Lightbulb,
  Users,
  MessageSquare,
  Bookmark,
  Check,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Brand from "../components/Brand";
import ThemeToggle from "../components/ThemeToggle";
import useUser from "../hooks/useUser";
const examples = [
  {
    name: "Create",
    icon: PenLine,
    prompt: "Help me write a compelling introduction for my portfolio.",
    response:
      "A great introduction connects what you do with why it matters. Start with your craft, add your perspective, and invite people to explore your work.",
    detail: "Turn a blank page into a starting point.",
  },
  {
    name: "Code",
    icon: Code2,
    prompt: "Explain React Hooks in simple terms.",
    response:
      "Hooks let function components remember information and respond to changes. useState stores a value; useEffect connects your component to an external system.",
    detail: "Work through ideas, one concept at a time.",
  },
  {
    name: "Explore",
    icon: Lightbulb,
    prompt: "Help me brainstorm a useful weekend project.",
    response:
      "Start with a small problem you encounter daily. A reading tracker, a meal planner, or a personal dashboard can be useful projects with room to grow.",
    detail: "Follow your curiosity somewhere new.",
  },
];
export default function Home() {
  const { token } = useUser();
  const [params] = useSearchParams();
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState(0);
  const item = examples[tab];
  if (params.get("chatId")) return <Navigate to={`/chat?${params}`} replace />;
  const start = token ? "/chat" : "/signup";
  return (
    <div className="home">
      <header className="site-header">
        <div className="nav-wrap">
          <Brand />
          <nav
            className={menu ? "site-links open" : "site-links"}
            aria-label="Main navigation"
          >
            <a href="#features" onClick={() => setMenu(false)}>
              Features
            </a>
            <a href="#workspace" onClick={() => setMenu(false)}>
              How it works
            </a>
            <a href="#possibilities" onClick={() => setMenu(false)}>
              Explore
            </a>
          </nav>
          <div className="nav-actions">
            <ThemeToggle />
            <Link className="login-link" to={token ? "/chat" : "/login"}>
              {token ? "Workspace" : "Log in"}
            </Link>
            <Link className="button small" to={start}>
              Get started <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-menu"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> YOUR IDEAS. A LITTLE MORE
              POSSIBLE.
            </span>
            <h1>
              A little curiosity.
              <br />A whole lot of
              <br />
              <span>possibility.</span>
            </h1>
            <p>
              Meet your space to think, create, and figure things out. Go from a
              first question to your next great idea with ChatGoAI.
            </p>
            <div className="hero-actions">
              <Link className="button" to={start}>
                Start a conversation <ArrowUpRight size={18} />
              </Link>
              <a className="text-link" href="#workspace">
                Take a look inside <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-note">
              <Check size={15} /> Powered by Gemini <span>·</span> Built for
              your everyday ideas
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="floating-label">
              <Lightbulb size={16} /> Make room for an idea
            </span>
            <div className="preview-window">
              <div className="preview-top">
                <Brand />
                <span className="preview-badge">A fresh perspective</span>
              </div>
              <div className="preview-greeting">
                <span className="spark-large">
                  <Sparkles />
                </span>
                <h2>Where should we begin?</h2>
                <p>Big ideas start with a small question.</p>
              </div>
              <div className="preview-prompts">
                {examples.map((e, i) => (
                  <button
                    key={e.name}
                    onClick={() => {
                      setTab(i);
                      document
                        .getElementById("workspace")
                        .scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <e.icon size={18} />
                    <span>
                      {e.name === "Create"
                        ? "Find the right words"
                        : e.name === "Code"
                          ? "Untangle some code"
                          : "Explore a new idea"}
                    </span>
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
              <Link to={start} className="preview-input">
                Ask anything. Go somewhere new.
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>
            <span className="floating-bottom">
              <span className="status-dot" /> A thought partner, at your
              fingertips
            </span>
          </div>
        </section>
        <div className="purpose-strip section-wrap">
          <span>A clearer path from “what if” to “what’s next.”</span>
          <div>
            <PenLine size={17} /> Create freely
          </div>
          <div>
            <Code2 size={17} /> Build confidently
          </div>
          <div>
            <Lightbulb size={17} /> Think bigger
          </div>
        </div>
        <section className="section-wrap feature-section" id="features">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LESS FRICTION. MORE FLOW.</span>
              <h2>
                Good ideas deserve
                <br />a great workspace.
              </h2>
            </div>
            <p>
              Everything you need to keep a thought moving,
              <br />
              without getting in the way.
            </p>
          </div>
          <div className="feature-grid">
            {[
              [
                MessageSquare,
                "A conversation that flows",
                "Ask a follow-up, explore a tangent, and get responses as they’re generated.",
              ],
              [
                Bookmark,
                "Pick up where you left off",
                "Your conversations stay together. Search, pin, and revisit the ideas that matter.",
              ],
              [
                Users,
                "Better thinking, together",
                "Share a conversation with a link or invite registered teammates by email.",
              ],
            ].map(([Icon, title, desc], i) => (
              <article className="feature-card" key={title}>
                <div className={`feature-icon tone-${i}`}>
                  <Icon size={23} />
                </div>
                <span className="feature-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="workspace-section" id="workspace">
          <div className="section-wrap workflow">
            <div>
              <span className="eyebrow">ONE SPACE. MANY STARTING POINTS.</span>
              <h2>
                Bring a question.
                <br />
                See where it takes you.
              </h2>
              <p>
                Writing something new? Working through code? Looking for a
                different angle? Start with what’s on your mind.
              </p>
              <div
                className="example-tabs"
                role="tablist"
                aria-label="Example prompts"
              >
                {examples.map((e, i) => (
                  <button
                    role="tab"
                    aria-selected={tab === i}
                    key={e.name}
                    onClick={() => setTab(i)}
                    className={tab === i ? "active" : ""}
                  >
                    <e.icon size={17} />
                    {e.name}
                  </button>
                ))}
              </div>
              <p className="example-detail">{item.detail}</p>
            </div>
            <div className="example-panel" role="tabpanel">
              <div className="example-label">
                <span className="status-dot" /> EXAMPLE CONVERSATION
              </div>
              <div className="example-question">{item.prompt}</div>
              <div className="example-answer">
                <span className="brand-icon">
                  <Sparkles size={18} />
                </span>
                <p>{item.response}</p>
              </div>
              <Link
                className="text-link"
                to={`${token ? "/chat" : "/signup"}?prompt=${encodeURIComponent(item.prompt)}`}
              >
                Try this prompt <ArrowUpRight size={16} />
              </Link>
              <small>
                Illustrative example. Live responses are generated in your
                workspace.
              </small>
            </div>
          </div>
        </section>
        <section id="possibilities" className="section-wrap cta-section">
          <span className="eyebrow">YOUR NEXT IDEA IS WAITING</span>
          <h2>Let’s see what you can do.</h2>
          <p>No perfect prompt needed. Just a place to start.</p>
          <Link className="button" to={start}>
            Open up the possibilities <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <footer className="section-wrap site-footer">
        <div>
          <Brand />
          <p>A little help for your next big thought.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#features">Features</a>
          <a href="#workspace">How it works</a>
          <Link to={token ? "/chat" : "/login"}>Your workspace</Link>
        </nav>
        <span>© {new Date().getFullYear()} ChatGoAI</span>
      </footer>
    </div>
  );
}
