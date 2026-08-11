import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoutes from "./ProtectedRoutes";
import VerifyEmail from "../pages/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "",
        element: <Chat />,
      },
      {
        path: "/:chatId",
        element: <Chat />,
      },
      {
        path: "/join-chat/:chatId/:seq",
        element: <Chat />,
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
    element: <VerifyEmail/>,
  },
]);

export default router;
