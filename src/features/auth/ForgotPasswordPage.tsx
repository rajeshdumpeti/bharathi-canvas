import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "lib/api"; // Assuming your axios instance is here
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// --- 1. Define Schema ---
const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

// --- 2. Define Mutation ---
const sendResetRequest = async (email: string) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export default function ForgotPasswordPage() {
  // --- 3. Component State ---
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: sendResetRequest,
    onSuccess: () => {
      // We ALWAYS show the success message, even if the email
      // doesn't exist, to prevent email enumeration attacks.
      setIsSubmitted(true);
    },
    onError: (error) => {
      // Even on a server error, we just show the success message.
      // We do not want to give an attacker any information.
      console.error("Forgot password error:", error);
      setIsSubmitted(true);
    },
  });

  // --- 4. Submit Handler ---
  const onSubmit = (data: ForgotPasswordForm) => {
    mutation.mutate(data.email);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Back to Sign In Link */}
        <div className="mb-4">
          <Link
            to="/signin"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
            Back to Sign In
          </Link>
        </div>

        <div className="p-8 bg-white rounded-2xl border shadow-sm">
          {isSubmitted ? (
            // --- 6. Success State ---
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                Check your email
              </h1>
              <p className="text-sm text-gray-600">
                If an account with that email exists, we've sent a link to reset
                your password.
              </p>
            </div>
          ) : (
            // --- 5. Form State ---
            <>
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                Forgot Password?
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter your email and we'll send you a link to reset it.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    id="email"
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

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full rounded-lg bg-indigo-700 text-white px-4 py-2 font-semibold hover:bg-indigo-800 disabled:opacity-60"
                >
                  {mutation.isPending ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
