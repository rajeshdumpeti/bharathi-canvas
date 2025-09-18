import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "lib/auth/AuthProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// --- form schema ---
const SignInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type SignInForm = z.infer<typeof SignInSchema>;

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({ resolver: zodResolver(SignInSchema) });

  const onSubmit = (data: SignInForm) => {
    setIsTransitioning(true); // Start transition
    setTimeout(() => {
      const name = data.email.split("@")[0] || "User";
      signIn({ name, email: data.email });
      navigate("/"); // Navigate after transition
    }, 100); // Match the transition duration
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gray-50 px-4">
      <div
        className={`w-full max-w-5xl grid md:grid-cols-2 rounded-2xl overflow-hidden border bg-white shadow-sm transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Left: Sign-in form */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Sign In</h1>

          <p className="text-sm text-gray-500 mb-4">Use your email password</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-sm mb-2">
              <button
                type="button"
                onClick={() => alert("Forgot password flow not wired yet.")}
                className="text-indigo-600 hover:underline"
              >
                Forget Your Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-700 text-white px-4 py-2 font-semibold hover:bg-indigo-800 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "SIGN IN"}
            </button>
            <div className="mt-4 sm:hidden text-center">
              <span className="text-sm text-gray-500">
                Don’t have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="ml-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>

        {/* Right: purple panel */}
        <div className="hidden md:flex items-center justify-center bg-indigo-700 text-white p-10 relative">
          <div className="max-w-xs text-center space-y-4">
            <h2 className="text-2xl font-extrabold">Hello, Friend!</h2>
            <p className="text-white/90">
              Register with your personal details to use all site features
            </p>
            <Link
              to="/register"
              onClick={() => setIsTransitioning(true)} // Trigger transition on navigation
              className="inline-block mt-2 rounded-full border border-white/70 px-6 py-2 font-semibold hover:bg-white hover:text-indigo-700 transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
