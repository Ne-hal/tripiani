import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const SUGGESTED_DESTINATIONS: { name: string; blurb: string; gradient: string }[] = [
  { name: "Lisbon", blurb: "Coastal charm & pastel streets", gradient: "from-orange-400 to-rose-500" },
  { name: "Kyoto", blurb: "Temples, gardens & quiet lanes", gradient: "from-emerald-400 to-teal-600" },
  { name: "New York", blurb: "Nonstop energy, world-class food", gradient: "from-indigo-500 to-purple-600" },
  { name: "Cancun", blurb: "Beaches & all-inclusive resorts", gradient: "from-sky-400 to-cyan-600" },
  { name: "Reykjavik", blurb: "Northern lights & hot springs", gradient: "from-slate-500 to-blue-700" },
];

const INTEREST_SUGGESTIONS: Record<string, string> = {
  hiking: "A hiking-focused itinerary with trail days and scenic viewpoints",
  museums: "A culture-packed trip built around museums and history",
  nightlife: "A city break with a strong nightlife and bar scene",
  food: "A food-first trip with markets and tasting menus",
  beaches: "A beach & relaxation getaway",
  culture: "An itinerary centered on local culture and traditions",
  history: "A history-rich sightseeing itinerary",
  nature: "A nature escape with outdoor activities",
  family: "A family-friendly trip with kid-approved stops",
  markets: "A market-hopping, foodie-friendly itinerary",
  sightseeing: "A classic sightseeing itinerary hitting the highlights",
  relaxation: "A slow, relaxation-focused trip",
};

export default async function HomePage() {
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

  const youWouldLike = (profile?.interests ?? [])
    .map((interest) => INTEREST_SUGGESTIONS[interest.toLowerCase()])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Where next?
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          A few places other travelers are loving right now.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {SUGGESTED_DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={{ pathname: "/trips/new", query: { destination: dest.name } }}
              className="group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div
                className={`flex h-24 items-end bg-gradient-to-br p-3 ${dest.gradient}`}
              >
                <span className="text-sm font-semibold text-white drop-shadow">
                  {dest.name}
                </span>
              </div>
              <div className="bg-white p-2 dark:bg-zinc-950">
                <p className="text-xs text-zinc-500 group-hover:text-accent">{dest.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Have you been here?
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Keep a log of the places you&apos;ve already explored. Mark past trips
          as completed from your{" "}
          <Link href="/trips" className="font-medium text-accent hover:underline">
            trips list
          </Link>{" "}
          to build your travel history.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          You would like...
        </h2>
        {youWouldLike.length > 0 ? (
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {youWouldLike.map((suggestion) => (
              <li
                key={suggestion}
                className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">
            Add some interests to your{" "}
            <Link href="/about" className="font-medium text-accent hover:underline">
              profile
            </Link>{" "}
            and we&apos;ll suggest trip styles you&apos;ll love.
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Similar people liked...
          </h2>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            static placeholder
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Real collaborative recommendations are out of scope for this MVP &mdash;
          shown here for illustration only.
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            Travelers with a similar profile also booked a 5-day food &amp; culture
            trip to Lisbon.
          </li>
          <li className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            Many mid-budget couples chose a Kyoto itinerary with temple hikes.
          </li>
          <li className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            Frequent flyers on your preferred airlines went to New York this
            season.
          </li>
        </ul>
      </section>
    </div>
  );
}
