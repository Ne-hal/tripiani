import { createClient } from "@/lib/supabase/server";
import { NewTripForm } from "./new-trip-form";

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

  let defaultBudget: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("budget_range")
      .eq("id", user.id)
      .maybeSingle();
    defaultBudget = profile?.budget_range;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <span className="badge-sticker">New trip</span>
      <h1 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">
        Create a trip
      </h1>
      <p className="mt-2 text-sm text-tp-ink/70">
        We&apos;ll match hotels, flights, and an itinerary as soon as you
        submit.
      </p>

      <div className="mt-8">
        <NewTripForm defaultDestination={destination} defaultBudget={defaultBudget} />
      </div>
    </div>
  );
}
