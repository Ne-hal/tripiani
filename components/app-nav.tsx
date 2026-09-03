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
    <header className="sticky top-0 z-10 bg-tp-ink text-tp-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/home" className="font-display text-lg font-extrabold tracking-tight">
          Tripiani
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "bg-tp-mint text-tp-ink" : "text-tp-cream/80 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/trips/new"
            className="ml-1 rounded-full bg-tp-orange px-3 py-1.5 text-sm font-bold text-tp-ink hover:opacity-90"
          >
            + Create Trip
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="ml-1 rounded-full px-3 py-1.5 text-sm font-semibold text-tp-cream/70 hover:bg-white/10"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
