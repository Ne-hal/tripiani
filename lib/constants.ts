// Fixed option lists used by the profile builder / editor and, where noted,
// cross-referenced by the recommendation engine's mock catalog.

export const BUDGET_RANGES: { value: "budget" | "mid" | "luxury"; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "mid", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
];

export const HOTEL_PREFERENCE_OPTIONS = [
  "wifi",
  "breakfast",
  "pool",
  "spa",
  "gym",
  "room service",
  "beach access",
  "onsen",
];

export const INTEREST_OPTIONS = [
  "hiking",
  "museums",
  "nightlife",
  "food",
  "beaches",
  "culture",
  "history",
  "nature",
  "family",
  "markets",
  "sightseeing",
  "relaxation",
];

export const AIRLINE_OPTIONS = [
  "AeroBudget",
  "SkyLuxe Airways",
  "Continental Wings",
  "GlobeJet",
];

// Stored as an extra entry inside `airline_preferences` rather than a new
// schema column, per the spec's "keep it simple" allowance.
export const DIRECT_FLIGHTS_ONLY_TAG = "direct-only";

export const AGE_RANGE_OPTIONS = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
];

export const TRAVELING_AS_OPTIONS: { value: "solo" | "couple" | "family"; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
];

export const TRIP_STYLE_OPTIONS: { value: "flexible" | "organized"; label: string; description: string }[] = [
  {
    value: "flexible",
    label: "Flexible",
    description: "Loose plans, room to wander and decide as you go.",
  },
  {
    value: "organized",
    label: "Organized",
    description: "A structured day-by-day plan booked ahead of time.",
  },
];

export const TRIP_PURPOSE_OPTIONS = [
  "Leisure",
  "Honeymoon",
  "Business",
  "Family visit",
  "Adventure",
  "Celebration",
];

export const COMPANION_RELATIONSHIP_OPTIONS: { value: "solo" | "partner" | "family" | "friends"; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];
