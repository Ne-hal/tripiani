import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Trip } from "@/lib/types";

function formatDateRange(trip: Trip): string {
  const start = new Date(trip.start_date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const end = new Date(trip.end_date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} – ${end}`;
}

const STATUS_STYLES: Record<Trip["status"], string> = {
  draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false })
    : { data: null };

  const trips = (data ?? []) as Trip[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Your trips</h1>
        <Link
          href="/trips/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          + Create Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">
            You haven&apos;t planned any trips yet.
          </p>
          <Link
            href="/trips/new"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            + Create Trip
          </Link>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 hover:border-accent dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {trip.destination || "Destination TBD"}
                  </p>
                  <p className="text-sm text-zinc-500">{formatDateRange(trip)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[trip.status]}`}
                >
                  {trip.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
