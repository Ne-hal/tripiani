"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = ["Where next?", "Stays", "Flights", "Experiences"];

const MOODS: { emoji: string; label: string }[] = [
  { emoji: "🍜", label: "Eat everything" },
  { emoji: "⛰", label: "Move a lot" },
  { emoji: "🛋", label: "Do nothing" },
  { emoji: "🎧", label: "Stay out late" },
  { emoji: "👶", label: "Kid-proof" },
];

const CITIES: {
  key: string;
  city: string;
  tags: string;
  price: number;
  bed: number;
  match: number;
  gradient: string;
}[] = [
  { key: "tbilisi", city: "Tbilisi", tags: "Wine · hills · steep streets", price: 234, bed: 18, match: 92, gradient: "from-amber-600 to-stone-800" },
  { key: "reykjavik", city: "Reykjavík", tags: "Pools · lava · long light", price: 370, bed: 41, match: 88, gradient: "from-sky-500 to-indigo-900" },
  { key: "marrakesh", city: "Marrakesh", tags: "Souks · riads · mint tea", price: 204, bed: 26, match: 85, gradient: "from-orange-500 to-red-700" },
  { key: "hanoi", city: "Hanoi", tags: "Street food marathon", price: 324, bed: 15, match: 81, gradient: "from-rose-500 to-rose-900" },
  { key: "lisbon", city: "Lisbon", tags: "Tiles · tarts · downhill trams", price: 155, bed: 23, match: 94, gradient: "from-orange-400 to-rose-500" },
];

const EXPERIENCE_TYPES = ["All", "Solo", "Couple", "Family"] as const;
type ExperienceType = Exclude<(typeof EXPERIENCE_TYPES)[number], "All">;

const EXPERIENCES: {
  id: string;
  type: ExperienceType;
  badge: string;
  shadowClass: string;
  gradient: string;
  title: string;
  meta: string;
  rating: string;
  total: number;
  match: number;
  who: string;
  whoMeta: string;
  quote: string;
}[] = [
  {
    id: "tokyo",
    type: "Couple",
    badge: "💞 Couple",
    shadowClass: "card-hard-orange",
    gradient: "from-indigo-500 to-purple-700",
    title: "Tokyo → Osaka",
    meta: "9 nights · March · 2 people",
    rating: "4.8",
    total: 807,
    match: 89,
    who: "Dana & Karim",
    whoMeta: "4 trips logged · food-first, slow pace",
    quote: "Booked the night bus instead of the bullet train. Zero regrets, saved $113.",
  },
  {
    id: "georgia",
    type: "Solo",
    badge: "🎒 Solo",
    shadowClass: "card-hard-mint",
    gradient: "from-emerald-600 to-teal-900",
    title: "Georgia, slowly",
    meta: "12 nights · September · solo",
    rating: "4.6",
    total: 445,
    match: 94,
    who: "Yara N.",
    whoMeta: "11 trips logged · works remotely",
    quote: "Worked mornings from Tbilisi, hiked Kazbegi at weekends. Cheapest month of my year.",
  },
  {
    id: "andalusia",
    type: "Family",
    badge: "👨‍👩‍👧‍👦 Family",
    shadowClass: "card-hard-yellow",
    gradient: "from-amber-500 to-orange-700",
    title: "Andalusia by car",
    meta: "7 nights · April · 2 adults, 2 kids",
    rating: "4.9",
    total: 1305,
    match: 83,
    who: "The Al-Haddads",
    whoMeta: "6 trips logged · family of four",
    quote: "Three cities, one rental car, and a pool every single night. That was the deal.",
  },
];

