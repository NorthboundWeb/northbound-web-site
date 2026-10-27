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

**Prices are real, not illustrative.** Pro £249, Ultimate £349 and management
from £39 a month are the actual advertised prices. Do **not** describe them as
example, indicative or "starting from" figures. Only Custom carries a "from"
(£349), because its scope is agreed per project. Management: Pro Management
includes 2 hours of updates a month, Ultimate Management 4 hours; the first
month is free; a year paid up front is twelve months for the price of ten
(`ANNUAL_TERMS`). Never describe the annual deal as "last month free" on a
rolling monthly plan — only an annual term can honour it. Use the exported
`ADVANCED_MANAGEMENT_PRICE` wherever the free month's value is quoted.

**Promises are bounded on purpose.** Never write unlimited fixes, updates or
support. No absolutes ("every time"), no guaranteed same-day response. Included
change time does not roll over, and extra work is quoted before it is done. The
complimentary month must never be described as auto-renewing. A management plan
is optional and must not read as a condition of having a site built. Custom's
£349 must not imply accounts, databases, payments, portals or ecommerce are
included.

**Commercial terms are load-bearing.** Payment is 50% deposit to begin and 50%
once complete and approved, before go-live — never imply the balance is
optional at that point. Timelines are estimates and must always render with
`TIMELINE_TERMS` beside them; never write "guaranteed in X days". Cancelling a
plan stops future renewals and does not part-refund the current period, and
must never be described as taking the site offline. Copywriting, photography,
logo/brand design and paid stock are not in the fixed packages. Northbound is
not VAT registered: say so once in the commercial terms and nowhere else.

"Priority support" is a **place in the queue, not an SLA** — Ultimate
Management requests go ahead of Pro Management ones. Never attach a response
time to it. Safety and security fixes never count against update hours. The
packaged booking setups are **configuring an existing booking service** for
one calendar (Pro) or several (Ultimate); bespoke booking systems,
availability logic, custom payment flows, accounts or automated workflows are
quoted separately. Revision
feedback is asked for within **10 working days** of a preview, after which the
project may pause and the date may move — and **silence is never treated as
approval**.

These constraints are encoded in `managementTerms`, `commercialTerms`,
`TIMELINE_TERMS`, `COMPLIMENTARY_MONTH_TERMS`, each plan's `changeTime`, and
the `note` fields on the Ultimate and Custom packages.

**Do not invent social proof.** No testimonials, client logos, case studies,
review counts or years-of-experience claims unless Che supplies real ones. The
About page is deliberately written to make no checkable claims.

**The enquiry form is the only write path.** `src/lib/contact/actions.ts` is a
server action — a public POST endpoint. Validate on the server there, not only
in the browser. It has a honeypot, a submit-time trap and an in-memory rate
limit, then posts the enquiry to a Google Apps Script web app
(`apps-script/enquiries.gs`), which re-validates it, HTML-escapes it into the
notification email and stores it in a Google Sheet with formula characters
neutralised. Keep all of those if you touch either side. There is no Resend and
no email provider in the Next.js app.

**Secrets are server-side.** `ENQUIRY_WEBHOOK_URL` and `ENQUIRY_WEBHOOK_TOKEN`
must never be renamed to anything `NEXT_PUBLIC_*` — that prefix ships the value
to the browser.

Run `npm run typecheck && npm run lint && npm run build` before committing.
