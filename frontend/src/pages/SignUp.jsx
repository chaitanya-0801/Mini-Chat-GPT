import { Link } from "react-router-dom";
import Form from "../components/Form";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Your Account
          </h1>

          <p className="mt-2 text-zinc-400">
            Build, manage, and grow with our platform.
          </p>
        </div>

        <Form formType="signup" />

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-500 transition hover:text-blue-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;