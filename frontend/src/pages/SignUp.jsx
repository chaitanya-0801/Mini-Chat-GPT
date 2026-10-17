import Form from "../components/Form";
import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import AuthLayout from "../components/AuthLayout";
export default function SignUp() {
  return (
    <AuthLayout
      title="Make room for possibility."
      description="Create your account and start a conversation."
    >
      <Form formType="signup" />
      <div className="divider">or continue with</div>
      <GoogleButton />
      <p className="auth-bottom">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
