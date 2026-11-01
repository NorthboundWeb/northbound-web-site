/** Small inline SVG flags (emoji flags do not draw on Windows). Decorative; the label sits beside them. */
export function Flag({ code, size = 22, fill = false }: { code: string; size?: number; fill?: boolean }) {
  const w = size
  const h = Math.round(size * 0.68)
  const common = fill
    ? { 'aria-hidden': true as const, focusable: false as const, className: 'flag flag-fill', preserveAspectRatio: 'xMidYMid slice' as const }
    : { width: w, height: h, 'aria-hidden': true as const, focusable: false as const, className: 'flag' }
  if (code === 'es')
    return (
      <svg {...common} viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#c60b1e" />
        <rect y="5" width="30" height="10" fill="#ffc400" />
      </svg>
    )
  if (code === 'pl')
    return (
      <svg {...common} viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#fff" />
        <rect y="10" width="30" height="10" fill="#dc143c" />
      </svg>
    )
  if (code === 'fr')
    return (
      <svg {...common} viewBox="0 0 30 20">
        <rect width="10" height="20" fill="#0055a4" />
        <rect x="10" width="10" height="20" fill="#fff" />
        <rect x="20" width="10" height="20" fill="#ef4135" />
      </svg>
    )
  return (
    <svg {...common} viewBox="0 0 60 40">
      <clipPath id="uj"><rect width="60" height="40" /></clipPath>
      <g clipPath="url(#uj)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#c8102e" strokeWidth="3" />
        <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0V40M0 20H60" stroke="#c8102e" strokeWidth="8" />
      </g>
    </svg>
  )
}
