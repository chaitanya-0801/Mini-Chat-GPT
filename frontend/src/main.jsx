import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes.jsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contextApi/Auth.jsx";
import { ChatProvider } from "./contextApi/Chat.context.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        },
      }}
      reverseOrder={false}
    />
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
