import Link from "next/link";

const PREVIEW_DESTINATIONS: { name: string; blurb: string; gradient: string }[] = [
  { name: "Lisbon", blurb: "Coastal charm & pastel streets", gradient: "from-orange-400 to-rose-500" },
  { name: "Kyoto", blurb: "Temples, gardens & quiet lanes", gradient: "from-emerald-400 to-teal-600" },
  { name: "New York", blurb: "Nonstop energy, world-class food", gradient: "from-indigo-500 to-purple-600" },
  { name: "Cancun", blurb: "Beaches & all-inclusive resorts", gradient: "from-sky-400 to-cyan-600" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-tp-cream">
      <header className="sticky top-0 z-10 bg-tp-ink text-tp-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <span className="font-display text-xl font-extrabold tracking-tight">
            Tripiani
          </span>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-pill btn-primary text-sm"
            >
              Join free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-16 text-center sm:px-12 sm:py-24">
        <span className="badge-sticker">Plan smarter, not harder</span>
        <h1 className="font-display mt-6 max-w-3xl text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
          Where next?
        </h1>
        <p className="mt-6 max-w-xl text-lg text-tp-ink/80">
          Tell us your travel style once. Tripiani matches you with hotels,
          flights, and day-by-day itineraries tailored to your budget and
          interests &mdash; then hands you off to book wherever you like.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/signup" className="btn-pill btn-primary">
            Get started free
          </Link>
          <Link href="/login" className="btn-pill btn-secondary">
            I already have an account
          </Link>
        </div>

        <div className="mt-24 w-full max-w-5xl text-left">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Suggested destinations
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PREVIEW_DESTINATIONS.map((dest) => (
              <div key={dest.name} className="card-hard overflow-hidden">
                <div
                  className={`relative flex h-32 items-end bg-gradient-to-br p-3 ${dest.gradient}`}
                >
                  <span className="badge-static absolute right-3 top-3">Preview</span>
                  <span className="font-display text-lg font-extrabold text-white drop-shadow">
                    {dest.name}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-tp-ink/70">{dest.blurb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="card-hard bg-tp-mint p-6 text-left">
            <p className="font-display text-3xl font-extrabold">01</p>
            <p className="mt-2 text-sm font-semibold text-tp-ink">Tell us about you</p>
            <p className="mt-1 text-sm text-tp-ink/70">
              Budget, interests, and travel style &mdash; a two-minute one-time
              setup.
            </p>
          </div>
          <div className="card-hard bg-tp-yellow p-6 text-left">
            <p className="font-display text-3xl font-extrabold">02</p>
            <p className="mt-2 text-sm font-semibold text-tp-ink">Create a trip</p>
            <p className="mt-1 text-sm text-tp-ink/70">
              Pick dates and a destination &mdash; we generate matched
              recommendations instantly.
            </p>
          </div>
          <div className="card-hard bg-tp-orange p-6 text-left">
            <p className="font-display text-3xl font-extrabold">03</p>
            <p className="mt-2 text-sm font-semibold text-tp-ink">Book &amp; go</p>
            <p className="mt-1 text-sm text-tp-ink/70">
              Export your itinerary as a PDF and jump straight to booking
              sites.
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-tp-ink/50 sm:px-12">
        Tripiani &mdash; an MVP demo.
      </footer>
    </div>
  );
}
