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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start_date" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Start date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="end_date" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            End date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="destination" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Destination <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="destination"
          name="destination"
          type="text"
          defaultValue={defaultDestination}
          placeholder="e.g. Lisbon, Kyoto, New York"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="budget_range" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Trip budget
        </label>
        <select
          id="budget_range"
          name="budget_range"
          required
          defaultValue={defaultBudget ?? ""}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
        <label htmlFor="purpose" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Travel purpose <span className="text-zinc-400">(optional)</span>
        </label>
        <select
          id="purpose"
          name="purpose"
          defaultValue=""
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Not specified</option>
          {TRIP_PURPOSE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="companion_count" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Travelers <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="companion_count"
            name="companion_count"
            type="number"
            min={1}
            max={20}
            placeholder="e.g. 2"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="companion_relationship" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Traveling with <span className="text-zinc-400">(optional)</span>
          </label>
          <select
            id="companion_relationship"
            name="companion_relationship"
            defaultValue=""
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Creating trip..." : "Create trip & get recommendations"}
      </button>
    </form>
  );
}
