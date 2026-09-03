import type {
  HotelOption,
  ItineraryOption,
  Profile,
  Trip,
  TransportOption,
} from "@/lib/types";

// -----------------------------------------------------------------------
// Static mock catalog. This stands in for a real inventory/pricing API.
// -----------------------------------------------------------------------

const MOCK_HOTELS: Omit<HotelOption, "score">[] = [
  {
    id: "hotel-1",
    name: "Seaside Budget Inn",
    city: "Lisbon",
    star_rating: 2,
    price_per_night: 65,
    amenities: ["wifi", "breakfast"],
  },
  {
    id: "hotel-2",
    name: "Lisbon Central Hostel & Suites",
    city: "Lisbon",
    star_rating: 3,
    price_per_night: 95,
    amenities: ["wifi", "pool", "breakfast"],
  },
  {
    id: "hotel-3",
    name: "Grand Riverside Lisbon",
    city: "Lisbon",
    star_rating: 5,
    price_per_night: 340,
    amenities: ["wifi", "pool", "spa", "gym", "breakfast", "room service"],
  },
  {
    id: "hotel-4",
    name: "Kyoto Zen Ryokan",
    city: "Kyoto",
    star_rating: 4,
    price_per_night: 180,
    amenities: ["wifi", "onsen", "breakfast"],
  },
  {
    id: "hotel-5",
    name: "Kyoto Backpacker House",
    city: "Kyoto",
    star_rating: 2,
    price_per_night: 40,
    amenities: ["wifi"],
  },
  {
    id: "hotel-6",
    name: "New York Midtown Suites",
    city: "New York",
    star_rating: 4,
    price_per_night: 260,
    amenities: ["wifi", "gym", "room service"],
  },
  {
    id: "hotel-7",
    name: "Brooklyn Budget Stay",
    city: "New York",
    star_rating: 2,
    price_per_night: 85,
    amenities: ["wifi", "breakfast"],
  },
  {
    id: "hotel-8",
    name: "Cancun All-Inclusive Resort",
    city: "Cancun",
    star_rating: 5,
    price_per_night: 310,
    amenities: ["wifi", "pool", "spa", "beach access", "breakfast"],
  },
  {
    id: "hotel-9",
    name: "Cancun Beachfront Mid",
    city: "Cancun",
    star_rating: 3,
    price_per_night: 140,
    amenities: ["wifi", "pool", "beach access"],
  },
  {
    id: "hotel-10",
    name: "Reykjavik Boutique Lodge",
    city: "Reykjavik",
    star_rating: 4,
    price_per_night: 210,
    amenities: ["wifi", "breakfast", "gym"],
  },
];

const MOCK_TRANSPORT: Omit<TransportOption, "score">[] = [
  { id: "flight-1", airline: "AeroBudget", cabin_class: "economy", direct: false, price: 220 },
  { id: "flight-2", airline: "AeroBudget", cabin_class: "economy", direct: true, price: 310 },
  { id: "flight-3", airline: "SkyLuxe Airways", cabin_class: "business", direct: true, price: 1450 },
  { id: "flight-4", airline: "SkyLuxe Airways", cabin_class: "premium economy", direct: true, price: 620 },
  { id: "flight-5", airline: "Continental Wings", cabin_class: "economy", direct: true, price: 380 },
  { id: "flight-6", airline: "Continental Wings", cabin_class: "economy", direct: false, price: 260 },
  { id: "flight-7", airline: "GlobeJet", cabin_class: "first", direct: true, price: 2600 },
  { id: "flight-8", airline: "GlobeJet", cabin_class: "economy", direct: false, price: 195 },
];

const MOCK_GROUND_TRANSFERS: { id: string; label: string; price: number }[] = [
  { id: "transfer-shuttle", label: "Airport shuttle", price: 15 },
  { id: "transfer-taxi", label: "Taxi", price: 35 },
  { id: "transfer-private", label: "Private car", price: 70 },
];

