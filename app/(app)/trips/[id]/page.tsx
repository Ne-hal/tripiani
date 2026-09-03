import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { RecommendationSet, Trip } from "@/lib/types";
import { ExportPdfButton } from "./export-pdf-button";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function bookingHotelUrl(destination: string | null): string {
  const base = "https://www.google.com/travel/hotels";
  return destination ? `${base}?q=${encodeURIComponent(destination)}` : base;
}

function bookingFlightUrl(destination: string | null): string {
  const base = "https://www.google.com/travel/flights";
  return destination
    ? `${base}?q=${encodeURIComponent(`flights to ${destination}`)}`
    : base;
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (tripError || !tripData) {
    notFound();
  }

  const trip = tripData as Trip;

  const { data: recData } = await supabase
    .from("recommendation_sets")
    .select("*")
    .eq("trip_id", id)
    .maybeSingle();

  const recommendations = recData as RecommendationSet | null;

  const topHotel = recommendations?.hotel_options[0];
  const topTransport = recommendations?.transport_options[0];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/trips" className="text-sm text-accent hover:underline">
          &larr; Back to trips
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {trip.destination || "Trip"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {formatDate(trip.start_date)} &ndash; {formatDate(trip.end_date)} &middot;{" "}
              <span className="capitalize">{trip.budget_range}</span> budget
              {trip.purpose ? ` · ${trip.purpose}` : ""}
              {trip.companions?.count
                ? ` · ${trip.companions.count} traveler${trip.companions.count > 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
          <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {trip.status}
          </span>
        </div>
      </div>

      {!recommendations ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Recommendations haven&apos;t been generated for this trip yet. This
          can happen if your profile wasn&apos;t set up when the trip was
          created &mdash;{" "}
          <Link href="/about" className="font-medium text-accent hover:underline">
            complete your profile
          </Link>{" "}
          and create a new trip.
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Hotel options
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.hotel_options.map((hotel, index) => (
                <div
                  key={hotel.id}
                  className={`rounded-xl border p-4 ${
                    index === 0
                      ? "border-accent ring-1 ring-accent"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{hotel.name}</p>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      {hotel.score}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {hotel.city} &middot; {"★".repeat(hotel.star_rating)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    ${hotel.price_per_night}
                    <span className="font-normal text-zinc-500"> / night</span>
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {hotel.amenities.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Flights &amp; transport
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.transport_options.map((transport, index) => (
                <div
                  key={transport.id}
                  className={`rounded-xl border p-4 ${
                    index === 0
                      ? "border-accent ring-1 ring-accent"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {transport.airline}
                    </p>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      {transport.score}
                    </span>
                  </div>
                  <p className="text-sm capitalize text-zinc-500">
                    {transport.cabin_class} &middot;{" "}
                    {transport.direct ? "Direct" : "Connecting"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    ${transport.price}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Itinerary options
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              {recommendations.itinerary_options.map((itinerary, index) => (
                <div
                  key={itinerary.id}
                  className={`rounded-xl border p-4 ${
                    index === 0
                      ? "border-accent ring-1 ring-accent"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {itinerary.title}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-zinc-400">
                        {itinerary.tags.join(" · ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                        {itinerary.score}
                      </span>
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        ${itinerary.estimated_cost} est.
                      </span>
                    </div>
                  </div>
                  <ol className="mt-3 flex flex-col gap-2">
                    {itinerary.days.map((day) => (
                      <li key={day.day} className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          Day {day.day}:
                        </span>{" "}
                        {day.activities.join(", ")}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Ready to book
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              TripPlanner doesn&apos;t process bookings &mdash; we hand you off
              to a real search so you can compare and book directly.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={bookingHotelUrl(trip.destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent dark:border-zinc-700"
              >
                Search hotels &rarr;
              </a>
              <a
                href={bookingFlightUrl(trip.destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent dark:border-zinc-700"
              >
                Search flights &rarr;
              </a>
              <ExportPdfButton trip={trip} recommendations={recommendations} topHotel={topHotel} topTransport={topTransport} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
