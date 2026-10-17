import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
const subscribe = (fn) => {
  window.addEventListener("themechange", fn);
  return () => window.removeEventListener("themechange", fn);
};
export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme || "light",
  );
  return (
    <button
      className="icon-button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
        window.dispatchEvent(new Event("themechange"));
      }}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
