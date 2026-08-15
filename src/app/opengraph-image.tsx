import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Rendered at build time. Uses no custom font so the image never depends on a
 * network fetch succeeding during the build.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0b1013',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="#5fcfb4"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
            <path d="M16 4.5 22 20 16 16.6 10 20Z" fill="#5fcfb4" />
            <path d="M16 27.5 10 20l6 3.4 6-3.4Z" fill="#5fcfb4" opacity="0.45" />
          </svg>
          <div style={{ color: '#edf0f0', fontSize: 34, letterSpacing: '-0.02em' }}>
            Northbound Web
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 76,
            lineHeight: 1.1,
            color: '#edf0f0',
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}
        >
          Websites that make small businesses look like serious ones.
        </div>

        <div style={{ display: 'flex', fontSize: 28, color: '#a1acb1' }}>
          Design · Development · Care plans · {site.location}
        </div>
      </div>
    ),
    size
  )
}
