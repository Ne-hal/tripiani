"use client";

import { useActionState } from "react";
import { BUDGET_RANGES, COMPANION_RELATIONSHIP_OPTIONS, TRIP_PURPOSE_OPTIONS } from "@/lib/constants";
import { createTrip, type CreateTripState } from "./actions";

const initialState: CreateTripState = {};

interface NewTripFormProps {
  defaultDestination?: string;
  defaultBudget?: string;
}

export function NewTripForm({ defaultDestination, defaultBudget }: NewTripFormProps) {
  const [state, formAction, isPending] = useActionState(createTrip, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="card-hard p-6">
        <h2 className="font-display text-xl font-extrabold">Destination &amp; dates</h2>
        <div className="dashed-divider mt-4 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="start_date" className="text-sm font-semibold text-tp-ink">
              Start date
            </label>
            <input id="start_date" name="start_date" type="date" required className="input-tp" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="end_date" className="text-sm font-semibold text-tp-ink">
              End date
            </label>
            <input id="end_date" name="end_date" type="date" required className="input-tp" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="destination" className="text-sm font-semibold text-tp-ink">
              Destination <span className="font-normal text-tp-ink/50">(optional)</span>
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              defaultValue={defaultDestination}
              placeholder="e.g. Lisbon, Kyoto, New York"
              className="input-tp"
            />
          </div>
        </div>
      </div>

      <div className="card-hard bg-tp-mint p-6">
        <h2 className="font-display text-xl font-extrabold">Budget &amp; purpose</h2>
        <div className="dashed-divider mt-4 flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="budget_range" className="text-sm font-semibold text-tp-ink">
              Trip budget
            </label>
            <select
              id="budget_range"
              name="budget_range"
              required
              defaultValue={defaultBudget ?? ""}
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
            <select id="purpose" name="purpose" defaultValue="" className="input-tp">
              <option value="">Not specified</option>
              {TRIP_PURPOSE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card-hard card-hard-orange p-6">
        <h2 className="font-display text-xl font-extrabold">Who&apos;s coming</h2>
        <div className="dashed-divider mt-4 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
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
              defaultValue=""
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

        {state?.error && (
          <p className="dashed-divider mt-4 pt-4 text-sm font-medium text-tp-ink">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn-pill btn-primary mt-6 disabled:opacity-60"
        >
          {isPending ? "Creating trip..." : "Create trip & get recommendations"}
        </button>
      </div>
    </form>
  );
}
