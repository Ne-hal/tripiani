interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

/**
 * Suitcase-icon wordmark: the case is always tp-orange; the handle, wheels,
 * and "ripiani" text use currentColor so the logo adapts to light and dark
 * backgrounds (the handle doubles as the missing "T" in "Tripiani").
 */
export function Logo({ className = "", iconClassName = "h-7 w-7", textClassName = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <svg viewBox="0 0 32 36" fill="none" aria-hidden="true" className={iconClassName}>
        <rect x="7" y="2" width="18" height="5" rx="2.5" fill="currentColor" />
        <rect x="13" y="2" width="6" height="13" rx="2" fill="currentColor" />
        <rect x="3" y="10" width="22" height="20" rx="6" fill="#FF5A3C" />
        <rect x="3" y="18" width="22" height="3.2" fill="currentColor" />
        <circle cx="9" cy="32" r="2.5" fill="currentColor" />
        <circle cx="23" cy="32" r="2.5" fill="currentColor" />
      </svg>
      <span className={`font-display font-extrabold tracking-tight ${textClassName}`}>ripiani</span>
    </span>
  );
}
