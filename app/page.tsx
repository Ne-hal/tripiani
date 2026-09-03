import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-black">
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          TripPlanner
        </span>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-12">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Plan your next trip in minutes, not weekends.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Tell us your travel style once. TripPlanner matches you with hotels,
          flights, and day-by-day itineraries tailored to your budget and
          interests &mdash; then hands you off to book wherever you like.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-foreground hover:opacity-90"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-300 px-8 py-3 text-base font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm font-semibold text-accent">1. Tell us about you</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Budget, interests, and travel style &mdash; a two-minute one-time
              setup.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm font-semibold text-accent">2. Create a trip</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Pick dates and a destination &mdash; we generate matched
              recommendations instantly.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm font-semibold text-accent">3. Book &amp; go</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Export your itinerary as a PDF and jump straight to booking
              sites.
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-zinc-400 sm:px-12">
        TripPlanner &mdash; an MVP demo.
      </footer>
    </div>
  );
}
