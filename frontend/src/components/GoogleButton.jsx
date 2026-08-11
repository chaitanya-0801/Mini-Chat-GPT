import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const toastId = toast.loading("Signing in with Google...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(" Login Successful!", {
        id: toastId,
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || " Login Failed",
        {
          id: toastId,
        }
      );
    }
  };

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