import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatBHD } from "@/lib/currency";
import type { RecommendationSet, Trip } from "@/lib/types";
import { ExportPdfButton } from "./export-pdf-button";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function nightsBetween(start: string, end: string): number {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

// Rough dollar ceiling per budget tier, used only to color the running
// total as a friendly "within budget" / "over budget" hint — not a
// precision calculation.
const BUDGET_CEILING: Record<Trip["budget_range"], number> = {
  budget: 800,
  mid: 2000,
  luxury: 5000,
};

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
  const topItinerary = recommendations?.itinerary_options[0];
  const nights = nightsBetween(trip.start_date, trip.end_date);

  const hotelCost = topHotel ? topHotel.price_per_night * nights : 0;
  const flightCost = topTransport?.price ?? 0;
  const itineraryCost = topItinerary?.estimated_cost ?? 0;
  const runningTotal = hotelCost + flightCost + itineraryCost;
  const ceiling = BUDGET_CEILING[trip.budget_range];
  const withinBudget = runningTotal <= ceiling;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/trips" className="text-sm font-semibold text-tp-ink/70 hover:text-tp-ink">
          &larr; Back to trips
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
              {trip.destination || "Trip"}
            </h1>
            <p className="mt-2 text-sm text-tp-ink/70">
              {formatDate(trip.start_date)} &ndash; {formatDate(trip.end_date)} &middot;{" "}
              <span className="capitalize">{trip.budget_range}</span> budget
              {trip.purpose ? ` · ${trip.purpose}` : ""}
              {trip.companions?.count
                ? ` · ${trip.companions.count} traveler${trip.companions.count > 1 ? "s" : ""}`
                : ""}
              {" · "}
              <span className="badge-static ml-1 capitalize">{trip.status}</span>
            </p>
          </div>

          {recommendations && (
            <div className="card-hard card-hard-orange w-full max-w-xs shrink-0 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-tp-ink/50">
                Running total
              </p>
              <p className="font-display mt-1 text-3xl font-extrabold">
                {formatBHD(runningTotal)}
              </p>
              <span
                className={`badge-static mt-2 inline-flex ${
                  withinBudget ? "bg-tp-mint text-tp-ink" : "bg-tp-yellow text-tp-ink"
                }`}
              >
                {withinBudget ? "Within budget" : "Over budget"}
              </span>
            </div>
          )}
        </div>
      </div>

      {!recommendations ? (
        <div className="card-hard p-8 text-center text-sm text-tp-ink/70">
          Recommendations haven&apos;t been generated for this trip yet. This
          can happen if your profile wasn&apos;t set up when the trip was
          created &mdash;{" "}
          <Link href="/about" className="font-semibold underline underline-offset-2">
            complete your profile
          </Link>{" "}
          and create a new trip.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="font-display text-2xl font-extrabold">Day-by-day itinerary</h2>
              <div className="mt-4 flex flex-col gap-4">
                {recommendations.itinerary_options.map((itinerary, index) => (
                  <div
                    key={itinerary.id}
                    className={`card-hard p-5 ${index === 0 ? "card-hard-orange" : ""}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-lg font-extrabold">{itinerary.title}</p>
                          {index === 0 && <span className="badge-sticker">Best match</span>}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-wide text-tp-ink/50">
                          {itinerary.tags.join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-tp-ink">
                          {formatBHD(itinerary.estimated_cost)} est.
                        </span>
                      </div>
                    </div>
                    <div className="dashed-divider mt-4 grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
                      {itinerary.days.map((day) => (
                        <div key={day.day} className="rounded-xl border-2 border-tp-ink/15 p-3">
                          <p className="text-sm font-bold text-tp-ink">Day {day.day}</p>
                          <p className="mt-1 text-sm text-tp-ink/70">
                            {day.activities.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-extrabold">Flights</h2>
              <div className="mt-4 flex flex-col gap-3">
                {recommendations.transport_options.map((transport, index) => (
                  <div
                    key={transport.id}
                    className={`card-hard-sm flex flex-wrap items-center justify-between gap-3 p-4 ${
                      index === 0 ? "card-hard-orange" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 && <span className="badge-sticker">Best match</span>}
                      <div>
                        <p className="font-semibold text-tp-ink">{transport.airline}</p>
                        <p className="text-sm capitalize text-tp-ink/60">
                          {transport.cabin_class} &middot;{" "}
                          {transport.direct ? "Direct" : "Connecting"}
                        </p>
                      </div>
                    </div>
                    <span className="font-display text-xl font-extrabold">{formatBHD(transport.price)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-extrabold">Hotels</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommendations.hotel_options.map((hotel, index) => (
                  <div
                    key={hotel.id}
                    className={`card-hard p-4 ${index === 0 ? "card-hard-orange" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-lg font-extrabold">{hotel.name}</p>
                      {index === 0 && <span className="badge-sticker shrink-0">Best match</span>}
                    </div>
                    <p className="mt-1 text-sm text-tp-ink/60">
                      {hotel.city} &middot; {"★".repeat(hotel.star_rating)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-tp-ink">
                      {formatBHD(hotel.price_per_night)}
                      <span className="font-normal text-tp-ink/60"> / night</span>
                    </p>
                    <p className="dashed-divider mt-3 pt-3 text-xs text-tp-ink/60">
                      {hotel.amenities.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="card-hard p-6">
              <h2 className="font-display text-xl font-extrabold">Cost breakdown</h2>
              <div className="dashed-divider mt-4 flex flex-col gap-2 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-tp-ink/70">Flight</span>
                  <span className="font-semibold">{formatBHD(flightCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tp-ink/70">Hotel &times; {nights} night{nights > 1 ? "s" : ""}</span>
                  <span className="font-semibold">{formatBHD(hotelCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tp-ink/70">Itinerary (est.)</span>
                  <span className="font-semibold">{formatBHD(itineraryCost)}</span>
                </div>
              </div>
              <div className="dashed-divider mt-3 flex items-center justify-between pt-3">
                <span className="font-display text-lg font-extrabold">Total</span>
                <span className="font-display text-lg font-extrabold">
                  {formatBHD(runningTotal)}
                </span>
              </div>
            </section>

            <section className="card-hard p-6">
              <h2 className="font-display text-xl font-extrabold">Ready to book</h2>
              <p className="mt-1 text-sm text-tp-ink/70">
                Tripiani doesn&apos;t process bookings &mdash; we hand you off
                to a real search so you can compare and book directly.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <ExportPdfButton
                  trip={trip}
                  recommendations={recommendations}
                  topHotel={topHotel}
                  topTransport={topTransport}
                />
                <a
                  href={bookingHotelUrl(trip.destination)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill btn-secondary text-sm"
                >
                  Search hotels &rarr;
                </a>
                <a
                  href={bookingFlightUrl(trip.destination)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill btn-secondary text-sm"
                >
                  Search flights &rarr;
                </a>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
