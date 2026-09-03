import { ImageResponse } from 'next/og'
import { MARK_PATH, MARK_VIEWBOX } from '@/components/logo-paths'
import { site } from '@/lib/site'

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Rendered at build time. Uses no custom font so the image never depends on a
 * network fetch succeeding during the build, and draws the approved mark from
 * the same path data as every other logo on the site.
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
          backgroundColor: '#0E0E0E',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width="96" height="40" viewBox={MARK_VIEWBOX}>
            <path d={MARK_PATH} fill="#F2EFE9" />
          </svg>
          <div
            style={{
              color: '#F2EFE9',
              fontSize: 32,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Northbound
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 86,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            color: '#F2EFE9',
            letterSpacing: '-0.01em',
            maxWidth: 940,
          }}
        >
          Digital infrastructure for modern businesses
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(242,239,233,0.62)' }}>
          Web services · AI employees coming soon · {site.location}
        </div>
      </div>
    ),
    size
  )
}
