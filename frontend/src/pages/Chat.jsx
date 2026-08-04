import Sidebar from "../components/Chat/Sidebar";
import ChatScreen from "../components/Chat/ChatScreen";
import Navbar from "../components/Navbar";

const Chat = () => {
  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Navbar />
        <ChatScreen />
      </div>
    </div>
  );
};

export default Chat;