import type { Employee } from '@/lib/ai/employees'

/**
 * An employee's mark.
 *
 * Deliberately not a face, a robot or a glowing brain. Each employee gets an
 * instrument reading — a plotted trace over a measured grid, the way a
 * technical publication would illustrate a signal. It says "this thing
 * observes and reports" without pretending to be a person.
 *
 * Every value is derived from the employee's own number, so a mark is stable
 * across renders (server and client agree) and no two employees share one.
 * Adding employee 007 produces a new mark automatically.
 *
 * Purely artwork: the identifier and role are set by whatever frames it, so
 * reusing the mark on a card, a profile or a team page never doubles up.
 */

/** Small deterministic hash. Same input, same mark, every time. */
function seedFrom(value: string): () => number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function EmployeeMark({
  employee,
  className = '',
}: {
  employee: Employee
  className?: string
}) {
  const rand = seedFrom(employee.slug + employee.number)
  const colour = `var(${employee.colourVar})`

  // The trace: a plotted line across the frame, unique per employee.
  const points = Array.from({ length: 9 }, (_, i) => {
    const x = 16 + (i * 128) / 8
    const y = 96 - (rand() * 56 - 4)
    return [x, Math.round(y * 10) / 10] as const
  })
  const path = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`)
    .join(' ')

  // The peak is marked, the way a reading would be annotated.
  const peak = points.reduce((lo, p) => (p[1] < lo[1] ? p : lo), points[0])

  // A ring of ticks — the measured edge of the instrument.
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2
    const r1 = i % 6 === 0 ? 52 : 57
    return {
      x1: 120 + Math.cos(a) * r1,
      y1: 52 + Math.sin(a) * r1,
      x2: 120 + Math.cos(a) * 61,
      y2: 52 + Math.sin(a) * 61,
      strong: i % 6 === 0,
    }
  })

  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Measured field */}
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.28">
        {[24, 44, 64, 84, 104].map((y) => (
          <line key={y} x1="8" y1={y} x2="152" y2={y} />
        ))}
        {[16, 48, 80, 112, 144].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="112" />
        ))}
      </g>

      {/* Instrument ring, cropped by the frame like a print detail */}
      <g stroke="currentColor" opacity="0.45">
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeWidth={t.strong ? 1 : 0.5}
          />
        ))}
      </g>
      <circle cx="120" cy="52" r="44" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />

      {/* The reading */}
      <path d={path} stroke={colour} strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="round" />

      {/* The annotated peak */}
      <line x1={peak[0]} y1={peak[1]} x2={peak[0]} y2="112" stroke={colour} strokeWidth="0.75" opacity="0.55" />
      <rect x={peak[0] - 3} y={peak[1] - 3} width="6" height="6" fill={colour} />

    </svg>
  )
}
