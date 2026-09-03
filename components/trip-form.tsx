"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { BUDGET_RANGES, COMPANION_RELATIONSHIP_OPTIONS, TRIP_PURPOSE_OPTIONS } from "@/lib/constants";
import { createTrip, type CreateTripState } from "@/lib/actions/trips";
import { buildDayPlan, daysBetweenInclusive } from "@/lib/trip-builder";
import type { BudgetRange, Profile } from "@/lib/types";

const initialState: CreateTripState = {};

const EMPTY_PROFILE: Profile = {
  id: "draft",
  budget_range: "mid",
  hotel_preferences: [],
  interests: [],
  demographic: {},
  airline_preferences: [],
  trip_style: "flexible",
  created_at: "",
  updated_at: "",
};

const RELATIONSHIPS = ["solo", "partner", "family", "friends"] as const;
type Relationship = (typeof RELATIONSHIPS)[number];

function formatDayDate(startDate: string, dayIndex: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayIndex);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

interface TripFormProps {
  defaultDestination?: string;
  defaultBudget?: string;
  profile?: Profile | null;
  submitLabel?: string;
}

export function TripForm({ defaultDestination, defaultBudget, profile, submitLabel }: TripFormProps) {
  const [state, formAction, isPending] = useActionState(createTrip, initialState);

  const [destination, setDestination] = useState(defaultDestination ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetRange, setBudgetRange] = useState<string>(defaultBudget ?? "");
  const [purpose, setPurpose] = useState("");
  const [companionCount, setCompanionCount] = useState("");
  const [companionRelationship, setCompanionRelationship] = useState("");
  const [selections, setSelections] = useState<Record<string, number>>({});

  const dayCount = daysBetweenInclusive(startDate, endDate);

  const rows = useMemo(() => {
    if (!budgetRange || dayCount === 0) return [];

    const relationship = RELATIONSHIPS.includes(companionRelationship as Relationship)
      ? (companionRelationship as Relationship)
      : undefined;
    const companions =
      companionCount || relationship
        ? { ...(companionCount ? { count: Number(companionCount) } : {}), ...(relationship ? { relationship } : {}) }
        : null;

    const effectiveProfile: Profile = profile ?? { ...EMPTY_PROFILE, budget_range: budgetRange as BudgetRange };

    return buildDayPlan(effectiveProfile, {
      destination: destination.trim() || null,
      budget_range: budgetRange as BudgetRange,
      start_date: startDate,
      end_date: endDate,
      companions,
    });
  }, [profile, destination, budgetRange, startDate, endDate, companionCount, companionRelationship, dayCount]);

  const totalCost = rows.reduce((sum, row) => {
    const selected = row.options[selections[row.key] ?? 0];
    return sum + (selected?.cost ?? 0);
  }, 0);

  // Group consecutive rows by day so the Day column can span all of that day's steps.
  const dayGroups: { day: number; rowCount: number }[] = [];
  for (const row of rows) {
    const last = dayGroups[dayGroups.length - 1];
    if (last && last.day === row.day) {
      last.rowCount += 1;
    } else {
      dayGroups.push({ day: row.day, rowCount: 1 });
    }
  }
  const dayStartRowKeys = new Set<string>();
  {
    let rowIndex = 0;
    for (const group of dayGroups) {
      dayStartRowKeys.add(rows[rowIndex].key);
      rowIndex += group.rowCount;
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="card-hard p-6">
        <h2 className="font-display text-xl font-extrabold">Trip basics</h2>
        <div className="dashed-divider mt-4 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="start_date" className="text-sm font-semibold text-tp-ink">
              Start date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-tp"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="end_date" className="text-sm font-semibold text-tp-ink">
              End date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-tp"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="destination" className="text-sm font-semibold text-tp-ink">
              Destination <span className="font-normal text-tp-ink/50">(optional)</span>
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Lisbon, Kyoto, New York"
              className="input-tp"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="budget_range" className="text-sm font-semibold text-tp-ink">
              Trip budget
            </label>
            <select
              id="budget_range"
              name="budget_range"
              required
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="input-tp"
            >
              <option value="" disabled>
                Choose a budget
              </option>
              {BUDGET_RANGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="purpose" className="text-sm font-semibold text-tp-ink">
              Travel purpose <span className="font-normal text-tp-ink/50">(optional)</span>
            </label>
            <select
              id="purpose"
              name="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="input-tp"
            >
              <option value="">Not specified</option>
              {TRIP_PURPOSE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="companion_count" className="text-sm font-semibold text-tp-ink">
              Travelers <span className="font-normal text-tp-ink/50">(optional)</span>
            </label>
            <input
              id="companion_count"
              name="companion_count"
              type="number"
              min={1}
              max={20}
              value={companionCount}
              onChange={(e) => setCompanionCount(e.target.value)}
              placeholder="e.g. 2"
              className="input-tp"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="companion_relationship" className="text-sm font-semibold text-tp-ink">
              Traveling with <span className="font-normal text-tp-ink/50">(optional)</span>
            </label>
            <select
              id="companion_relationship"
              name="companion_relationship"
              value={companionRelationship}
              onChange={(e) => setCompanionRelationship(e.target.value)}
              className="input-tp"
            >
              <option value="">Not specified</option>
              {COMPANION_RELATIONSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card-hard p-8 text-center text-sm text-tp-ink/70">
          Choose a start date, end date, and budget above to see your day-by-day plan.
        </div>
      ) : (
        <div className="card-hard-lg overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-tp-ink bg-tp-mint px-6 py-4">
            <h2 className="font-display text-xl font-extrabold">Your day-by-day plan</h2>
            <span className="badge-static">
              Option 1 in each row is pre-picked to match your preferences
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-sm">
              <thead>
                <tr className="bg-tp-ink text-tp-cream">
                  <th className="w-28 border-r-2 border-tp-cream/20 px-4 py-3 text-left font-bold">Day</th>
                  <th className="border-r-2 border-tp-cream/20 px-4 py-3 text-left font-bold">Step</th>
                  <th className="border-r-2 border-tp-cream/20 px-4 py-3 text-left font-bold">Option 1</th>
                  <th className="border-r-2 border-tp-cream/20 px-4 py-3 text-left font-bold">Option 2</th>
                  <th className="border-r-2 border-tp-cream/20 px-4 py-3 text-left font-bold">Option 3</th>
                  <th className="px-4 py-3 text-right font-bold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => {
                  const groupInfo = dayGroups.find((g) => g.day === row.day);
                  const isDayStart = dayStartRowKeys.has(row.key);
                  const selectedIndex = selections[row.key] ?? 0;
                  const selectedCost = row.options[selectedIndex]?.cost ?? 0;

                  return (
                    <tr
                      key={row.key}
                      className={`${rowIdx % 2 === 1 ? "bg-tp-cream/60" : "bg-white"} border-t border-tp-ink/10`}
                    >
                      {isDayStart && (
                        <td
                          rowSpan={groupInfo?.rowCount}
                          className="border-r-2 border-tp-ink/15 bg-tp-yellow/40 px-4 py-3 align-top"
                        >
                          <p className="font-display text-lg font-extrabold">Day {row.day}</p>
                          {startDate && (
                            <p className="text-xs text-tp-ink/60">{formatDayDate(startDate, row.day - 1)}</p>
                          )}
                        </td>
                      )}
                      <td className="border-r border-tp-ink/10 px-4 py-3 align-top font-semibold text-tp-ink">
                        {row.step}
                      </td>
                      {[0, 1, 2].map((optionIdx) => {
                        const option = row.options[optionIdx];
                        if (!option) {
                          return (
                            <td key={optionIdx} className="border-r border-tp-ink/10 px-4 py-3 align-top text-tp-ink/30">
                              &mdash;
                            </td>
                          );
                        }
                        const checked = selectedIndex === optionIdx;
                        return (
                          <td key={optionIdx} className="border-r border-tp-ink/10 px-4 py-3 align-top">
                            <label className="flex cursor-pointer items-start gap-2">
                              <input
                                type="radio"
                                name={`select-${row.key}`}
                                checked={checked}
                                onChange={() =>
                                  setSelections((prev) => ({ ...prev, [row.key]: optionIdx }))
                                }
                                className="mt-1 accent-tp-orange"
                              />
                              <span className={checked ? "font-semibold text-tp-ink" : "text-tp-ink/70"}>
                                {option.label}
                                <span className="block text-xs text-tp-ink/50">${option.cost}</span>
                              </span>
                            </label>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-right align-top font-display text-base font-extrabold">
                        ${selectedCost.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="dashed-divider flex items-center justify-between px-6 py-4">
            <span className="font-display text-lg font-extrabold">Estimated total</span>
            <span className="font-display text-2xl font-extrabold">${totalCost.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="card-hard card-hard-orange p-6">
        {state?.error && (
          <p className="mb-4 text-sm font-medium text-tp-ink">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="btn-pill btn-primary disabled:opacity-60"
        >
          {isPending ? "Creating trip..." : (submitLabel ?? "Create trip & get recommendations")}
        </button>
      </div>
    </form>
  );
}