const TYPE_CHIPS = ["Solo", "Couple", "Family", "Friends"];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function LandingPage() {
  const [moods, setMoods] = useState<string[]>([]);
  const [pickIdx, setPickIdx] = useState(0);
  const [filter, setFilter] = useState<(typeof EXPERIENCE_TYPES)[number]>("All");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [types, setTypes] = useState<string[]>(["Couple"]);
  const [budget, setBudget] = useState(530);

  const toggleIn = (arr: string[], set: (v: string[]) => void, value: string) => {
    const next = arr.slice();
    const i = next.indexOf(value);
    if (i > -1) {
      if (next.length > 1) next.splice(i, 1);
    } else {
      next.push(value);
    }
    set(next);
  };

  const pick = CITIES[pickIdx];
  const destinations = CITIES.slice(0, 4);
  const visibleExperiences =
    filter === "All" ? EXPERIENCES : EXPERIENCES.filter((e) => e.type === filter);
  const filterNote =
    filter === "All"
      ? "Showing all trip types · 1,204 experiences match your interests"
      : `Showing ${filter.toLowerCase()} trips · ${visibleExperiences.length} shown`;

  return (
    <div className="flex flex-1 flex-col bg-tp-cream">
      <header className="sticky top-0 z-10 bg-tp-ink text-tp-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl font-extrabold tracking-tight">Tripiani</span>
            <nav className="hidden items-center gap-5 text-sm font-medium sm:flex">
              {NAV_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className={
                    i === 0
                      ? "border-b-2 border-tp-yellow pb-0.5 text-tp-yellow"
                      : "text-tp-cream/70"
                  }
                >
                  {item}
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white/10">
              Log in
            </Link>
            <Link href="/signup" className="btn-pill btn-primary text-sm">
              Join free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="badge-sticker">✦ 14,208 real trips</span>
            <h1 className="font-display mt-5 text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-[92px]">
              Where
              <br />
              next<span className="text-tp-orange">?</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-tp-ink/75 sm:text-lg">
              Pick a mood, not a destination. We match you with people who
              travel like you &mdash; and show you what their trip actually
              cost.
            </p>
            <div className="mt-6 flex max-w-md flex-wrap gap-2.5">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => toggleIn(moods, setMoods, m.label)}
                  className={`chip ${moods.includes(m.label) ? "chip-active" : ""}`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setPickIdx((pickIdx + 1) % CITIES.length)}
                className="btn-pill btn-primary"
              >
                Surprise me ✦
              </button>
              <p className="max-w-[180px] text-xs font-semibold leading-snug text-tp-ink/55">
                {moods.length} mood{moods.length === 1 ? "" : "s"} on &middot;
                shuffling {CITIES.length} destinations
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-tp-mint p-8 sm:p-11">
            <div className="pointer-events-none absolute h-[440px] w-[440px] rounded-full bg-tp-ink/5" />
            <div className="card-hard-lg relative w-full max-w-[310px] -rotate-3 overflow-hidden bg-white">
              <div className={`relative h-48 bg-gradient-to-br ${pick.gradient}`}>
                <span className="badge-static absolute left-3 top-3">Today&apos;s pick</span>
              </div>
              <div className="p-4">
                <p className="font-display text-3xl font-extrabold">{pick.city}</p>
                <p className="mt-1 text-sm text-tp-ink/65">{pick.tags}</p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 rounded-xl bg-tp-cream p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-tp-ink/50">Flight</p>
                    <p className="mt-0.5 text-lg font-extrabold">{money(pick.price)}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-tp-cream p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-tp-ink/50">Bed/night</p>
                    <p className="mt-0.5 text-lg font-extrabold">{money(pick.bed)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href="/signup" className="flex-1 rounded-full bg-tp-yellow py-2.5 text-center text-sm font-bold">
                    Take it
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPickIdx((pickIdx + 1) % CITIES.length)}
                    className="w-11 rounded-full border-2 border-tp-ink text-center text-sm"
                    aria-label="Shuffle pick"
                  >
                    ↻
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-24 w-full max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Suggested destinations
            </h2>
            <Link href="/signup" className="whitespace-nowrap text-sm font-bold underline underline-offset-4">
              See all 61 →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d) => (
              <Link
                key={d.key}
                href="/signup"
                className="card-hard overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                <div className={`relative h-40 bg-gradient-to-br ${d.gradient}`}>
                  <span className="badge-static absolute right-2.5 top-2.5">{d.match}% you</span>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-2xl font-extrabold">{d.city}</p>
                    <p className="whitespace-nowrap text-sm font-bold">{money(d.price)}</p>
                  </div>
                  <p className="mt-1 text-xs text-tp-ink/60">{d.tags}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="-mx-6 mt-24 bg-tp-ink px-6 py-16 text-tp-cream sm:-mx-10 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display max-w-xl text-3xl font-extrabold sm:text-4xl">
                  People with similar interests went to
                </h2>
                <p className="mt-2 text-sm text-tp-cream/60">
                  Rated, priced, and stealable.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                {EXPERIENCE_TYPES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 ${
                      filter === f
                        ? "bg-tp-yellow text-tp-ink"
                        : "border border-tp-cream/35 text-tp-cream"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {visibleExperiences.map((e) => (
                <div key={e.id} className={`card-hard ${e.shadowClass} overflow-hidden bg-tp-cream text-tp-ink`}>
                  <div className={`relative h-44 bg-gradient-to-br ${e.gradient}`}>
                    <span className="badge-static absolute left-3 top-3">{e.badge}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSaved((s) => ({ ...s, [e.id]: !s[e.id] }))
                      }
                      aria-label="Save trip"
                      className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-tp-ink text-sm ${
                        saved[e.id] ? "bg-tp-orange text-white" : "bg-tp-cream"
                      }`}
                    >
                      {saved[e.id] ? "♥" : "♡"}
                    </button>
                    <span className="badge-static absolute bottom-2.5 right-2.5">★ {e.rating}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-display text-xl font-extrabold">{e.title}</p>
                    <p className="mt-0.5 text-xs font-semibold text-tp-ink/60">{e.meta}</p>
                    <p className="mt-3 text-sm leading-relaxed">&ldquo;{e.quote}&rdquo;</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-7 w-7 shrink-0 rounded-full bg-tp-ink/20" />
                      <span className="text-xs font-semibold">{e.whoMeta}</span>
                    </div>
                    <p className="text-xs font-bold text-tp-ink/80">{e.who}</p>
                    <span className="mt-2 inline-flex items-center rounded-full bg-tp-mint px-2.5 py-1 text-[11px] font-bold">
                      {e.match}% match
                    </span>
                    <div className="mt-4 flex items-center gap-2.5">
                      <div className="rounded-xl bg-tp-yellow px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-65">Total</p>
                        <p className="font-display whitespace-nowrap text-lg font-extrabold">{money(e.total)}</p>
                      </div>
                      <Link
                        href="/signup"
                        className="flex-1 rounded-full bg-tp-ink py-3 text-center text-sm font-bold text-tp-cream"
                      >
                        See the trip
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-tp-cream/60">{filterNote}</p>
          </div>
        </div>

        <div className="mx-auto mt-24 w-full max-w-5xl">
          <h2 className="font-display text-center text-4xl font-extrabold sm:text-5xl">
            Create your trip
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-base text-tp-ink/70">
            Three taps and you&apos;ve got a draft. Flights and beds drop in
            with live prices.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="card-hard bg-tp-mint p-6">
              <p className="font-display text-4xl font-extrabold opacity-35">01</p>
              <p className="mt-2 text-lg font-bold">Who&apos;s coming?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TYPE_CHIPS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleIn(types, setTypes, t)}
                    className={`chip ${types.includes(t) ? "chip-active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-hard bg-tp-yellow p-6">
              <p className="font-display text-4xl font-extrabold opacity-35">02</p>
              <p className="mt-2 text-lg font-bold">How long &amp; how much?</p>
              <input
                type="range"
                min={150}
                max={1200}
                step={10}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="mt-5 w-full accent-tp-ink"
              />
              <div className="mt-1 flex justify-between text-xs font-bold">
                <span>5 nights</span>
                <span>{money(budget)} budget</span>
              </div>
            </div>

            <div className="card-hard card-hard-orange bg-tp-orange p-6 text-white">
              <p className="font-display text-4xl font-extrabold opacity-45">03</p>
              <p className="mt-2 text-lg font-bold">Build it</p>
              <p className="mt-2 text-sm opacity-90">
                We draft the days, drop in flights and beds, and keep a
                running total.
              </p>
              <Link
                href="/signup"
                className="mt-4 block rounded-full bg-tp-cream py-3 text-center text-sm font-bold text-tp-ink"
              >
                Let&apos;s go →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-tp-ink/50 sm:px-12">
        Tripiani &mdash; an MVP demo.
      </footer>
    </div>
  );
}
