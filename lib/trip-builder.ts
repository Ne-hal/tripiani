import {
  generateGroundTransferOptions,
  generateRecommendations,
} from "@/lib/recommendations";
import type { BudgetRange, ItineraryOption, Profile, Trip } from "@/lib/types";

export interface PlanStepOption {
  id: string;
  label: string;
  cost: number;
}

export interface PlanStepRow {
  key: string;
  day: number;
  step: string;
  options: PlanStepOption[];
}

export interface TripDraft {
  destination: string | null;
  budget_range: BudgetRange;
  start_date: string;
  end_date: string;
  companions: Trip["companions"];
}

export function daysBetweenInclusive(start: string, end: string): number {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime < startTime) return 0;
  return Math.round((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
}

function transportLabel(t: { airline: string; cabin_class: string; direct: boolean }): string {
  return `${t.airline} · ${t.cabin_class} · ${t.direct ? "Direct" : "Connecting"}`;
}

function dayActivityRows(
  day: number,
  itineraries: ItineraryOption[],
): PlanStepRow[] {
  const dayEntries = itineraries.map((itin) => itin.days[(day - 1) % itin.days.length]);
  const maxActivities = Math.max(0, ...dayEntries.map((entry) => entry.activities.length));

  const rows: PlanStepRow[] = [];
  for (let slot = 0; slot < maxActivities; slot++) {
    const options: PlanStepOption[] = itineraries.map((itin, idx) => {
      const entry = dayEntries[idx];
      const activity = entry.activities[slot] ?? "Free time / explore on your own";
      const perDayCost = itin.estimated_cost / itin.days.length;
      const cost = entry.activities.length
        ? Math.round(perDayCost / entry.activities.length)
        : 0;
      return {
        id: `${itin.id}-d${day}-a${slot}`,
        label: `${activity} — ${itin.title}`,
        cost,
      };
    });
    rows.push({ key: `d${day}-activity${slot}`, day, step: `Activity ${slot + 1}`, options });
  }
  return rows;
}

export function buildDayPlan(profile: Profile, draft: TripDraft): PlanStepRow[] {
  const dayCount = daysBetweenInclusive(draft.start_date, draft.end_date);
  if (dayCount === 0) return [];

  const draftTrip: Trip = {
    id: "draft",
    user_id: "draft",
    start_date: draft.start_date,
    end_date: draft.end_date,
    budget_range: draft.budget_range,
    destination: draft.destination,
    purpose: null,
    companions: draft.companions,
    status: "draft",
    created_at: "",
    updated_at: "",
  };

  const { hotel_options, transport_options, itinerary_options } = generateRecommendations(
    profile,
    draftTrip,
  );
  const topHotels = hotel_options.slice(0, 3);
  const topTransport = transport_options.slice(0, 3);
  const topItineraries = itinerary_options.slice(0, 3);
  const topTransfers = generateGroundTransferOptions(draftTrip).slice(0, 3);

  const destinationLabel = draft.destination || "your destination";
  const rows: PlanStepRow[] = [];

  for (let day = 1; day <= dayCount; day++) {
    if (day === 1) {
      rows.push({
        key: "d1-flight",
        day,
        step: `Flight to ${destinationLabel}`,
        options: topTransport.map((t) => ({ id: t.id, label: transportLabel(t), cost: t.price })),
      });

      if (dayCount > 1) {
        rows.push({
          key: "d1-hotel",
          day,
          step: "Hotel check-in",
          options: topHotels.map((h) => ({
            id: h.id,
            label: `${h.name} (${"★".repeat(h.star_rating)})`,
            cost: h.price_per_night,
          })),
        });
        rows.push({
          key: "d1-transfer",
          day,
          step: "Airport → hotel transfer",
          options: topTransfers.map((tr) => ({ id: tr.id, label: tr.label, cost: tr.price })),
        });
      }
    }

    rows.push(...dayActivityRows(day, topItineraries));

    if (day === dayCount) {
      rows.push({
        key: `d${day}-return`,
        day,
        step: dayCount === 1 ? "Return flight (same day)" : "Return flight",
        options: topTransport.map((t) => ({
          id: `${t.id}-return`,
          label: transportLabel(t),
          cost: t.price,
        })),
      });
    }
  }

  return rows;
}