const MOCK_ITINERARIES: Omit<ItineraryOption, "score">[] = [
  {
    id: "itin-1",
    title: "Hiking & Nature Escape",
    tags: ["hiking", "nature", "outdoors"],
    days: [
      { day: 1, activities: ["Arrive, short orientation walk", "Sunset viewpoint hike"] },
      { day: 2, activities: ["Full-day guided trail hike", "Riverside picnic lunch"] },
      { day: 3, activities: ["Waterfall trek", "Local trailhead market"] },
    ],
    estimated_cost: 180,
  },
  {
    id: "itin-2",
    title: "Museums & Culture Deep Dive",
    tags: ["museums", "culture", "history"],
    days: [
      { day: 1, activities: ["National history museum", "Old town walking tour"] },
      { day: 2, activities: ["Art gallery district", "Guided architecture tour"] },
      { day: 3, activities: ["Local crafts workshop", "Evening cultural show"] },
    ],
    estimated_cost: 220,
  },
  {
    id: "itin-3",
    title: "Nightlife & Food Crawl",
    tags: ["nightlife", "food", "bars"],
    days: [
      { day: 1, activities: ["Street food market tour", "Rooftop bar sunset"] },
      { day: 2, activities: ["Chef's table tasting menu", "Late-night live music venue"] },
    ],
    estimated_cost: 260,
  },
  {
    id: "itin-4",
    title: "Beach & Relaxation",
    tags: ["beaches", "relaxation", "swimming"],
    days: [
      { day: 1, activities: ["Beach day, umbrella & loungers", "Sunset catamaran cruise"] },
      { day: 2, activities: ["Snorkeling excursion", "Beachside spa treatment"] },
      { day: 3, activities: ["Free beach day", "Seafood dinner on the pier"] },
    ],
    estimated_cost: 150,
  },
  {
    id: "itin-5",
    title: "Family Friendly Sightseeing",
    tags: ["family", "sightseeing", "kids"],
    days: [
      { day: 1, activities: ["City zoo or aquarium", "Park picnic"] },
      { day: 2, activities: ["Interactive science museum", "Amusement park half-day"] },
      { day: 3, activities: ["Boat tour", "Ice cream & waterfront stroll"] },
    ],
    estimated_cost: 200,
  },
  {
    id: "itin-6",
    title: "Foodie & Market Tour",
    tags: ["food", "markets", "cooking"],
    days: [
      { day: 1, activities: ["Farmers market tour", "Hands-on cooking class"] },
      { day: 2, activities: ["Vineyard or brewery visit", "Tasting-menu dinner"] },
    ],
    estimated_cost: 240,
  },
];

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

function scoreGroundTransfer(
  transfer: { id: string; label: string; price: number },
  trip: Trip,
): number {
  let score = 45;

  const tripBudgetIdx = BUDGET_ORDER[trip.budget_range] ?? 1;
  const impliedTier = transfer.price < 25 ? 0 : transfer.price < 50 ? 1 : 2;
  const budgetDistance = Math.abs(tripBudgetIdx - impliedTier);
  score += budgetDistance === 0 ? 20 : budgetDistance === 1 ? 5 : -15;

  return clampScore(score);
}

// -----------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------

export interface GroundTransferOption {
  id: string;
  label: string;
  price: number;
  score: number;
}

export function generateGroundTransferOptions(trip: Trip): GroundTransferOption[] {
  return MOCK_GROUND_TRANSFERS.map((transfer) => ({
    ...transfer,
    score: scoreGroundTransfer(transfer, trip),
  })).sort((a, b) => b.score - a.score);
}

export interface GeneratedRecommendations {
  hotel_options: HotelOption[];
  transport_options: TransportOption[];
  itinerary_options: ItineraryOption[];
}

export function generateRecommendations(
  profile: Profile,
  trip: Trip,
): GeneratedRecommendations {
  const hotel_options = MOCK_HOTELS.map((hotel) => ({
    ...hotel,
    score: scoreHotel(hotel, profile, trip),
  })).sort((a, b) => b.score - a.score);

  const transport_options = MOCK_TRANSPORT.map((transport) => ({
    ...transport,
    score: scoreTransport(transport, profile, trip),
  })).sort((a, b) => b.score - a.score);

  const itinerary_options = MOCK_ITINERARIES.map((itinerary) => ({
    ...itinerary,
    score: scoreItinerary(itinerary, profile, trip),
  })).sort((a, b) => b.score - a.score);

  return { hotel_options, transport_options, itinerary_options };
}
