import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "lib/auth/AuthProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "lib/api";
import {
  // <-- NEW
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// --- form schema ---
// <-- CHANGED: Updated schema to match new rules
const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[0-9]/, "At least one number")
    .regex(/[^a-zA-Z0-9]/, "At least one special character"),
});
type RegisterForm = z.infer<typeof RegisterSchema>;

// <-- NEW: Password strength rules for the UI checklist
const passwordRules = [
  { id: 1, text: "At least 8 characters", regex: /.{8,}/ },
  { id: 2, text: "At least one number", regex: /[0-9]/ },
  { id: 3, text: "At least one special character", regex: /[^a-zA-Z0-9]/ },
];

// <-- NEW: Reusable component for the checklist item
const StrengthRule: React.FC<{ text: string; isMet: boolean }> = ({
  text,
  isMet,
}) => (
  <span
    className={`flex items-center text-xs ${isMet ? "text-green-600" : "text-gray-500"}`}
  >
    {isMet ? (
      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
    ) : (
      <XCircleIcon className="h-4 w-4 mr-1.5" /> // Or use a neutral icon like MinusCircleIcon
    )}
    {text}
  </span>
);

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- NEW

  const {
    register,
    handleSubmit,
    watch, // <-- NEW
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange", // <-- CHANGED
  });

  const email = watch("email", ""); // <-- NEW: Watch the email field
  const password = watch("password", ""); // <-- NEW: Watch the password field

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsTransitioning(true);

      // 1) Register the new user
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      // 2) Redirect to sign-in page, pre-filling their new credentials
      navigate(`/signin`);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.detail ?? "Registration failed");
      setIsTransitioning(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gray-50 px-4">
      <div
        className={`w-full max-w-5xl grid md:grid-cols-2 rounded-2xl overflow-hidden border bg-white shadow-sm transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Left: purple panel */}
        <div className="hidden md:flex items-center justify-center bg-indigo-700 text-white p-10">
          <div className="max-w-xs text-center space-y-4">
            <h2 className="text-2xl font-extrabold">Welcome Back!</h2>
            <p className="text-white/90">
              Already have an account? Sign in to continue.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsTransitioning(true);
                // Pass current email/password to sign-in page
                navigate(
                  `/signin?email=${encodeURIComponent(
                    email
                  )}&password=${encodeURIComponent(password)}`
                );
              }}
              className="inline-block mt-2 rounded-full border border-white/70 px-6 py-2 font-semibold hover:bg-white hover:text-indigo-700 transition"
            >
              SIGN IN
            </button>
          </div>
        </div>

        {/* Right: Register form */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Create Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  {...register("firstName")}
                  placeholder="First name"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("lastName")}
                  placeholder="Last name"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* */}
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"} // <-- CHANGED
                placeholder="Password"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // <-- NEW
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? ( // <-- NEW
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* */}
            <div className="space-y-1">
              {passwordRules.map((rule) => (
                <StrengthRule
                  key={rule.id}
                  text={rule.text}
                  isMet={rule.regex.test(password)} // Check against watched value
                />
              ))}
            </div>

            {/* */}
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
            {/* */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-700 text-white px-4 py-2 font-semibold hover:bg-indigo-800 disabled:opacity-60"
            >
              {isSubmitting ? "Creating…" : "SIGN UP"}
            </button>

            <div className="mt-4 sm:hidden text-center">
              <span className="text-sm text-gray-500">
                Already have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="ml-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
