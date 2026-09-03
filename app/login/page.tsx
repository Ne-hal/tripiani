"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Logo } from "@/components/logo";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex flex-1 flex-col bg-tp-cream lg:flex-row">
      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="text-tp-ink">
            <Logo iconClassName="h-6 w-6" textClassName="text-lg" />
          </Link>
          <span className="badge-sticker mt-8 block w-fit">Welcome back</span>
          <h1 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">
            Log in
          </h1>
          <p className="mt-3 text-sm text-tp-ink/70">
            Pick up right where you left off planning.
          </p>

          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-tp-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input-tp"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-tp-ink">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-tp"
              />
            </div>

            {state?.error && (
              <p className="rounded-xl border-2 border-tp-ink bg-tp-yellow px-3 py-2 text-sm font-medium text-tp-ink">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="btn-pill btn-primary mt-2 disabled:opacity-60"
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-tp-ink/70">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-tp-ink underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-tp-mint p-12 lg:flex">
        <div className="card-hard w-64 -rotate-3 bg-tp-cream p-4">
          <div className="h-28 rounded-xl border-2 border-tp-ink bg-gradient-to-br from-orange-400 to-rose-500" />
          <p className="font-display mt-3 text-lg font-extrabold text-tp-ink">Lisbon, 5 days</p>
          <p className="text-xs text-tp-ink/60">Food &amp; culture itinerary &middot; example trip</p>
        </div>
        <div className="card-hard card-hard-orange absolute bottom-16 right-16 w-56 rotate-2 bg-white p-4">
          <div className="h-24 rounded-xl border-2 border-tp-ink bg-gradient-to-br from-emerald-400 to-teal-600" />
          <p className="font-display mt-3 text-base font-extrabold text-tp-ink">Kyoto, 6 days</p>
          <p className="text-xs text-tp-ink/60">Hiking &amp; nature &middot; example trip</p>
        </div>
      </div>
    </div>
  );
}
