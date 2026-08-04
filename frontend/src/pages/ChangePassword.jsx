import { useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormField from "../components/FormField";
import CTAButton from "../components/CTAButton";
import { passwordResetLink, changePassword } from "../services/authServices";
import toast from "react-hot-toast";
const ChangePassword = () => {
  const { register, reset, handleSubmit } = useForm();
  const { pathname } = useLocation();
  const { token, userId } = useParams();
  const isForgotPassword = pathname === "/send-password-reset-email";

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      isForgotPassword ? "Sending Link...." : "Changing Password....",
    );

    try {
      if (isForgotPassword) {
        const res = await passwordResetLink(data);
        if (res.data.success) {
          toast.success("Link Sent", {
            toastId,
          });
        }
      } else {
        const res = await changePassword(token, userId, data);
        if (res.data.success) {
          toast.success("Password Changed Successfully", {
            toastId,
          });
        }
      }
      reset();
    } catch (error) {
      toast.error(
        isForgotPassword ? "Link is not sent" : "Error in Changing Password",
        {
          toastId,
        },
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {isForgotPassword ? "Forgot Password" : "Reset Password"}
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {isForgotPassword
              ? "Enter your registered email and we'll send you a reset link."
              : "Create a new password for your account."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isForgotPassword ? (
            <>
              <FormField
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                register={register}
              />

              <CTAButton type="submit" text="Send Reset Link" />
            </>
          ) : (
            <>
              <FormField
                id="password"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                register={register}
              />

              <FormField
                id="confirmPass"
                label="Confirm Password"
                placeholder="Confirm new password"
                type="password"
                register={register}
              />

              <CTAButton type="submit" text="Update Password" />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
