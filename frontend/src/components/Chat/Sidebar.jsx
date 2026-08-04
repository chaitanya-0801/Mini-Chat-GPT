import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { getAllChat } from "../../services/chatServices";
import useChat from "../../hooks/useChat";
import { useSearchParams } from "react-router-dom";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setActiveChat,refreshChat } = useChat();
  const [showUserChat, setShowUserChat] = useState(true);
  const [showSharedChat, setShowSharedChat] = useState(false);

  const [userChat, setUserChat] = useState([]);
  const [sharedChat, setSharedChat] = useState([]);

  const fetchChat = async () => {
    try {
      const res = await getAllChat();

      setUserChat(res?.data?.userChat || []);
      setSharedChat(res?.data?.sharedChat || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [refreshChat]);

  return (
    <aside className="w-72 h-screen bg-zinc-900 text-white border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-xl font-bold border-b border-zinc-800">
        ChatGPT
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Recent Chats */}
        <div>
          <button
            onClick={() => setShowUserChat(!showUserChat)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-800 transition"
          >
            <span className="font-medium">Recent Chats</span>

            {showUserChat ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showUserChat && (
            <div className="mt-2 space-y-1">
              {userChat.map((chat) => (
                <button
                  key={chat._id}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800 transition"
                  onClick={() => {
                    searchParams.set("chatId", chat._id);
                    setSearchParams(searchParams);
                    setActiveChat(chat._id);
                  }}
                >
                  <MessageSquare size={16} />
                  <p className="truncate">{chat.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shared Chats */}
        <div className="mt-6">
          <button
            onClick={() => setShowSharedChat(!showSharedChat)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-800 transition"
          >
            <span className="font-medium">Shared Chats</span>

            {showSharedChat ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {showSharedChat && (
            <div className="mt-2 space-y-1">
              {sharedChat.map((chat) => (
                <button
                  key={chat._id}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800 transition"
                  onClick={() => {
                    searchParams.set("chatId", chat._id);
                    setSearchParams(searchParams);
                    setActiveChat(chat._id);
                  }}
                >
                  <MessageSquare size={16} />
                  <p className="truncate">{chat.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
