import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormField from "../components/FormField";
import CTAButton from "../components/CTAButton";
import AuthLayout from "../components/AuthLayout";
import { passwordResetLink, changePassword } from "../services/authServices";
import toast from "react-hot-toast";
export default function ChangePassword() {
  const { token, userId } = useParams();
  const forgot = !token;
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const submit = async (data) => {
    try {
      const r = await (forgot
        ? passwordResetLink(data)
        : changePassword(token, userId, data));
      if (!r.data.success)
        throw new Error(r.data.message || "Please try again.");
      toast.success(
        forgot
          ? "Reset link sent. Check your inbox."
          : "Password updated. You can now log in.",
      );
      reset();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          e.message ||
          "Request failed. Please try again.",
      );
    }
  };
  return (
    <AuthLayout
      title={forgot ? "Forgot your password?" : "A fresh start."}
      description={
        forgot
          ? "Enter your registered email to receive a reset link."
          : "Choose a new password for your account."
      }
    >
      <form onSubmit={handleSubmit(submit)}>
        {forgot ? (
          <FormField
            id="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            register={register}
            validation={{ required: "Email is required" }}
            error={errors.email}
          />
        ) : (
          <>
            <FormField
              id="password"
              type="password"
              label="New password"
              register={register}
              validation={{
                required: "Password is required",
                minLength: { value: 6, message: "Use at least 6 characters" },
              }}
              error={errors.password}
            />
            <FormField
              id="confirmPass"
              type="password"
              label="Confirm password"
              register={register}
              validation={{
                required: "Confirm your password",
                validate: (v) =>
                  v === getValues("password") || "Passwords do not match",
              }}
              error={errors.confirmPass}
            />
          </>
        )}
        <CTAButton
          type="submit"
          disabled={isSubmitting}
          text={
            isSubmitting
              ? "Please wait…"
              : forgot
                ? "Send reset link"
                : "Update password"
          }
        />
      </form>
      <Link className="auth-link" to="/login">
        Back to login
      </Link>
    </AuthLayout>
  );
}
