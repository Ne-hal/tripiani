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
            className={`chip capitalize ${active ? "chip-active" : ""}`}
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
  /** Wizard mode (one step visible at a time) vs. all-steps-visible edit mode. */
  wizard?: boolean;
}

const STEP_TITLES = [
  { title: "Your travel basics", subtitle: "Budget and how tightly you like to plan." },
  { title: "Where you stay & fly", subtitle: "Amenities and airlines you tend to prefer." },
  { title: "About you & your interests", subtitle: "Helps us tailor itineraries to what you like doing." },
];

export function ProfileForm({ action, initialProfile, submitLabel = "Save", wizard = true }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<ProfileFormState | undefined, FormData>(
    action,
    undefined,
  );

  const [step, setStep] = useState(0);
  const totalSteps = STEP_TITLES.length;

  const [budgetRange, setBudgetRange] = useState<string>(initialProfile?.budget_range ?? "");
  const [tripStyle, setTripStyle] = useState<string>(initialProfile?.trip_style ?? "");
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
  const [travelingAs, setTravelingAs] = useState<string>(
    initialProfile?.demographic?.traveling_as ?? "",
  );

  const combinedAirlinePreferences = directOnly
    ? [...airlinePreferences, DIRECT_FLIGHTS_ONLY_TAG]
    : airlinePreferences;

  function stepVisible(index: number) {
    return !wizard || step === index;
  }

  const step1 = (
    <section className={`flex flex-col gap-6 ${stepVisible(0) ? "" : "hidden"}`}>
      {wizard && (
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{STEP_TITLES[0].title}</h2>
          <p className="mt-1 text-sm text-tp-ink/60">{STEP_TITLES[0].subtitle}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-tp-ink">Budget range</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {BUDGET_RANGES.map((option) => {
            const active = budgetRange === option.value;
            return (
              <label
                key={option.value}
                className={`card-hard-sm flex cursor-pointer flex-col items-center justify-center gap-1 p-5 text-center transition-transform ${
                  active ? "card-hard-orange bg-tp-orange/10" : ""
                }`}
              >
                <input
                  type="radio"
                  name="budget_range"
                  value={option.value}
                  checked={active}
                  onChange={() => setBudgetRange(option.value)}
                  required
                  className="sr-only"
                />
                <span className="font-display text-lg font-extrabold">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-tp-ink">Trip style</h3>
        <div className="flex gap-3">
          {TRIP_STYLE_OPTIONS.map((option) => {
            const active = tripStyle === option.value;
            return (
              <label
                key={option.value}
                className={`chip flex-1 flex-col items-start gap-1 !rounded-2xl px-4 py-3 text-left ${
                  active ? "chip-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="trip_style"
                  value={option.value}
                  checked={active}
                  onChange={() => setTripStyle(option.value)}
                  required
                  className="sr-only"
                />
                <span className="block font-bold">{option.label}</span>
                <span className={`block text-xs font-normal ${active ? "text-tp-cream/80" : "text-tp-ink/60"}`}>
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );

  const step2 = (
    <section className={`flex flex-col gap-6 ${stepVisible(1) ? "" : "hidden"}`}>
      {wizard && (
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{STEP_TITLES[1].title}</h2>
          <p className="mt-1 text-sm text-tp-ink/60">{STEP_TITLES[1].subtitle}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-tp-ink">Hotel preferences</h3>
        <p className="text-xs text-tp-ink/50">Pick any amenities you care about.</p>
        <ToggleGroup
          name="hotel_preferences"
          options={HOTEL_PREFERENCE_OPTIONS}
          selected={hotelPreferences}
          onChange={setHotelPreferences}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-tp-ink">Airline preferences</h3>
        <ToggleGroup
          name="airline_preferences"
          options={AIRLINE_OPTIONS}
          selected={airlinePreferences}
          onChange={setAirlinePreferences}
          formatLabel={(v) => v}
        />
        <button
          type="button"
          onClick={() => setDirectOnly((v) => !v)}
          className={`chip mt-1 w-fit ${directOnly ? "chip-active" : ""}`}
        >
          Direct flights only
        </button>
        {combinedAirlinePreferences.map((value) => (
          <input key={value} type="hidden" name="airline_preferences" value={value} />
        ))}
      </div>
    </section>
  );

  const step3 = (
    <section className={`flex flex-col gap-6 ${stepVisible(2) ? "" : "hidden"}`}>
      {wizard && (
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{STEP_TITLES[2].title}</h2>
          <p className="mt-1 text-sm text-tp-ink/60">{STEP_TITLES[2].subtitle}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-tp-ink">Age range</h3>
          <select
            name="age_range"
            defaultValue={initialProfile?.demographic?.age_range ?? ""}
            className="input-tp"
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
          <h3 className="text-sm font-bold text-tp-ink">Traveling as</h3>
          <div className="flex flex-wrap gap-2">
            {TRAVELING_AS_OPTIONS.map((option) => {
              const active = travelingAs === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTravelingAs(active ? "" : option.value)}
                  className={`chip ${active ? "chip-active" : ""}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="traveling_as" value={travelingAs} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-tp-ink">Interests &amp; hobbies</h3>
        <p className="text-xs text-tp-ink/50">Used to match itineraries to what you like doing.</p>
        <ToggleGroup
          name="interests"
          options={INTEREST_OPTIONS}
          selected={interests}
          onChange={setInterests}
        />
      </div>
    </section>
  );

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {wizard && (
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-tp-ink/50">
            <span>
              Step {step + 1} of {totalSteps}
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-tp-ink bg-white">
            <div
              className="h-full bg-tp-orange transition-all"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step1}
      {step2}
      {step3}

      {state?.error && (
        <p className="rounded-xl border-2 border-tp-ink bg-tp-yellow px-3 py-2 text-sm font-medium text-tp-ink">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between">
        {wizard && step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-pill btn-secondary text-sm"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {wizard && step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            className="btn-pill btn-primary text-sm"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="btn-pill btn-primary text-sm disabled:opacity-60"
          >
            {isPending ? "Saving..." : submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}
