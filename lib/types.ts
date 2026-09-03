export type BudgetRange = "budget" | "mid" | "luxury";
export type TripStyle = "flexible" | "organized";
export type TripStatus = "draft" | "planned" | "completed";

export interface Profile {
  id: string;
  budget_range: BudgetRange;
  hotel_preferences: string[];
  interests: string[];
  demographic: {
    age_range?: string;
    traveling_as?: "solo" | "couple" | "family";
  };
  airline_preferences: string[];
  trip_style: TripStyle;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  budget_range: BudgetRange;
  destination: string | null;
  purpose: string | null;
  companions: {
    count?: number;
    relationship?: "solo" | "partner" | "family" | "friends";
  } | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface HotelOption {
  id: string;
  name: string;
  city: string;
  star_rating: number;
  price_per_night: number;
  amenities: string[];
  score: number;
}

export interface TransportOption {
  id: string;
  airline: string;
  cabin_class: string;
  direct: boolean;
  price: number;
  score: number;
}

export interface ItineraryOption {
  id: string;
  title: string;
  tags: string[];
  days: { day: number; activities: string[] }[];
  estimated_cost: number;
  score: number;
}

export interface RecommendationSet {
  id: string;
  trip_id: string;
  hotel_options: HotelOption[];
  transport_options: TransportOption[];
  itinerary_options: ItineraryOption[];
  created_at: string;
}
