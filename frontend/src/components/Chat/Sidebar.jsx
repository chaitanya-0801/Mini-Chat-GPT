import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  Archive,
  X,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllChat,
  toggelPin,
  archiveChat,
} from "../../services/chatServices";
import useChat from "../../hooks/useChat";
import Brand from "../Brand";
import toast from "react-hot-toast";
export default function Sidebar({ open, onClose }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setActiveChat, refreshChat, setRefreshChat } = useChat();
  const [chats, setChats] = useState([]);
  const [shared, setShared] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Recent");
  const [status, setStatus] = useState("loading");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    getAllChat()
      .then((r) => {
        if (live) {
          setChats(r.data.userChat || []);
          setShared(r.data.sharedChat || []);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (live) setStatus("error");
      });
    return () => {
      live = false;
    };
  }, [refreshChat]);
  const select = (id) => {
    setActiveChat("");
    navigate(id ? `/chat?chatId=${id}` : "/chat");
    onClose();
  };
  const update = async (chat, archive) => {
    if (
      archive &&
      !window.confirm(
        chat.isArchived
          ? "Restore this conversation?"
          : "Archive this conversation? You can restore it from Archived.",
      )
    )
      return;
    setBusy(true);
    try {
      await (archive ? archiveChat : toggelPin)(chat._id);
      setRefreshChat((v) => !v);
      toast.success("Conversation updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not update conversation");
    } finally {
      setBusy(false);
    }
  };
  const list = (filter === "Shared" ? shared : chats)
    .filter((c) => (filter === "Archived" ? c.isArchived : !c.isArchived))
    .filter((c) =>
      (c.name || "Untitled chat").toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  return (
    <aside className={`chat-sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-brand">
        <Brand />
        <button
          className="icon-button mobile-menu"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <button className="button new-chat" onClick={() => select("")}>
        <Plus size={18} /> New conversation
      </button>
      <label className="search-box">
        <Search size={17} />
        <input
          aria-label="Search conversations"
          placeholder="Search conversations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="sidebar-tabs">
        {["Recent", "Shared", "Archived"].map((f) => (
          <button
            className={filter === f ? "active" : ""}
            key={f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="chat-list">
        {status === "loading" ? (
          <p className="muted" role="status">
            Loading conversations…
          </p>
        ) : status === "error" ? (
          <div className="empty-small">
            <p>Couldn’t load conversations.</p>
            <button
              onClick={() => {
                setStatus("loading");
                setRefreshChat((v) => !v);
              }}
            >
              Try again
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-small">
            <MessageSquare size={24} />
            <p>
              {query
                ? "No matching conversations."
                : "A fresh space for your ideas."}
            </p>
            <small>
              {query
                ? "Try another search."
                : "Your conversations will appear here."}
            </small>
          </div>
        ) : (
          list.map((c) => (
            <div
              key={c._id}
              className={`chat-row ${params.get("chatId") === c._id ? "active" : ""}`}
            >
              <button className="chat-select" onClick={() => select(c._id)}>
                <MessageSquare size={16} />
                <span>{c.name || "Untitled chat"}</span>
                {c.isPinned && <Pin size={13} />}
              </button>
              {filter !== "Shared" && (
                <div className="chat-row-actions">
                  <button
                    disabled={busy}
                    aria-label={
                      c.isPinned ? "Unpin conversation" : "Pin conversation"
                    }
                    onClick={() => update(c, false)}
                  >
                    <Pin size={13} />
                  </button>
                  <button
                    disabled={busy}
                    aria-label={
                      c.isArchived
                        ? "Restore conversation"
                        : "Archive conversation"
                    }
                    onClick={() => update(c, true)}
                  >
                    <Archive size={13} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Link className="sidebar-home" to="/">
        <ArrowLeft size={16} /> Back to home
      </Link>
      <div className="sidebar-note">
        <span className="status-dot" /> A little space to think bigger.
      </div>
    </aside>
  );
}
