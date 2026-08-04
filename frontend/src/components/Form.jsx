import { useForm } from "react-hook-form";
import FormField from "./FormField";
import CTAButton from "./CTAButton";
import toast from "react-hot-toast";
import { login, signup } from "../services/authServices";
import { useNavigate } from "react-router-dom";

import useUser from "../hooks/useUser";

const Form = ({ formType }) => {
  const navigate=useNavigate()
  const { setToken, setUser } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const toastId = toast.loading(
      formType !== "signup" ? "Logging in..." : "Creating Account...",
    );

    try {
      if (formType !== "signup") {
        const res = await login(data);
        if (res?.data?.success) {
          localStorage.setItem('token',res?.data?.token)
          setToken(res?.data?.token);
          setUser(res?.data?.user);
          const user=res?.data?.user
    localStorage.setItem("user", JSON.stringify(user));
          toast.success("Login Successful", { id: toastId });
          navigate('/')
        }
      } else {
        const res = await signup(data);
        if (res?.data?.success) {
          localStorage.setItem('token',res?.data?.token)
          setToken(res?.data?.token);
          setUser(res?.data?.user);
          toast.success("Account Created Successfully", { id: toastId });
        }
      }
      reset();
    } catch (error) {
      console.error(error);

      const backendMessage = error?.response?.data?.message || error?.message;

      const defaultMessage =
        formType !== "signup" ? "Error in Login" : "Error in Account Creation";

      toast.error(backendMessage || defaultMessage, { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formType === "signup" && (
          <FormField
            id="name"
            label="Enter Your Name"
            placeholder="Name"
            type="text"
            validation={{ required: "Name is required" }}
            register={register}
            error={errors.name}
          />
        )}

        <FormField
          id="email"
          label="Enter Your Email"
          placeholder="Email"
          type="email"
          validation={{ required: "Email is required" }}
          register={register}
          error={errors.email}
        />

        <FormField
          id="password"
          label="Enter Password"
          placeholder="Password"
          type="password"
          validation={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          register={register}
          error={errors.password}
        />

        {formType === "signup" && (
          <FormField
            id="confirmPass"
            label="Enter Password Again"
            placeholder="Confirm Password"
            type="password"
            validation={{
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            }}
            register={register}
            error={errors.confirmPass}
          />
        )}

        <CTAButton
          text={formType === "signup" ? "Sign Up" : "Log In"}
          type="submit"
        />
      </form>
    </div>
  );
};

export default Form;
