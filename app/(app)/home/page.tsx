import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const SUGGESTED_DESTINATIONS: { name: string; blurb: string; price: string; gradient: string }[] = [
  { name: "Lisbon", blurb: "Coastal charm & pastel streets", price: "from $65/night", gradient: "from-orange-400 to-rose-500" },
  { name: "Kyoto", blurb: "Temples, gardens & quiet lanes", price: "from $40/night", gradient: "from-emerald-400 to-teal-600" },
  { name: "New York", blurb: "Nonstop energy, world-class food", price: "from $85/night", gradient: "from-indigo-500 to-purple-600" },
  { name: "Cancun", blurb: "Beaches & all-inclusive resorts", price: "from $140/night", gradient: "from-sky-400 to-cyan-600" },
];

const TODAYS_PICK = {
  name: "Reykjavik",
  blurb: "Northern lights & hot springs, 4 days",
  gradient: "from-slate-500 to-blue-700",
};

const SIMILAR_TRAVELERS: { category: string; quote: string; cost: string }[] = [
  {
    category: "Food & culture",
    quote: "A 5-day food & culture trip through Lisbon's old town and riverside markets.",
    cost: "$820 total",
  },
  {
    category: "Nature & hiking",
    quote: "A Kyoto itinerary with temple hikes and quiet garden mornings.",
    cost: "$610 total",
  },
  {
    category: "Nightlife & food",
    quote: "A New York long-weekend built around live music and tasting menus.",
    cost: "$1,140 total",
  },
];

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

  const interests = profile?.interests ?? [];

  return (
    <div className="flex flex-col gap-16">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div>
          <span className="badge-sticker">Real trips, real plans</span>
          <h1 className="font-display mt-5 text-5xl font-extrabold sm:text-7xl">
            Where next?
          </h1>
          <p className="mt-4 max-w-md text-base text-tp-ink/70">
            A few places other travelers are loving right now, matched to
            what you already told us you like.
          </p>

          {interests.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest} className="chip chip-active capitalize">
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-tp-ink/60">
              Add some interests to your{" "}
              <Link href="/about" className="font-semibold underline underline-offset-2">
                profile
              </Link>{" "}
              and we&apos;ll tailor this page to you.
            </p>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="card-hard w-full max-w-xs -rotate-2 bg-tp-mint p-4">
            <span className="badge-static">Today&apos;s pick</span>
            <div
              className={`mt-3 h-32 rounded-xl border-2 border-tp-ink bg-gradient-to-br ${TODAYS_PICK.gradient}`}
            />
            <p className="font-display mt-3 text-xl font-extrabold text-tp-ink">
              {TODAYS_PICK.name}
            </p>
            <p className="text-sm text-tp-ink/70">{TODAYS_PICK.blurb}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-extrabold">Suggested destinations</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUGGESTED_DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={{ pathname: "/trips/new", query: { destination: dest.name } }}
              className="card-hard group overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <div
                className={`relative flex h-28 items-end bg-gradient-to-br p-3 ${dest.gradient}`}
              >
                <span className="badge-static absolute right-3 top-3">{dest.price}</span>
                <span className="font-display text-lg font-extrabold text-white drop-shadow">
                  {dest.name}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm text-tp-ink/70 group-hover:text-tp-orange">{dest.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="-mx-4 bg-tp-ink px-4 py-12 text-tp-cream sm:-mx-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-3xl font-extrabold">
              People with similar interests went to
            </h2>
            <span className="badge-static bg-tp-cream text-tp-ink">Preview</span>
          </div>
          <p className="mt-2 text-sm text-tp-cream/60">
            Preview &mdash; real matching arrives once more travellers join.
            Shown here for illustration only.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {SIMILAR_TRAVELERS.map((item) => (
              <div key={item.category} className="card-hard flex flex-col justify-between p-5">
                <div>
                  <span className="badge-sticker">{item.category}</span>
                  <p className="mt-4 text-sm text-tp-ink/80">{item.quote}</p>
                </div>
                <div className="dashed-divider mt-4 flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-tp-ink">{item.cost}</span>
                  <Link href="/trips" className="btn-pill btn-secondary py-1.5 text-xs">
                    See the trip
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-extrabold">Create your trip</h2>
        <p className="mt-2 text-sm text-tp-ink/70">
          Three quick steps and we&apos;ll match hotels, flights, and an
          itinerary for you.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card-hard bg-tp-mint p-6">
            <p className="font-display text-3xl font-extrabold">01</p>
            <p className="mt-2 text-sm font-semibold">Pick your dates</p>
            <p className="mt-1 text-sm text-tp-ink/70">
              Start and end dates, plus who&apos;s coming along.
            </p>
          </div>
          <div className="card-hard bg-tp-yellow p-6">
            <p className="font-display text-3xl font-extrabold">02</p>
            <p className="mt-2 text-sm font-semibold">Set a budget</p>
            <p className="mt-1 text-sm text-tp-ink/70">
              We&apos;ll match hotels and flights within range.
            </p>
          </div>
          <div className="card-hard card-hard-orange bg-tp-orange p-6">
            <p className="font-display text-3xl font-extrabold">03</p>
            <p className="mt-2 text-sm font-semibold">Get your matches</p>
            <p className="mt-3">
              <Link href="/trips/new" className="btn-pill btn-secondary text-sm">
                Create trip &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
