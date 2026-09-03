"use client";

import { useActionState, useState } from "react";
import type { Profile } from "@/lib/types";
import {
  AGE_RANGE_OPTIONS,
  AIRLINE_OPTIONS,
  BUDGET_RANGES,
  DIRECT_FLIGHTS_ONLY_TAG,
  HOTEL_PREFERENCE_OPTIONS,
  INTEREST_OPTIONS,
  TRAVELING_AS_OPTIONS,
  TRIP_STYLE_OPTIONS,
} from "@/lib/constants";
import type { ProfileFormState } from "@/lib/actions/profile";

interface ToggleGroupProps {
  name: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  formatLabel?: (value: string) => string;
}

function ToggleGroup({ name, options, selected, onChange, formatLabel }: ToggleGroupProps) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              active
                ? "border-accent bg-accent text-accent-foreground"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {formatLabel ? formatLabel(option) : option}
          </button>
        );
      })}
      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  );
}

interface ProfileFormProps {
  action: (
    prevState: ProfileFormState | undefined,
    formData: FormData,
  ) => Promise<ProfileFormState>;
  initialProfile?: Profile;
  submitLabel?: string;
}

export function ProfileForm({ action, initialProfile, submitLabel = "Save" }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<ProfileFormState | undefined, FormData>(
    action,
    undefined,
  );

  const [hotelPreferences, setHotelPreferences] = useState<string[]>(
    initialProfile?.hotel_preferences ?? [],
  );
  const [interests, setInterests] = useState<string[]>(initialProfile?.interests ?? []);
  const initialAirlines = initialProfile?.airline_preferences ?? [];
  const [airlinePreferences, setAirlinePreferences] = useState<string[]>(
    initialAirlines.filter((a) => a !== DIRECT_FLIGHTS_ONLY_TAG),
  );
  const [directOnly, setDirectOnly] = useState<boolean>(
    initialAirlines.includes(DIRECT_FLIGHTS_ONLY_TAG),
  );

  const combinedAirlinePreferences = directOnly
    ? [...airlinePreferences, DIRECT_FLIGHTS_ONLY_TAG]
    : airlinePreferences;

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Budget range</h2>
        <div className="flex gap-2">
          {BUDGET_RANGES.map((option) => (
            <label
              key={option.value}
              className="flex-1 cursor-pointer rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground dark:border-zinc-700"
            >
              <input
                type="radio"
                name="budget_range"
                value={option.value}
                defaultChecked={initialProfile?.budget_range === option.value}
                required
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Hotel preferences
        </h2>
        <p className="text-xs text-zinc-500">Pick any amenities you care about.</p>
        <ToggleGroup
          name="hotel_preferences"
          options={HOTEL_PREFERENCE_OPTIONS}
          selected={hotelPreferences}
          onChange={setHotelPreferences}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Interests &amp; hobbies
        </h2>
        <p className="text-xs text-zinc-500">
          Used to match itineraries to what you like doing.
        </p>
        <ToggleGroup
          name="interests"
          options={INTEREST_OPTIONS}
          selected={interests}
          onChange={setInterests}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Age range</h2>
          <select
            name="age_range"
            defaultValue={initialProfile?.demographic?.age_range ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Prefer not to say</option>
            {AGE_RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Traveling as
          </h2>
          <select
            name="traveling_as"
            defaultValue={initialProfile?.demographic?.traveling_as ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Prefer not to say</option>
            {TRAVELING_AS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Airline preferences
        </h2>
        <ToggleGroup
          name="airline_preferences"
          options={AIRLINE_OPTIONS}
          selected={airlinePreferences}
          onChange={setAirlinePreferences}
          formatLabel={(v) => v}
        />
        <label className="mt-1 flex w-fit items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Direct flights only
        </label>
        {combinedAirlinePreferences.map((value) => (
          <input key={value} type="hidden" name="airline_preferences" value={value} />
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Trip style</h2>
        <div className="flex gap-3">
          {TRIP_STYLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex-1 cursor-pointer rounded-lg border border-zinc-300 p-3 text-sm has-[:checked]:border-accent has-[:checked]:ring-1 has-[:checked]:ring-accent dark:border-zinc-700"
            >
              <input
                type="radio"
                name="trip_style"
                value={option.value}
                defaultChecked={initialProfile?.trip_style === option.value}
                required
                className="sr-only"
              />
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{option.label}</span>
              <p className="mt-1 text-xs text-zinc-500">{option.description}</p>
            </label>
          ))}
        </div>
      </section>

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
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
