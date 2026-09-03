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

  const { count: tripsCount } = await supabase
    .from("trips")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const action = upsertProfile.bind(null, "/about");

  const stats = [
    { label: "Trips planned", value: String(tripsCount ?? 0) },
    { label: "Trip style", value: profile?.trip_style ?? "Not set" },
    { label: "Budget range", value: profile?.budget_range ?? "Not set" },
    { label: "Interests picked", value: String(profile?.interests.length ?? 0) },
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <section className="card-hard-lg overflow-hidden">
        <div className="flex flex-col items-center gap-4 bg-tp-mint px-6 py-10 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-tp-ink bg-tp-yellow font-display text-3xl font-extrabold">
            {user.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your profile</h1>
            <p className="mt-1 text-sm text-tp-ink/70">{user.email}</p>
          </div>
          <a href="#edit-profile" className="btn-pill btn-primary text-sm">
            Edit profile
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card-hard-sm p-4 text-center">
              <p className="font-display text-2xl font-extrabold capitalize">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-tp-ink/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {profile && (
        <section className="card-hard p-6">
          <h2 className="font-display text-xl font-extrabold">Your current profile</h2>
          <dl className="dashed-divider mt-4 grid grid-cols-1 gap-4 pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-tp-ink/50">Traveling as</dt>
              <dd className="capitalize text-tp-ink">
                {profile.demographic?.traveling_as ?? "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-tp-ink/50">Age range</dt>
              <dd className="text-tp-ink">{profile.demographic?.age_range ?? "Not specified"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-tp-ink/50">Interests</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {profile.interests.length ? (
                  profile.interests.map((interest) => (
                    <span key={interest} className="chip chip-active capitalize">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-tp-ink">None yet</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-tp-ink/50">Hotel preferences</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {profile.hotel_preferences.length ? (
                  profile.hotel_preferences.map((pref) => (
                    <span key={pref} className="chip chip-active capitalize">
                      {pref}
                    </span>
                  ))
                ) : (
                  <span className="text-tp-ink">None yet</span>
                )}
              </dd>
            </div>
          </dl>
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-extrabold">Similar people liked...</h2>
          <span className="badge-static">Preview</span>
        </div>
        <p className="mt-1 text-xs text-tp-ink/50">
          Illustrative only &mdash; real collaborative recommendations are out
          of scope for this MVP.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card-hard p-4">
            <p className="text-sm text-tp-ink/80">
              Travelers with your budget range often add spa amenities to
              their hotel preferences.
            </p>
          </div>
          <div className="card-hard p-4">
            <p className="text-sm text-tp-ink/80">
              People with similar interests also enjoy organized, day-by-day
              itineraries.
            </p>
          </div>
        </div>
      </section>

      <section id="edit-profile" className="card-hard-lg scroll-mt-20 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-extrabold">Edit your profile</h2>
        <div className="mt-6">
          <ProfileForm
            action={action}
            initialProfile={profile ?? undefined}
            submitLabel="Save changes"
            wizard={false}
          />
        </div>
      </section>
    </div>
  );
}
