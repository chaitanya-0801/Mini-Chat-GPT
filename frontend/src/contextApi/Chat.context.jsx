import { createContext, useState } from "react";

const ChatContext = createContext(null);

const ChatProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState("");
  const [refreshChat, setRefreshChat] = useState(false);

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat,refreshChat,setRefreshChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
