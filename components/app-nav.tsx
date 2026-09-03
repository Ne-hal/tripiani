"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const LINKS = [
  { href: "/home", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/about", label: "About" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/home" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          TripPlanner
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/trips/new"
            className="ml-1 rounded-full border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground"
          >
            + Create Trip
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="ml-1 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
