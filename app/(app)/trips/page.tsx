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
  draft: "bg-tp-cream text-tp-ink",
  planned: "bg-tp-mint text-tp-ink",
  completed: "bg-tp-yellow text-tp-ink",
};

const CARD_GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-emerald-400 to-teal-600",
  "from-indigo-500 to-purple-600",
  "from-sky-400 to-cyan-600",
];

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Your trips</h1>
        <Link href="/trips/new" className="btn-pill btn-primary text-sm">
          + Create Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="card-hard mt-10 p-10 text-center">
          <p className="text-tp-ink/70">
            You haven&apos;t planned any trips yet.
          </p>
          <Link href="/trips/new" className="btn-pill btn-primary mt-5 inline-flex text-sm">
            + Create Trip
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {trips.map((trip, index) => (
            <li key={trip.id}>
              <Link href={`/trips/${trip.id}`} className="card-hard block overflow-hidden transition-transform hover:-translate-y-0.5">
                <div
                  className={`relative flex h-24 items-end bg-gradient-to-br p-3 ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`}
                >
                  <span
                    className={`badge-static absolute right-3 top-3 capitalize ${STATUS_STYLES[trip.status]}`}
                  >
                    {trip.status}
                  </span>
                  <span className="font-display text-lg font-extrabold text-white drop-shadow">
                    {trip.destination || "Destination TBD"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <p className="text-sm text-tp-ink/70">{formatDateRange(trip)}</p>
                  <p className="text-sm font-semibold capitalize text-tp-ink">
                    {trip.budget_range} budget
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
