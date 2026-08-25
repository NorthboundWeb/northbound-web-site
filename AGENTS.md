# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

---

## Project notes

Marketing site for **Northbound**, the parent brand. Two divisions live beneath
it: **Northbound Web** (`/web/*`, live and selling) and **Northbound AI**
(`/ai/*`, in private preview). Next.js 16 App Router, Tailwind CSS v4,
TypeScript. Every route is static except `/contact`, which reads
`searchParams`. There is no database and no auth.

**Divisions are data, not routes hardcoded in the header.** `divisions` in
`src/lib/site.ts` drives the homepage gateway, the header's division chip and
nav, the footer and the About page. Adding a third division is one entry there.

**Copy lives in data files, not JSX.** Scopes, management plans, prices, the
process steps and the build standards are in `src/lib/services.ts`; the brand
name, URL and contact email are in `src/lib/site.ts`. Edit copy there.

**Pricing — read `src/lib/services.ts`'s header comment before touching any
number.** £119 (`ENTRY_PRICE`) is the **only** confirmed, published build
price, and it is published as a *from* price on the Starter scope. The old
ladder (£199 / £299 / £399 / £499) has been **withdrawn by the owner** — do not
reinstate it, and do not invent replacement figures and present them as
approved. Business, Extended and Custom carry `pricing: 'quoted'` and publish
no number. Management prices (£39 / £80 / £149) were approved separately and
are unchanged. Use `ADVANCED_MANAGEMENT_PRICE` wherever the complimentary
month's value is quoted so it cannot drift.

**Scope was approved; only the money is open.** Page caps, revision rounds and
timescales on each tier are settled — leave them alone. When CJ confirms the
ladder, set `price` and flip `pricing` to `'fixed'`; nothing else needs
touching, because every surface reads from that array.

**Promises are bounded on purpose.** Never write unlimited fixes, updates or
support. No absolutes ("every time"), no guaranteed same-day response. Included
change time does not roll over, and extra work is quoted before it is done. The
complimentary month must never be described as auto-renewing. A management plan
is optional and must not read as a condition of having a site built. Custom
must not imply accounts, databases, payments, portals or ecommerce are
included.

**Commercial terms are load-bearing.** Payment is 50% deposit to begin and 50%
once complete and approved, before go-live — never imply the balance is
optional at that point. Timelines are estimates and must always render with
`TIMELINE_TERMS` beside them; never write "guaranteed in X days". Cancelling a
plan stops future renewals and does not part-refund the current period, and
must never be described as taking the site offline. Copywriting, photography,
logo/brand design and paid stock are not in the fixed scopes. Add **no VAT
wording** in either direction.

"Priority support" is a **place in the queue, not an SLA** — Advanced and
Complete requests go ahead of Essential ones. Never attach a response time to
it. Extended's booking integration means **connecting or embedding an existing
third-party service**; bespoke booking systems, availability logic, custom
payment flows, accounts or automated workflows are quoted separately. Revision
feedback is asked for within **10 working days** of a preview, after which the
project may pause and the date may move — and **silence is never treated as
approval**.

These constraints are encoded in `managementTerms`, `commercialTerms`,
`TIMELINE_TERMS`, `COMPLIMENTARY_MONTH_TERMS`, each plan's `changeTime`, and
the `note` fields on the Extended and Custom scopes.

**`roadmapServices` must never render.** It is a private list of ideas. Nothing
in it is a product yet, and putting it on a page would advertise something
Northbound cannot deliver.

**Northbound AI is in preview, not on sale.** `/ai` and `/ai/full-access`
describe capability and an approval-based request route. Do not attach a price
or a delivery date to anything there.

**Do not invent social proof.** No testimonials, client logos, case studies,
review counts or years-of-experience claims unless Che supplies real ones.
`/web/work` currently holds an empty `projects` array and sets its own
`noindex` — that is deliberate, not a bug. The About page is written to make no
checkable claims.

**The enquiry form is the only write path.** `src/lib/contact/actions.ts` is a
server action — a public POST endpoint. Validate on the server there, not only
in the browser. It has a honeypot (`subject` — *not* `website`, which collides
with the real existing-site field), a submit-time trap, an in-memory rate
limit, and it HTML-escapes user text before it goes into the notification
email. Keep all four if you touch it. On delivery failure it returns a
prefilled `mailto:` so the lead is not lost.

**Contrast is a two-token system.** Brand orange `--accent` (#F04A0A) fails AA
for small text on both surfaces. Small orange text uses `--accent-deep` on
cream and `--accent-lit` on green; fills, arrows, full stops and large display
type keep `--accent`. Note the Tailwind trap that caused invisible CTAs once
already: two colour utilities of equal specificity are resolved by
**stylesheet order**, not class-attribute order — which is why `Label`,
`CardCta` and friends take a `tone` prop instead of being overridden with a
class.

**Secrets are server-side.** `RESEND_API_KEY` must never be renamed to anything
`NEXT_PUBLIC_*` — that prefix ships the value to the browser. `src/lib/unlock.ts`
imports `server-only` for the same reason: the codes must not reach the client
bundle.

Run `npm run typecheck && npm run lint && npm run build` before committing.
