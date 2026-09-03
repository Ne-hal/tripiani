import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { DESTINATIONS as SUGGESTED_DESTINATIONS, TODAYS_PICK } from "@/lib/destinations";
import { SIMILAR_TRAVELERS } from "@/lib/similar-travelers";

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
            <div className="relative mt-3 h-32 overflow-hidden rounded-xl border-2 border-tp-ink">
              <Image
                src={TODAYS_PICK.image}
                alt={TODAYS_PICK.name}
                fill
                sizes="(min-width: 1024px) 20vw, 90vw"
                className="object-cover"
              />
            </div>
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
              <div className="relative flex h-28 items-end p-3">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="badge-static absolute right-3 top-3 z-10">{dest.price}</span>
                <span className="font-display relative z-10 text-lg font-extrabold text-white drop-shadow">
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
              <div key={item.category} className="card-hard flex flex-col overflow-hidden">
                <div className="relative h-32">
                  <Image
                    src={item.image}
                    alt={item.category}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="badge-sticker absolute left-3 top-3 z-10">{item.category}</span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <p className="text-sm text-tp-ink/80">{item.quote}</p>
                  <div className="dashed-divider mt-4 flex items-center justify-between pt-4">
                    <span className="text-sm font-bold text-tp-ink">{item.cost}</span>
                    <Link href="/trips" className="btn-pill btn-secondary py-1.5 text-xs">
                      See the trip
                    </Link>
                  </div>
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
