import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { upsertProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as Profile | null;
  const action = upsertProfile.bind(null, "/about");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About you</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
      </div>

      {profile && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Your current profile
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-400">Budget range</dt>
              <dd className="capitalize text-zinc-800 dark:text-zinc-200">{profile.budget_range}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Trip style</dt>
              <dd className="capitalize text-zinc-800 dark:text-zinc-200">{profile.trip_style}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Traveling as</dt>
              <dd className="capitalize text-zinc-800 dark:text-zinc-200">
                {profile.demographic?.traveling_as ?? "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Age range</dt>
              <dd className="text-zinc-800 dark:text-zinc-200">
                {profile.demographic?.age_range ?? "Not specified"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-400">Interests</dt>
              <dd className="text-zinc-800 dark:text-zinc-200">
                {profile.interests.length ? profile.interests.join(", ") : "None yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-400">Hotel preferences</dt>
              <dd className="text-zinc-800 dark:text-zinc-200">
                {profile.hotel_preferences.length ? profile.hotel_preferences.join(", ") : "None yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-400">Airline preferences</dt>
              <dd className="text-zinc-800 dark:text-zinc-200">
                {profile.airline_preferences.length ? profile.airline_preferences.join(", ") : "None yet"}
              </dd>
            </div>
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Have you been here?
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Your travel history builds up automatically as you complete trips
          from your{" "}
          <Link href="/trips" className="font-medium text-accent hover:underline">
            trips list
          </Link>
          .
        </p>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Similar people liked...
          </h2>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            static placeholder
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Illustrative only &mdash; real collaborative recommendations are out
          of scope for this MVP.
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <li className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            Travelers with your budget range often add spa amenities to their
            hotel preferences.
          </li>
          <li className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            People with similar interests also enjoy organized, day-by-day
            itineraries.
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Edit your profile
        </h2>
        <div className="mt-4">
          <ProfileForm action={action} initialProfile={profile ?? undefined} submitLabel="Save changes" />
        </div>
      </section>
    </div>
  );
}
