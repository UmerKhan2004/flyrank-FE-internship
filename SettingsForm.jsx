import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ---- Validation schema ----
const settingsSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  bio: z
    .string()
    .max(200, "Bio must be 200 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export default function SettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Settings form submitted:", data);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-8 sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
          Account settings
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              aria-invalid={errors.fullName ? "true" : "false"}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Bio <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="bio"
              rows={4}
              aria-invalid={errors.bio ? "true" : "false"}
              aria-describedby={errors.bio ? "bio-error" : undefined}
              className={`w-full resize-none rounded-md border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${
                errors.bio
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              {...register("bio")}
            />
            {errors.bio && (
              <p id="bio-error" className="mt-1 text-sm text-red-600">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}