import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoaderCircle, CheckCircle, CircleAlert } from "lucide-react";
import { verifyEmail, sendEmailVerifyLink } from "../services/authServices";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";
export default function VerifyEmail() {
  const { token, userId } = useParams();
  const [status, setStatus] = useState("checking");
  const [busy, setBusy] = useState(false);
  const request = useRef(null);
  useEffect(() => {
    let live = true;
    const key = `${token}/${userId}`;
    if (request.current?.key !== key) {
      request.current = { key, promise: verifyEmail(token, userId) };
    }
    request.current.promise
      .then((r) => {
        if (live) setStatus(r.data.success ? "verified" : "error");
      })
      .catch(() => {
        if (live) setStatus("error");
      });
    return () => {
      live = false;
    };
  }, [token, userId]);
  return (
    <AuthLayout
      title={
        status === "checking"
          ? "Verifying your email…"
          : status === "verified"
            ? "You’re all verified."
            : "This link didn’t work."
      }
      description={
        status === "checking"
          ? "Please wait while we check your verification link."
          : status === "verified"
            ? "Your email address has been confirmed."
            : "The verification link may have expired. Request a new one while signed in."
      }
    >
      <div role="status">
        {status === "checking" ? (
          <LoaderCircle className="animate-spin" />
        ) : status === "verified" ? (
          <CheckCircle />
        ) : (
          <CircleAlert />
        )}
      </div>
      {status === "error" && (
        <button
          className="button mt-6"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await sendEmailVerifyLink();
              toast.success("Verification link sent");
            } catch (e) {
              toast.error(
                e.response?.data?.message ||
                  "Sign in before requesting a new link.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Sending…" : "Resend link"}
        </button>
      )}
      <Link className="auth-link" to="/login">
        Go to login
      </Link>
    </AuthLayout>
  );
}
