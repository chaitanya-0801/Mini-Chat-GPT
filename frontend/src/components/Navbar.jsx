import { useState, useRef, useEffect } from "react";
import { Menu, Share, Users, LogOut, Mail, ChevronDown, X } from "lucide-react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { generateLink, addAccess } from "../services/chatServices";
import { sendEmailVerifyLink } from "../services/authServices";
import useUser from "../hooks/useUser";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";
import api from "../services/apiInstance";
export default function Navbar({ onMenu }) {
  const [params] = useSearchParams();
  const routeParams = useParams();
  const id =
    params.get("chatId") || (!routeParams.seq ? routeParams.chatId : null);
  const navigate = useNavigate();
  const { setToken, setUser } = useUser();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [menu, setMenu] = useState(false);
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const dialog = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setMenu(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    if (invite) dialog.current?.showModal();
    else dialog.current?.close();
  }, [invite]);
  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          e.message ||
          "Something went wrong. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <nav className="workspace-nav">
      <div className="workspace-title">
        <button
          className="icon-button mobile-menu"
          aria-label="Open conversations"
          onClick={onMenu}
        >
          <Menu size={21} />
        </button>
        <span>
          Workspace <span className="model-badge">Gemini</span>
        </span>
      </div>
      <div className="workspace-actions">
        <ThemeToggle />
        <button
          className="subtle-button"
          disabled={!id || busy}
          title={!id ? "Select a conversation first" : "Copy sharing link"}
          onClick={() =>
            run(async () => {
              const r = await generateLink(id);
              await navigator.clipboard.writeText(r.data.link);
              toast.success("Sharing link copied");
            })
          }
        >
          <Share size={16} />
          <span>Share</span>
        </button>
        <button
          className="subtle-button"
          disabled={!id}
          onClick={() => setInvite(true)}
        >
          <Users size={16} />
          <span>Invite</span>
        </button>
        <div className="profile-wrap" ref={ref}>
          <button
            className="profile-button"
            aria-label="Account menu"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <span className="avatar">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </span>
            <ChevronDown size={14} />
          </button>
          {menu && (
            <div className="profile-menu">
              <strong>{user?.name || "Your account"}</strong>
              <small>{user?.email}</small>
              <button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await sendEmailVerifyLink();
                    toast.success("Verification email sent");
                  })
                }
              >
                <Mail size={16} /> Verify email
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await api.post("/auth/logout");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setToken(null);
                    setUser(null);
                    navigate("/login");
                  })
                }
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="invite-dialog"
        onCancel={() => setInvite(false)}
        onClose={() => setInvite(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              const emails = email
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              if (
                !emails.length ||
                emails.some((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
              )
                throw new Error(
                  "Enter valid email addresses, separated by commas.",
                );
              const r = await addAccess(id, emails);
              if (r.data.emailNotUpdated?.length)
                toast.error(
                  `Access not updated: ${r.data.emailNotUpdated.join(", ")}`,
                );
              else toast.success("Access updated");
              setInvite(false);
              setEmail("");
            });
          }}
        >
          <div className="dialog-heading">
            <h2>Think better, together.</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Close invitation"
              onClick={() => setInvite(false)}
            >
              <X size={20} />
            </button>
          </div>
          <p>
            Invite registered users to this conversation. Separate email
            addresses with commas.
          </p>
          <label htmlFor="invite-email">Email addresses</label>
          <input
            id="invite-email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
            required
          />
          <button className="button" disabled={busy}>
            {busy ? "Updating access…" : "Give access"}
          </button>
        </form>
      </dialog>
    </nav>
  );
}
