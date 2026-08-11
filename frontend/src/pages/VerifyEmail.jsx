import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail, sendEmailVerifyLink } from "../services/authServices";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Checking");

  const { token, userId } = useParams();
  const navigate = useNavigate();

  const EmailVerify = async () => {
    const toastId = toast.loading("Verifying Email...");

    try {
      const response = await verifyEmail(token, userId);

      if (response?.data?.success) {
        setStatus("Verified");

        toast.success("Email Verified Successfully!", {
          id: toastId,
        });

        // Redirect to login after 1.5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setStatus("Error");

      toast.error(error?.response?.data?.message || "Internal Server Error", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    EmailVerify();
  }, []);

  const sendEmailLink = async () => {
    const toastId = toast.loading("Sending Link");
    try {
      const res = await sendEmailVerifyLink();
      console.log(res);
      if (res?.data?.success) {
        toast.success("Link Sent", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while updating access!",
        {
          id: toastId,
        },
      );
      console.error(error);
    }
  };

  if (status === "Checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-spin text-4xl">⏳</div>
          <h2 className="text-xl font-semibold">Verifying your email...</h2>
          <p className="text-gray-500 mt-2">
            Please wait while we verify your email.
          </p>
        </div>
      </div>
    );
  }

  if (status === "Verified") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>

          <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>

          <p className="text-gray-500 mt-2">
            Your email has been successfully verified.
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  if (status === "Error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>

          <h2 className="text-2xl font-bold text-red-600">
            Verification Failed
          </h2>

          <p className="text-gray-500 mt-2">
            {`The verification link is invalid or has expired.`}
          </p>
          <div className="flex gap-5">
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-5 py-2 rounded-lg bg-black text-white"
            >
              Go to Login
            </button>
            <button
              onClick={sendEmailLink}
              className="mt-6 px-5 py-2 rounded-lg bg-black text-white"
            >
              Resend Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;
