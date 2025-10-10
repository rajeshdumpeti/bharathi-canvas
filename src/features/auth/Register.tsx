import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "lib/auth/AuthProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "lib/api"; // <-- ensure this is at top

// --- form schema ---
const RegisterSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type RegisterForm = z.infer<typeof RegisterSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsTransitioning(true);

      // 1) Register
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      // 2) Login to get token
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const token: string = res.data?.access_token;
      if (token) {
        localStorage.setItem("bc.token", token);
      }

      // 3) Update client auth context (optional, matches your prior UX)
      const name = `${data.firstName} ${data.lastName}`.trim() || "User";
      signIn({ name, email: data.email });

      navigate("/");
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
            <Link
              to="/signin"
              onClick={() => setIsTransitioning(true)} // Trigger transition on navigation
              className="inline-block mt-2 rounded-full border border-white/70 px-6 py-2 font-semibold hover:bg-white hover:text-indigo-700 transition"
            >
              SIGN IN
            </Link>
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
