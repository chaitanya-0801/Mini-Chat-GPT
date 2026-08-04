import { useContext } from "react";
import { ChatContext } from "../contextApi/Chat.context";

const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within an AuthProvider");
  }

  return context;
};
export default useChat;
