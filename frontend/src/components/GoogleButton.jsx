import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useUser from "../hooks/useUser";
const GoogleButton = () => {
  const { setToken, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = async (credentialResponse) => {
    const toastId = toast.loading("Signing in with Google...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(" Login Successful!", {
        id: toastId,
      });

      setToken(response.data.token);
      setUser(response.data.user);
      navigate(location.state?.from || "/chat" + window.location.search);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || " Login Failed", {
        id: toastId,
      });
    }
  };

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID)
    return (
      <p className="muted text-sm">
        Google sign-in is not configured. Use email to continue.
      </p>
    );
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        toast.error("Google Login Failed");
      }}
    />
  );
};

export default GoogleButton;
