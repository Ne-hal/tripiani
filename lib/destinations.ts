export type Destination = {
  name: string;
  blurb: string;
  price?: string;
  image: string;
};

export const DESTINATIONS: Destination[] = [
  {
    name: "Lisbon",
    blurb: "Coastal charm & pastel streets",
    price: "from $65/night",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kyoto",
    blurb: "Temples, gardens & quiet lanes",
    price: "from $40/night",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "New York",
    blurb: "Nonstop energy, world-class food",
    price: "from $85/night",
    image:
      "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cancun",
    blurb: "Beaches & all-inclusive resorts",
    price: "from $140/night",
    image:
      "https://images.unsplash.com/photo-1573616225673-4a16f14c6a5f?auto=format&fit=crop&w=800&q=80",
  },
];

export const TODAYS_PICK: Destination = {
  name: "Reykjavik",
  blurb: "Northern lights & hot springs, 4 days",
  image:
    "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=80",
};

const ALL_DESTINATIONS = [...DESTINATIONS, TODAYS_PICK];

export function findDestinationImage(destinationName: string | null | undefined): string | null {
  if (!destinationName) return null;
  const needle = destinationName.trim().toLowerCase();
  const match = ALL_DESTINATIONS.find((d) => d.name.toLowerCase() === needle);
  return match?.image ?? null;
}
