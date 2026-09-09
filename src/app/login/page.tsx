// src/app/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="relative h-56 w-full overflow-hidden rounded-b-2xl md:m-6 md:h-auto md:w-1/2 md:rounded-2xl">
        <Image
          src="/images/bgimage.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-bg px-6 py-10 sm:px-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-text-primary">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to access the stock console.
          </p>

          <form className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-primary"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="emilys"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 pr-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}