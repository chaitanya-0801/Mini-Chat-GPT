import { useState } from "react";
import Sidebar from "../components/Chat/Sidebar";
import ChatScreen from "../components/Chat/ChatScreen";
import Navbar from "../components/Navbar";
export default function Chat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="chat-layout">
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        />
      )}
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="chat-main">
        <Navbar onMenu={() => setOpen(!open)} />
        <ChatScreen />
      </div>
    </div>
  );
}
