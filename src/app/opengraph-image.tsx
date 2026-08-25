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
          backgroundColor: '#0D2A24',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="#F2EBDD"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
            <path d="M16 4.5 22 20 16 16.6 10 20Z" fill="#F04A0A" />
            <path d="M16 27.5 10 20l6 3.4 6-3.4Z" fill="#F04A0A" opacity="0.45" />
          </svg>
          <div style={{ color: '#F2EBDD', fontSize: 34, letterSpacing: '-0.02em' }}>
            Northbound
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 82, textTransform: 'uppercase',
            lineHeight: 1.1,
            color: '#F2EBDD',
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}
        >
          A technology company for small businesses.
        </div>

        <div style={{ display: 'flex', fontSize: 28, color: 'rgba(242,235,221,0.65)' }}>
          Northbound Web · Northbound AI · {site.location}
        </div>
      </div>
    ),
    size
  )
}
