import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ChatPage from "../pages/ChatPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoutes from "./ProtectedRoutes";
import VerifyEmail from "../pages/VerifyEmail";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/:chatId",
        element: <ChatPage />,
      },
      {
        path: "/join-chat/:seq/:chatId",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/send-password-reset-email",
    element: <ChangePassword />,
  },
  {
    path: "/change-password/:token/:userId",
    element: <ChangePassword />,
  },
  {
    path: "/verify-email/:token/:userId",
    element: <VerifyEmail />,
  },
]);

export default router;
