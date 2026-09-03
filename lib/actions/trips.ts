"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateRecommendations } from "@/lib/recommendations";
import type { BudgetRange, Profile, Trip } from "@/lib/types";

export interface CreateTripState {
  error?: string;
}

export async function createTrip(
  _prevState: CreateTripState | undefined,
  formData: FormData,
): Promise<CreateTripState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const start_date = String(formData.get("start_date") ?? "");
  const end_date = String(formData.get("end_date") ?? "");
  const budget_range = String(formData.get("budget_range") ?? "") as BudgetRange;
  const destination = String(formData.get("destination") ?? "").trim() || null;
  const purpose = String(formData.get("purpose") ?? "").trim() || null;
  const companionCountRaw = String(formData.get("companion_count") ?? "").trim();
  const companionRelationship = String(formData.get("companion_relationship") ?? "").trim();

  if (!start_date || !end_date) {
    return { error: "Please choose a start and end date." };
  }
  if (new Date(end_date) < new Date(start_date)) {
    return { error: "End date can't be before the start date." };
  }
  if (!["budget", "mid", "luxury"].includes(budget_range)) {
    return { error: "Please choose a budget for this trip." };
  }

  const validRelationships = ["solo", "partner", "family", "friends"] as const;
  type CompanionRelationship = (typeof validRelationships)[number];
  const relationship = validRelationships.includes(
    companionRelationship as CompanionRelationship,
  )
    ? (companionRelationship as CompanionRelationship)
    : undefined;

  const companions: Trip["companions"] =
    companionCountRaw || relationship
      ? {
          ...(companionCountRaw ? { count: Number(companionCountRaw) } : {}),
          ...(relationship ? { relationship } : {}),
        }
      : null;

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      start_date,
      end_date,
      budget_range,
      destination,
      purpose,
      companions,
      status: "draft",
    })
    .select("*")
    .single();

  if (tripError || !trip) {
    return { error: tripError?.message ?? "Could not create the trip. Please try again." };
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRow as Profile | null;

  if (profile) {
    const recommendations = generateRecommendations(profile, trip as Trip);
    await supabase.from("recommendation_sets").insert({
      trip_id: trip.id,
      hotel_options: recommendations.hotel_options,
      transport_options: recommendations.transport_options,
      itinerary_options: recommendations.itinerary_options,
    });
  }

  redirect(`/trips/${trip.id}`);
}
