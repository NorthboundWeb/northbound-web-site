import { NextResponse, type NextRequest } from 'next/server'
import { isHqAuthed } from '@/lib/hq/auth'
import { AuditFailure } from '@/lib/hq/audit/checks'
import { runAuditCached } from '@/lib/hq/audit/run'
import { buildAuditReport } from '@/lib/hq/pdf/report'
import { rateLimit } from '@/lib/rate-limit'
import { site } from '@/lib/site'

export const maxDuration = 60

/** Streams the branded PDF for a site. Same session gate as the page. */
export async function GET(request: NextRequest) {
  // A 404 rather than a redirect: there is nothing here for a stranger.
  if (!(await isHqAuthed())) return new NextResponse('Not found', { status: 404 })

  const limited = rateLimit('hq-audit', { limit: 20, windowMs: 10 * 60 * 1000 })
  if (!limited.ok) {
    return new NextResponse('Too many audits in a short time. Wait a few minutes.', {
      status: 429,
      headers: { 'Retry-After': String(limited.retryAfterSeconds) },
    })
  }

  const url = request.nextUrl.searchParams.get('url') ?? ''
  const pageSpeed = request.nextUrl.searchParams.get('pagespeed') === '1'

  try {
    const result = await runAuditCached(url, { pageSpeed })
    const pdf = buildAuditReport(result, {
      name: site.name,
      email: site.email,
      url: site.url,
    })

    const host = new URL(result.finalUrl).hostname.replace(/^www\./, '')
    const safeHost = host.replace(/[^a-z0-9.-]/gi, '-').toLowerCase()

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="northbound-health-check-${safeHost}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    if (error instanceof AuditFailure) {
      return new NextResponse(error.message, { status: 422 })
    }
    console.error('Audit PDF failed:', error)
    return new NextResponse('The report could not be built.', { status: 500 })
  }
}
