"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = {};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Get matched trips in a couple of minutes.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
