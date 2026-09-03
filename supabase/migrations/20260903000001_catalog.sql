-- Recommendation catalog: hotels, flights, itineraries.
-- Previously hardcoded as static arrays in lib/recommendations.ts; now lives
-- in the database so the recommendation engine reads real rows. Public
-- reference data (no user ownership), readable by any authenticated user.
-- Full reset, same pattern as the init migration: safe to re-run.

drop table if exists hotels cascade;
drop table if exists flights cascade;
drop table if exists itineraries cascade;

create table hotels (
  id text primary key,
  name text not null,
  city text not null,
  star_rating smallint not null check (star_rating between 1 and 5),
  price_per_night numeric not null check (price_per_night >= 0),
  amenities text[] not null default '{}'
);

create table flights (
  id text primary key,
  airline text not null,
  cabin_class text not null,
  direct boolean not null default false,
  price numeric not null check (price >= 0)
);

create table itineraries (
  id text primary key,
  title text not null,
  tags text[] not null default '{}',
  days jsonb not null default '[]',
  estimated_cost numeric not null check (estimated_cost >= 0)
);

alter table hotels enable row level security;
alter table flights enable row level security;
alter table itineraries enable row level security;

create policy "hotels are readable by authenticated users" on hotels
  for select
  to authenticated
  using (true);

create policy "flights are readable by authenticated users" on flights
  for select
  to authenticated
  using (true);

create policy "itineraries are readable by authenticated users" on itineraries
  for select
  to authenticated
  using (true);

insert into hotels (id, name, city, star_rating, price_per_night, amenities) values
  ('hotel-1', 'Seaside Budget Inn', 'Lisbon', 2, 65, '{wifi,breakfast}'),
  ('hotel-2', 'Lisbon Central Hostel & Suites', 'Lisbon', 3, 95, '{wifi,pool,breakfast}'),
  ('hotel-3', 'Grand Riverside Lisbon', 'Lisbon', 5, 340, '{wifi,pool,spa,gym,breakfast,"room service"}'),
  ('hotel-4', 'Kyoto Zen Ryokan', 'Kyoto', 4, 180, '{wifi,onsen,breakfast}'),
  ('hotel-5', 'Kyoto Backpacker House', 'Kyoto', 2, 40, '{wifi}'),
  ('hotel-6', 'New York Midtown Suites', 'New York', 4, 260, '{wifi,gym,"room service"}'),
  ('hotel-7', 'Brooklyn Budget Stay', 'New York', 2, 85, '{wifi,breakfast}'),
  ('hotel-8', 'Cancun All-Inclusive Resort', 'Cancun', 5, 310, '{wifi,pool,spa,"beach access",breakfast}'),
  ('hotel-9', 'Cancun Beachfront Mid', 'Cancun', 3, 140, '{wifi,pool,"beach access"}'),
  ('hotel-10', 'Reykjavik Boutique Lodge', 'Reykjavik', 4, 210, '{wifi,breakfast,gym}');

insert into flights (id, airline, cabin_class, direct, price) values
  ('flight-1', 'AeroBudget', 'economy', false, 220),
  ('flight-2', 'AeroBudget', 'economy', true, 310),
  ('flight-3', 'SkyLuxe Airways', 'business', true, 1450),
  ('flight-4', 'SkyLuxe Airways', 'premium economy', true, 620),
  ('flight-5', 'Continental Wings', 'economy', true, 380),
  ('flight-6', 'Continental Wings', 'economy', false, 260),
  ('flight-7', 'GlobeJet', 'first', true, 2600),
  ('flight-8', 'GlobeJet', 'economy', false, 195);

insert into itineraries (id, title, tags, days, estimated_cost) values
  ('itin-1', 'Hiking & Nature Escape', '{hiking,nature,outdoors}', '[
    {"day": 1, "activities": ["Arrive, short orientation walk", "Sunset viewpoint hike"]},
    {"day": 2, "activities": ["Full-day guided trail hike", "Riverside picnic lunch"]},
    {"day": 3, "activities": ["Waterfall trek", "Local trailhead market"]}
  ]', 180),
  ('itin-2', 'Museums & Culture Deep Dive', '{museums,culture,history}', '[
    {"day": 1, "activities": ["National history museum", "Old town walking tour"]},
    {"day": 2, "activities": ["Art gallery district", "Guided architecture tour"]},
    {"day": 3, "activities": ["Local crafts workshop", "Evening cultural show"]}
  ]', 220),
  ('itin-3', 'Nightlife & Food Crawl', '{nightlife,food,bars}', '[
    {"day": 1, "activities": ["Street food market tour", "Rooftop bar sunset"]},
    {"day": 2, "activities": ["Chef''s table tasting menu", "Late-night live music venue"]}
  ]', 260),
  ('itin-4', 'Beach & Relaxation', '{beaches,relaxation,swimming}', '[
    {"day": 1, "activities": ["Beach day, umbrella & loungers", "Sunset catamaran cruise"]},
    {"day": 2, "activities": ["Snorkeling excursion", "Beachside spa treatment"]},
    {"day": 3, "activities": ["Free beach day", "Seafood dinner on the pier"]}
  ]', 150),
  ('itin-5', 'Family Friendly Sightseeing', '{family,sightseeing,kids}', '[
    {"day": 1, "activities": ["City zoo or aquarium", "Park picnic"]},
    {"day": 2, "activities": ["Interactive science museum", "Amusement park half-day"]},
    {"day": 3, "activities": ["Boat tour", "Ice cream & waterfront stroll"]}
  ]', 200),
  ('itin-6', 'Foodie & Market Tour', '{food,markets,cooking}', '[
    {"day": 1, "activities": ["Farmers market tour", "Hands-on cooking class"]},
    {"day": 2, "activities": ["Vineyard or brewery visit", "Tasting-menu dinner"]}
  ]', 240);
