import type { Metadata } from 'next'
import { requireHq } from '@/lib/hq/auth'
import { AuditFailure } from '@/lib/hq/audit/checks'
import { runAuditCached } from '@/lib/hq/audit/run'
import type { AuditResult, Check } from '@/lib/hq/audit/types'
import { rateLimit } from '@/lib/rate-limit'
import {
  Notice,
  PageHeader,
  Panel,
  StatusPill,
  buttonClass,
  cn,
  ghostButtonClass,
  inputClass,
} from '../_components/ui'

export const metadata: Metadata = { title: 'Site audit' }
export const maxDuration = 60

type Outcome =
  | { kind: 'idle' }
  | { kind: 'error'; message: string }
  | { kind: 'result'; result: AuditResult; pageSpeed: boolean }

async function runFromQuery(url: string | undefined, pageSpeed: boolean): Promise<Outcome> {
  if (!url?.trim()) return { kind: 'idle' }

  const limited = rateLimit('hq-audit', { limit: 20, windowMs: 10 * 60 * 1000 })
  if (!limited.ok) {
    return { kind: 'error', message: 'Too many audits in a short time. Wait a few minutes.' }
  }

  try {
    return { kind: 'result', result: await runAuditCached(url, { pageSpeed }), pageSpeed }
  } catch (error) {
    if (error instanceof AuditFailure) return { kind: 'error', message: error.message }
    console.error('Audit failed:', error)
    return { kind: 'error', message: 'The audit failed unexpectedly. Try again.' }
  }
}

function FindingRow({ check }: { check: Check }) {
  return (
    <li className="border-t border-line py-4 first:border-t-0">
      <div className="mb-1.5 flex flex-wrap items-center gap-3">
        <StatusPill status={check.status === 'fail' ? 'building' : check.status === 'warn' ? 'intake' : 'live'} />
        <h3 className="text-[15px] font-semibold text-chalk">{check.title}</h3>
      </div>
      <p className="text-sm text-chalk-muted">{check.found}</p>
      {check.why ? (
        <p className="mt-2 text-sm text-chalk-faint">
          <span className="font-semibold text-chalk-muted">Why it matters: </span>
          {check.why}
        </p>
      ) : null}
      {check.fix ? (
        <p className="mt-1.5 text-sm text-chalk-faint">
          <span className="font-semibold text-chalk-muted">Fix: </span>
          {check.fix}
        </p>
      ) : null}
    </li>
  )
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; pagespeed?: string }>
}) {
  await requireHq()

  const params = await searchParams
  const pageSpeed = params.pagespeed === '1'
  const outcome = await runFromQuery(params.url, pageSpeed)

  const problems =
    outcome.kind === 'result'
      ? outcome.result.checks
          .filter((c) => c.status === 'fail' || c.status === 'warn')
          .sort((a, b) => (a.status === b.status ? b.weight - a.weight : a.status === 'fail' ? -1 : 1))
      : []
  const passes =
    outcome.kind === 'result' ? outcome.result.checks.filter((c) => c.status === 'pass') : []

  return (
    <>
      <PageHeader eyebrow="Lead magnet" title="Site audit">
        Enter any business website and get a plain-English health check, plus a branded PDF you can send
        them. Checks the homepage and a sample of its links, so it is a first look, not a full audit.
      </PageHeader>

      <form method="GET" action="/hq/audit" className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="url" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-chalk-muted">
            Website address
          </label>
          <input
            id="url"
            name="url"
            type="text"
            inputMode="url"
            defaultValue={params.url ?? ''}
            placeholder="example.co.uk"
            required
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 pb-3 text-sm text-chalk-muted">
          <input type="checkbox" name="pagespeed" value="1" defaultChecked={pageSpeed} className="size-4 accent-orange" />
          Include Google PageSpeed (slower)
        </label>
        <button type="submit" className={buttonClass}>
          Run audit
        </button>
      </form>

      {outcome.kind === 'error' ? <Notice tone="error">{outcome.message}</Notice> : null}

      {outcome.kind === 'result' ? (
        <div className="space-y-8">
          <Panel>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex size-36 shrink-0 flex-col items-center justify-center bg-black">
                <span className="display text-7xl leading-none">{outcome.result.score}</span>
                <span className="mt-1 text-xs text-chalk-muted">out of 100</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                  Grade {outcome.result.grade}
                </p>
                <p className="mt-1 break-all text-xl font-semibold">{outcome.result.finalUrl}</p>
                <p className="mt-1 text-sm text-chalk-muted">
                  {problems.filter((c) => c.status === 'fail').length} to fix,{' '}
                  {problems.filter((c) => c.status === 'warn').length} to improve, {passes.length} passed.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`/hq/audit/pdf?url=${encodeURIComponent(outcome.result.url)}${outcome.pageSpeed ? '&pagespeed=1' : ''}`}
                    className={buttonClass}
                  >
                    Download branded PDF
                  </a>
                  <a href="/hq/audit" className={ghostButtonClass}>
                    New audit
                  </a>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="By area">
            <ul className="space-y-3">
              {outcome.result.categories.map((category) => (
                <li key={category.id} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm">{category.label}</span>
                  <div className="h-2.5 flex-1 bg-char-sunk" role="img" aria-label={`${category.label}: ${category.score ?? 'not scored'} out of 100`}>
                    <div
                      className={cn('h-full', (category.score ?? 0) >= 75 ? 'bg-chalk' : 'bg-orange')}
                      style={{ width: `${category.score ?? 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold">{category.score ?? '–'}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {problems.length > 0 ? (
            <Panel title="What to fix first">
              <ul>
                {problems.map((check) => (
                  <FindingRow key={check.id} check={check} />
                ))}
              </ul>
            </Panel>
          ) : null}

          {passes.length > 0 ? (
            <Panel title="Already working">
              <ul className="grid gap-x-8 gap-y-2 text-sm text-chalk-muted sm:grid-cols-2">
                {passes.map((check) => (
                  <li key={check.id}>{check.title}</li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Panel title="Limits of this run">
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-chalk-muted">
              {outcome.result.limitations.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}
    </>
  )
}
