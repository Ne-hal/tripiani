import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { upsertProfile } from "@/lib/actions/profile";

export default async function BuildProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const action = upsertProfile.bind(null, "/home");

  return (
    <div className="flex flex-1 justify-center bg-tp-cream px-4 py-12">
      <div className="w-full max-w-2xl">
        <span className="badge-sticker">One-time setup</span>
        <h1 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">
          Tell us how you like to travel
        </h1>
        <p className="mt-2 text-sm text-tp-ink/70">
          This one-time setup helps us match you with hotels, flights, and
          itineraries. You can edit it any time from your profile.
        </p>

        <div className="card-hard-lg mt-8 p-6 sm:p-8">
          <ProfileForm action={action} submitLabel="Finish setup" />
        </div>
      </div>
    </div>
  );
}
