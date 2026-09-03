import { createClient } from "@/lib/supabase/server";
import { TripForm } from "@/components/trip-form";
import type { Profile } from "@/lib/types";

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    profile = data as Profile | null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <span className="badge-sticker">New trip</span>
      <h1 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">
        Create a trip
      </h1>
      <p className="mt-2 text-sm text-tp-ink/70">
        Fill in your trip basics, then fine-tune the flight, hotel, and
        activity picks for every day of your trip.
      </p>

      <div className="mt-8">
        <TripForm defaultDestination={destination} defaultBudget={profile?.budget_range} profile={profile} />
      </div>
    </div>
  );
}
