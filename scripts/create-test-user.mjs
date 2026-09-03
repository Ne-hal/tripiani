// One-off helper: creates a pre-confirmed test user via the Supabase admin
// API, bypassing the shared email service entirely (no email is sent, so
// this is not subject to Supabase's default email rate limit).
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=<paste your service role key here> node scripts/create-test-user.mjs
//
// Get the service role key from: Supabase dashboard -> Project Settings ->
// API -> service_role secret. Never commit it or put it in .env.local.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ecahwklrntubyvwrbxfy.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY in the environment before running this script.");
  process.exit(1);
}

const email = process.argv[2] ?? "test@tripiani.local";
const password = process.argv[3] ?? "TestPassword123!";

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Failed to create user:", error.message);
  process.exit(1);
}

console.log("Created confirmed test user:");
console.log("  email:", email);
console.log("  password:", password);
console.log("  id:", data.user.id);
