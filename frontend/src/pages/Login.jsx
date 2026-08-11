import Form from "../components/Form";
import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-zinc-400 mt-2">Login to continue using ChatGoAI</p>
        </div>

        <Form formType="login" />
        <p className="mt-6 text-center text-sm text-zinc-400">
          Forget Password ?{" "}
          <Link
            to="/send-password-reset-email"
            className="font-medium text-blue-500 transition hover:text-blue-400"
          >
            Reset Password
          </Link>
        </p>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Doesn't have account? Create One{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-500 transition hover:text-blue-400"
          >
            Sign Up
          </Link>
        </p>
        <div className="text-center text-2xl font-bold p-2 text-white">OR</div>
        <div className="mt-2">
          <GoogleButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
