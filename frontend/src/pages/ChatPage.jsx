import { lazy, Suspense } from "react";
const Chat = lazy(() => import("./Chat"));
const ChatPage = () => (
  <Suspense
    fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
      >
        Opening your workspace…
      </div>
    }
  >
    <Chat />
  </Suspense>
);

export default ChatPage;
