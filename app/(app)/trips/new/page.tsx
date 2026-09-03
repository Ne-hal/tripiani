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
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Create a trip
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        We&apos;ll match hotels, flights, and an itinerary as soon as you
        submit.
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <NewTripForm defaultDestination={destination} defaultBudget={defaultBudget} />
      </div>
    </div>
  );
}
