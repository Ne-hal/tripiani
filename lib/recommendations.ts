import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  HotelOption,
  ItineraryOption,
  Profile,
  Trip,
  TransportOption,
} from "@/lib/types";

// -----------------------------------------------------------------------
// Catalog: read from the `hotels`, `flights`, and `itineraries` tables in
// Supabase. Stands in for a real inventory/pricing API.
// -----------------------------------------------------------------------

async function fetchCatalog(supabase: SupabaseClient) {
  const [hotelsRes, flightsRes, itinerariesRes] = await Promise.all([
    supabase.from("hotels").select("*"),
    supabase.from("flights").select("*"),
    supabase.from("itineraries").select("*"),
  ]);

  if (hotelsRes.error) throw hotelsRes.error;
  if (flightsRes.error) throw flightsRes.error;
  if (itinerariesRes.error) throw itinerariesRes.error;

  return {
    hotels: (hotelsRes.data ?? []) as Omit<HotelOption, "score">[],
    transport: (flightsRes.data ?? []) as Omit<TransportOption, "score">[],
    itineraries: (itinerariesRes.data ?? []) as Omit<ItineraryOption, "score">[],
  };
}

// -----------------------------------------------------------------------
// Scoring helpers
// -----------------------------------------------------------------------

const BUDGET_ORDER: Record<string, number> = { budget: 0, mid: 1, luxury: 2 };

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function destinationMatches(city: string, destination: string | null): boolean {
  if (!destination) return false;
  return city.toLowerCase().includes(destination.trim().toLowerCase()) ||
    destination.trim().toLowerCase().includes(city.toLowerCase());
}

function scoreHotel(
  hotel: Omit<HotelOption, "score">,
  profile: Profile,
  trip: Trip,
): number {
  let score = 40; // baseline so unrelated items aren't zeroed out

  // Destination relevance is the strongest signal.
  if (destinationMatches(hotel.city, trip.destination)) score += 25;

  // Budget alignment: closer budget tier = higher score.
  const tripBudgetIdx = BUDGET_ORDER[trip.budget_range] ?? 1;
  const impliedTier = hotel.price_per_night < 90 ? 0 : hotel.price_per_night < 200 ? 1 : 2;
  const budgetDistance = Math.abs(tripBudgetIdx - impliedTier);
  score += budgetDistance === 0 ? 20 : budgetDistance === 1 ? 8 : -10;

  // Amenity/preference overlap.
  const prefs = profile.hotel_preferences.map((p) => p.toLowerCase());
  const amenities = hotel.amenities.map((a) => a.toLowerCase());
  const overlap = prefs.filter((p) => amenities.includes(p)).length;
  score += overlap * 8;

  // Slight boost for higher star rating as a tiebreaker.
  score += hotel.star_rating * 1.5;

  return clampScore(score);
}

function scoreTransport(
  transport: Omit<TransportOption, "score">,
  profile: Profile,
  trip: Trip,
): number {
  let score = 45;

  const airlinePrefs = profile.airline_preferences.map((a) => a.toLowerCase());
  if (airlinePrefs.includes(transport.airline.toLowerCase())) score += 20;
  if (airlinePrefs.includes("direct-only") && transport.direct) score += 15;
  if (transport.direct) score += 10;

  const tripBudgetIdx = BUDGET_ORDER[trip.budget_range] ?? 1;
  const impliedTier = transport.price < 300 ? 0 : transport.price < 800 ? 1 : 2;
  const budgetDistance = Math.abs(tripBudgetIdx - impliedTier);
  score += budgetDistance === 0 ? 20 : budgetDistance === 1 ? 5 : -15;

  if (profile.trip_style === "organized" && transport.direct) score += 5;

  return clampScore(score);
}

function scoreItinerary(
  itinerary: Omit<ItineraryOption, "score">,
  profile: Profile,
  trip: Trip,
): number {
  let score = 35;

  const interests = profile.interests.map((i) => i.toLowerCase());
  const tags = itinerary.tags.map((t) => t.toLowerCase());
  const overlap = interests.filter((i) => tags.includes(i)).length;
  score += overlap * 18;

  if (trip.companions?.relationship === "family" && tags.includes("family")) score += 15;

  const tripBudgetIdx = BUDGET_ORDER[trip.budget_range] ?? 1;
  const impliedTier = itinerary.estimated_cost < 180 ? 0 : itinerary.estimated_cost < 250 ? 1 : 2;
  const budgetDistance = Math.abs(tripBudgetIdx - impliedTier);
  score += budgetDistance === 0 ? 15 : budgetDistance === 1 ? 5 : -8;

  if (profile.trip_style === "organized") score += 5;

  return clampScore(score);
}

// -----------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------

export interface GeneratedRecommendations {
  hotel_options: HotelOption[];
  transport_options: TransportOption[];
  itinerary_options: ItineraryOption[];
}

export async function generateRecommendations(
  supabase: SupabaseClient,
  profile: Profile,
  trip: Trip,
): Promise<GeneratedRecommendations> {
  const { hotels, transport, itineraries } = await fetchCatalog(supabase);

  const hotel_options = hotels
    .map((hotel) => ({ ...hotel, score: scoreHotel(hotel, profile, trip) }))
    .sort((a, b) => b.score - a.score);

  const transport_options = transport
    .map((option) => ({ ...option, score: scoreTransport(option, profile, trip) }))
    .sort((a, b) => b.score - a.score);

  const itinerary_options = itineraries
    .map((itinerary) => ({ ...itinerary, score: scoreItinerary(itinerary, profile, trip) }))
    .sort((a, b) => b.score - a.score);

  return { hotel_options, transport_options, itinerary_options };
}
