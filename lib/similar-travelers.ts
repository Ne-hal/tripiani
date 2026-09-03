import { formatBHD } from "@/lib/currency";

export type SimilarTraveler = {
  category: string;
  quote: string;
  cost: string;
  image: string;
};

export const SIMILAR_TRAVELERS: SimilarTraveler[] = [
  {
    category: "Food & culture",
    quote: "A 5-day food & culture trip through Lisbon's old town and riverside markets.",
    cost: `${formatBHD(820)} total`,
    image:
      "https://images.unsplash.com/photo-1753558335152-31fae9d9f173?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Nature & hiking",
    quote: "A Kyoto itinerary with temple hikes and quiet garden mornings.",
    cost: `${formatBHD(610)} total`,
    image:
      "https://images.unsplash.com/photo-1531021713651-fdd4ac075ac1?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Nightlife & food",
    quote: "A New York long-weekend built around live music and tasting menus.",
    cost: `${formatBHD(1140)} total`,
    image:
      "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?auto=format&fit=crop&w=800&q=80",
  },
];
