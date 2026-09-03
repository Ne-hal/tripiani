"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface SignupState {
  error?: string;
  message?: string;
}

export async function signup(
  _prevState: SignupState | undefined,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) {
    return { error: "Please enter both an email and a password." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is required, Supabase returns no session yet.
  if (!data.session) {
    return {
      message:
        "Account created. Check your email to confirm your address, then log in.",
    };
  }

  redirect("/profile/build");
}
