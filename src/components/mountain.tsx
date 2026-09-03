/**
 * The hero mountain plate.
 *
 * PLACEHOLDER ASSET. The approved composition calls for dramatic black-and-
 * white mountain photography here. No licensed photograph was supplied with
 * the brand assets, and shipping an unlicensed stock image is not an option,
 * so this is a drawn stand-in: layered ridges under an atmospheric wash, in
 * the same monochrome register as the reference.
 *
 * To swap in the real photograph, replace this component's body with the
 * image and keep the same wrapper classes — every caller positions the plate
 * through those, not through anything internal.
 */
export function MountainPlate({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* Cold light breaking behind the summit. */}
        <radialGradient id="nb-sky" cx="52%" cy="26%" r="52%">
          <stop offset="0%" stopColor="#5e5e5e" />
          <stop offset="55%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#0e0e0e" />
        </radialGradient>
        {/* Each ridge fades into the ground at its base, as haze does. */}
        <linearGradient id="nb-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#767676" />
          <stop offset="100%" stopColor="#161616" />
        </linearGradient>
        <linearGradient id="nb-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e4e4e" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <linearGradient id="nb-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2e2e" />
          <stop offset="100%" stopColor="#0b0b0b" />
        </linearGradient>
        <linearGradient id="nb-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e0e0e" stopOpacity="1" />
          <stop offset="45%" stopColor="#0e0e0e" stopOpacity="0" />
        </linearGradient>
        <filter id="nb-haze" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="800" height="900" fill="url(#nb-sky)" />

      {/* Far range — hazy, low contrast. */}
      <path
        d="M0 560 L120 430 L190 480 L300 330 L360 400 L470 250 L560 360 L650 300 L800 470 L800 900 L0 900 Z"
        fill="url(#nb-far)"
        opacity="0.55"
      />
      {/* Mid range. */}
      <path
        d="M0 660 L90 590 L170 640 L280 470 L340 520 L430 380 L520 500 L610 440 L720 540 L800 500 L800 900 L0 900 Z"
        fill="url(#nb-mid)"
        opacity="0.85"
      />
      {/* The summit — the dominant form, as in the reference. */}
      <path
        d="M0 900 L0 780 L110 700 L210 740 L330 560 L390 600 L468 300 L520 420 L560 380 L640 560 L720 620 L800 690 L800 900 Z"
        fill="url(#nb-near)"
      />
      {/* Snow catching the light on the summit's lit face. */}
      <path
        d="M468 300 L500 380 L482 372 L470 396 L455 360 L440 372 Z"
        fill="#adadad"
        opacity="0.6"
      />
      <path
        d="M330 560 L352 596 L340 590 L332 606 L318 578 Z"
        fill="#878787"
        opacity="0.45"
      />

      {/* Cloud drifting across the lower slopes. */}
      <rect
        y="520"
        width="800"
        height="380"
        fill="#9a9a9a"
        opacity="0.09"
        filter="url(#nb-haze)"
      />
      {/* Left edge dissolves into the page ground rather than cutting. */}
      <rect width="800" height="900" fill="url(#nb-fade)" />
    </svg>
  )
}
