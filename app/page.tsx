import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS as PREVIEW_DESTINATIONS } from "@/lib/destinations";
import { SIMILAR_TRAVELERS } from "@/lib/similar-travelers";

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
                <div className="relative flex h-32 items-end p-3">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="badge-static absolute right-3 top-3 z-10">Preview</span>
                  <span className="font-display relative z-10 text-lg font-extrabold text-white drop-shadow">
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

        <div className="-mx-6 mt-24 bg-tp-ink px-6 py-16 text-tp-cream sm:-mx-12 sm:px-12">
          <div className="mx-auto max-w-5xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
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
                      <Link href="/signup" className="btn-pill btn-secondary py-1.5 text-xs">
                        Sign up to see more
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
