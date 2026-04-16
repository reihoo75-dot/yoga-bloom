interface BrandLogoProps {
  size?: number
}

/**
 * Yoga Flow Journal brand logo — meditating figure with three chakra dots.
 * Approximates the official logo provided by the user.
 */
export function BrandLogo({ size = 120 }: BrandLogoProps) {
  const h = Math.round(size * 1.6)
  return (
    <svg width={size} height={h} viewBox="0 0 120 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="figGrad" x1="60" y1="62" x2="60" y2="192" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8FAF8F" />
          <stop offset="55%"  stopColor="#A4BFA4" />
          <stop offset="100%" stopColor="#C4AE8C" />
        </linearGradient>
        <linearGradient id="figGrad2" x1="60" y1="62" x2="60" y2="192" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#7A9F7A" />
          <stop offset="100%" stopColor="#B89E78" />
        </linearGradient>
      </defs>

      {/* ── Chakra dots ─────────────────────────────────────── */}
      <circle cx="60" cy="10"  r="6"    fill="#EDB0B8" />
      <circle cx="60" cy="26"  r="8"    fill="#8ABFBF" />
      <circle cx="60" cy="46"  r="11.5" fill="#ECEADE" />

      {/* ── Head ────────────────────────────────────────────── */}
      <ellipse cx="60" cy="76" rx="17" ry="19" fill="url(#figGrad)" />

      {/* ── Torso (prayer/anjali hands shape) ───────────────── */}
      {/* Main torso */}
      <path
        d="M43 93
           Q34 102 32 118
           Q30 135 34 150
           Q38 163 60 165
           Q82 163 86 150
           Q90 135 88 118
           Q86 102 77 93
           Q70 89 60 89
           Q50 89 43 93 Z"
        fill="url(#figGrad)"
      />

      {/* Lotus legs — left */}
      <ellipse
        cx="32" cy="168" rx="28" ry="14"
        fill="url(#figGrad)"
        transform="rotate(-8, 32, 168)"
      />
      {/* Lotus legs — right */}
      <ellipse
        cx="88" cy="168" rx="28" ry="14"
        fill="url(#figGrad)"
        transform="rotate(8, 88, 168)"
      />
      {/* Center overlap / lap */}
      <ellipse cx="60" cy="172" rx="22" ry="12" fill="url(#figGrad)" />

      {/* Knee bumps */}
      <ellipse cx="18" cy="163" rx="13" ry="9"  fill="url(#figGrad)" opacity="0.85" />
      <ellipse cx="102" cy="163" rx="13" ry="9" fill="url(#figGrad)" opacity="0.85" />

      {/* Feet peeking */}
      <ellipse cx="10"  cy="172" rx="9" ry="6" fill="url(#figGrad)" opacity="0.75" />
      <ellipse cx="110" cy="172" rx="9" ry="6" fill="url(#figGrad)" opacity="0.75" />

      {/* ── White chest symbol (open book + stem + petal) ───── */}
      <g transform="translate(60, 130)" opacity="0.93">
        {/* Left page */}
        <path d="M0,0 Q-13,-11 -15,-1 Q-13,7 0,5" fill="white" />
        {/* Right page */}
        <path d="M0,0 Q13,-11 15,-1 Q13,7 0,5" fill="white" />
        {/* Spine / stem */}
        <rect x="-1.5" y="4" width="3" height="10" rx="1.5" fill="white" />
        {/* Petal / nib */}
        <path d="M0,14 Q-3.5,20 0,23 Q3.5,20 0,14" fill="white" />
      </g>
    </svg>
  )
}
