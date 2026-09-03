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
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Tell us how you like to travel
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          This one-time setup helps us match you with hotels, flights, and
          itineraries. You can edit it any time from your profile.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <ProfileForm action={action} submitLabel="Finish setup" />
        </div>
      </div>
    </div>
  );
}
