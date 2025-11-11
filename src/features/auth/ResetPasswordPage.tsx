import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// --- 1. Define Schema ---
// We create a new schema that validates password strength
// and ensures the confirmation field matches.
const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[0-9]/, "At least one number")
      .regex(/[^a-zA-Z0-9]/, "At least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error will be attached to this field
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

// --- Password strength rules for the UI checklist ---
const passwordRules = [
  { id: 1, text: "At least 8 characters", regex: /.{8,}/ },
  { id: 2, text: "At least one number", regex: /[0-9]/ },
  { id: 3, text: "At least one special character", regex: /[^a-zA-Z0-9]/ },
];

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
      <XCircleIcon className="h-4 w-4 mr-1.5" />
    )}
    {text}
  </span>
);

// --- 2. Define Mutation ---
interface ResetPayload {
  token: string;
  new_password: string;
}

const resetPassword = async (payload: ResetPayload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};

export default function ResetPasswordPage() {
  // --- 3. Component State & Hooks ---
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      // Success! Send user to sign-in page.
      // We use navigate state to show a success message on the next page.
      navigate("/signin", {
        state: { message: "Password reset successful. Please sign in." },
      });
    },
    onError: (error: any) => {
      // Failed. Show a generic error.
      const detail =
        error?.response?.data?.detail ?? "Invalid or expired token.";
      setGeneralError(detail);
    },
  });

  // --- 4. Submit Handler ---
  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) {
      setGeneralError("No reset token found. Please try again.");
      return;
    }
    mutation.mutate({ token, new_password: data.password });
  };

  // --- 5. Render ---
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white rounded-2xl border shadow-sm">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Set New Password
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Create a new, strong password for your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* General Error Message */}
            {generalError && (
              <div className="flex items-center rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {generalError}
              </div>
            )}

            {/* New Password Field */}
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Strength Checklist */}
            <div className="space-y-1 pt-1">
              {passwordRules.map((rule) => (
                <StrengthRule
                  key={rule.id}
                  text={rule.text}
                  isMet={rule.regex.test(password)}
                />
              ))}
            </div>
            {errors.password && (
              <p className="-mt-2 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}

            {/* Confirm Password Field */}
            <div>
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending || !token}
              className="w-full rounded-lg bg-indigo-700 text-white px-4 py-2 font-semibold hover:bg-indigo-800 disabled:opacity-60"
            >
              {mutation.isPending ? "Saving..." : "Set New Password"}
            </button>

            {!token && (
              <p className="text-center text-xs text-red-600">
                Invalid reset link. Please request a new one.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
