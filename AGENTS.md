# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

---

## Project notes

Marketing site for Northbound Web. Next.js 16 App Router, Tailwind CSS v4,
TypeScript. Every route is static; there is no database and no auth.

**Copy lives in data files, not JSX.** Packages, management plans, prices, the
process steps and the build standards are all in `src/lib/services.ts`; the
business name, URL and contact email are in `src/lib/site.ts`. Edit copy there
rather than in pages.

**Prices are real, not illustrative.** Basic £199, Standard £299, Advanced £399
and the management plans (£39 / £80 / £149) are the actual advertised prices. Do
**not** describe them as example, indicative or "starting from" figures. Only
Custom carries a "from" (£499), because its scope is agreed per project. Use the
exported `ADVANCED_MANAGEMENT_PRICE` wherever the complimentary month's value is
quoted, so it cannot drift from the plan's own price.

**Promises are bounded on purpose.** Never write unlimited fixes, updates or
support. No absolutes ("every time"), no guaranteed same-day response. Included
change time does not roll over, and extra work is quoted before it is done. The
complimentary month must never be described as auto-renewing. A management plan
is optional and must not read as a condition of having a site built. Custom's
£499 must not imply accounts, databases, payments, portals or ecommerce are
included.

**Commercial terms are load-bearing.** Payment is 50% deposit to begin and 50%
once complete and approved, before go-live — never imply the balance is
optional at that point. Timelines are estimates and must always render with
`TIMELINE_TERMS` beside them; never write "guaranteed in X days". Cancelling a
plan stops future renewals and does not part-refund the current period, and
must never be described as taking the site offline. Copywriting, photography,
logo/brand design and paid stock are not in the fixed packages. Add **no VAT
wording** in either direction.

"Priority support" is a **place in the queue, not an SLA** — Advanced and
Complete requests go ahead of Essential ones. Never attach a response time to
it. Advanced's booking integration means **connecting or embedding an existing
third-party service**; bespoke booking systems, availability logic, custom
payment flows, accounts or automated workflows are quoted separately. Revision
feedback is asked for within **10 working days** of a preview, after which the
project may pause and the date may move — and **silence is never treated as
approval**.

These constraints are encoded in `managementTerms`, `commercialTerms`,
`TIMELINE_TERMS`, `COMPLIMENTARY_MONTH_TERMS`, each plan's `changeTime`, and
the `note` fields on the Advanced and Custom packages.

**Do not invent social proof.** No testimonials, client logos, case studies,
review counts or years-of-experience claims unless Che supplies real ones. The
About page is deliberately written to make no checkable claims.

**The enquiry form is the only write path.** `src/lib/contact/actions.ts` is a
server action — a public POST endpoint. Validate on the server there, not only
in the browser. It has a honeypot, a submit-time trap, an in-memory rate limit,
and HTML-escapes user text before it goes into the notification email. Keep all
four if you touch it.

**Secrets are server-side.** `RESEND_API_KEY` must never be renamed to anything
`NEXT_PUBLIC_*` — that prefix ships the value to the browser.

Run `npm run typecheck && npm run lint && npm run build` before committing.
