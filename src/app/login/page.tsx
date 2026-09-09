"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { ApiError } from "@/services/api-client";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await login(username, password);
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        },
      });
      router.push("/stock");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Incorrect username or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-lg border border-error-500/30 bg-error-50 px-3 py-2.5 text-sm text-error-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 pr-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="••••••••"
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
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}