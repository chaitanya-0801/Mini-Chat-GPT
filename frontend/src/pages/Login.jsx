import Form from "../components/Form";
import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import AuthLayout from "../components/AuthLayout";
export default function Login() {
  return (
    <AuthLayout
      title="Welcome back."
      description="Your ideas are right where you left them."
    >
      <Form formType="login" />
      {
        <Link className="auth-link" to="/send-password-reset-email">
          Forgot your password?
        </Link>
      }
      <div className="divider">or continue with</div>
      <GoogleButton />
      <p className="auth-bottom">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
