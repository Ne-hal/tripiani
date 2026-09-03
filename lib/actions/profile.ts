"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BudgetRange, TripStyle } from "@/lib/types";

export interface ProfileFormState {
  error?: string;
}

function getStringArray(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map((v) => String(v).trim())
    .filter(Boolean);
}

export async function upsertProfile(
  redirectTo: string,
  _prevState: ProfileFormState | undefined,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const budget_range = String(formData.get("budget_range") ?? "") as BudgetRange;
  const trip_style = String(formData.get("trip_style") ?? "") as TripStyle;
  const age_range = String(formData.get("age_range") ?? "").trim();
  const traveling_as = String(formData.get("traveling_as") ?? "").trim();

  if (!["budget", "mid", "luxury"].includes(budget_range)) {
    return { error: "Please choose a budget range." };
  }
  if (!["flexible", "organized"].includes(trip_style)) {
    return { error: "Please choose a trip style." };
  }

  const hotel_preferences = getStringArray(formData, "hotel_preferences");
  const interests = getStringArray(formData, "interests");
  const airline_preferences = getStringArray(formData, "airline_preferences");

  const demographic: { age_range?: string; traveling_as?: "solo" | "couple" | "family" } = {};
  if (age_range) demographic.age_range = age_range;
  if (traveling_as === "solo" || traveling_as === "couple" || traveling_as === "family") {
    demographic.traveling_as = traveling_as;
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    budget_range,
    hotel_preferences,
    interests,
    airline_preferences,
    demographic,
    trip_style,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo);
}
