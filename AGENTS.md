# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

---

## Project notes

**Northbound is a parent brand with two divisions.** `NORTHBOUND` sits above
`NORTHBOUND.WEB` (`/web/*`, live and selling) and `NORTHBOUND.AI` (`/ai/*`, in
development). The gateway at `/` is a genuine choice between them, not a Web
homepage with an AI page bolted on.

**Three environments, one token contract.** `:root` is the parent palette
(cream, near-black, restrained rust). `[data-division='web']` is cream,
near-black and burnt orange. `[data-division='ai']` is charcoal, warm white and
signal yellow. Every environment declares the *same* token names, so a
component asks for `--ink` and gets the right ink — no component knows which
division it is in. Deliberately single-scheme: there is no
`prefers-color-scheme` inversion, because the AI division *is* the dark one and
flipping it would undo the art direction.

**The attribute is set by a layout, not a hook.** `SiteShell` renders
`data-division` server-side, so the correct theme is in the first byte of HTML.
Header and footer live *inside* the wrapper so they theme too. Parent pages sit
in the `(parent)` route group — a group, so URLs are unchanged.

**Adding a third division** is one entry in `divisions` (`src/lib/site.ts`), one
palette block in `globals.css`, and one layout file. Nothing else.

**Inverted regions swap tokens, not classes.** A footer or statement band uses
the `invert-surface` utility, which re-points `--paper`/`--ink`/`--accent` for
everything inside it. This is not cosmetic: signal yellow on the AI division's
warm-white footer is 1.3:1, and `--accent-on-ink` is the amber that works
there. Never fix an inverted region colour by colour.

**Small accent text needs the deep companion.** `--accent` is tuned for fills,
arrows and display type. On cream it fails AA below ~24px, so small text uses
`--accent-deep`. In the AI division both point at the signal, because yellow on
charcoal is 12:1. Note the Tailwind trap that caused invisible CTAs once: two
colour utilities of equal specificity resolve by **stylesheet order**, not
class-attribute order — which is why `Label` and `CardCta` take a `tone` prop.

**`display` is 0.82 leading**, which is right for one enormous word and wrong
the moment a heading stacks. Multi-line display headings add `display-stack`.
Mobile gets its own leading and tracking — headings are designed at 390px, not
shrunk until they fit.

**Sticky is `lg`-only.** `pin-column` applies from 64rem up, because that is
the only place a second column exists to scroll past it. A sticky block in a
single-column stack hangs over the content below it and reads as the page being
stuck. `scroll-stick.mjs` in the scratchpad catches regressions.

---

## Northbound.AI

**Jarvis is not the product and must not appear on a public page.** The
customer-facing division is **Northbound Employees** — specialists hired for
one job. Jarvis may exist internally; it is not the proposition.

**Everything renders from three data files** in `src/lib/ai/`:
`employees.ts` (the roster), `teams.ts` (employees combined around an outcome),
`outcomes.ts` (the "what do you need help with?" map). Adding employee 007 is
one entry — its card, page, sitemap entry and team membership all follow.

**`status` is the honesty mechanism.** Only `'live'` may be described as usable
today, and nothing is `'live'`. A team's status is *derived* from its least
ready member, so a team can never advertise itself past its own parts.
`outcomes.ts` throws at module load if it names an employee or team that does
not exist.

**No prices on the AI side.** Northbound.AI is not on sale; a price would imply
a product that can be bought today.

**Copy rule:** say what it does, not what it is. "Finds businesses matching
your target customer", never "agentic autonomous workflows". Once the reader
knows these are AI employees, stop saying AI.

**Employee marks are generated, not drawn.** `employee-mark.tsx` derives an
instrument reading from the employee's own number — deterministic, so server
and client agree. No robots, faces or glowing brains. It is pure artwork: the
identifier and role come from whatever frames it.

---

**Pricing — `src/lib/services.ts` is the single source of truth.** Every page,
the Stripe session and every enquiry link read from it. Never write a price
anywhere else. The ladder is Starter £249, Advanced £299, Pro £389 (all
one-off, all purchasable) and Custom from £499 (quoted, not purchasable).
Management is a separate monthly subscription: Pro £39, Ultimate £59 and
Custom from £59, with the gap between the two fixed plans derived as
`MANAGEMENT_STEP_UP` so the figure cannot drift. Custom Management has no
`changeTime` on purpose — its allowance is quoted, and it is a different thing
from the Custom *website build*.

**Withdrawn, do not reinstate:** the £119 entry point, the
£199/£299/£399/£499 ladder, and Business/Extended as tier names. Do not invent
a price that is not in `services.ts`.

**A build price is a one-off total.** Never render one as weekly or monthly,
never derive an instalment from one, and never let a management price read as
part of a build.

**Klarna:** Stripe decides who is eligible and displays the options itself.
`payment_method_types` is deliberately not sent. Never calculate an instalment,
name a plan ("Pay in 3", "Pay Later"), or state APR or terms. `KLARNA_NOTE` is
the entire permitted wording.

**Payments:** the amount comes from `services.ts`, never from the request — the
browser sends only a slug. Secrets stay server-side; a `sk_live_` key outside
production throws. A payment is real only when Stripe says so: the success page
re-reads the session, and the webhook verifies its signature and fails closed
without `STRIPE_WEBHOOK_SECRET`.

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
Ultimate requests go ahead of Pro ones. Never attach a response time to
it. Pro's booking integration means **connecting or embedding an existing
third-party service**; bespoke booking systems, availability logic, custom
payment flows, accounts or automated workflows are quoted separately. Revision
feedback is asked for within **10 working days** of a preview, after which the
project may pause and the date may move — and **silence is never treated as
approval**.

These constraints are encoded in `managementTerms`, `commercialTerms`,
`TIMELINE_TERMS`, `COMPLIMENTARY_MONTH_TERMS`, each plan's `changeTime`, and
the `note` fields on the Pro and Custom scopes.

**`roadmapServices` must never render.** It is a private list of ideas. Nothing
in it is a product yet, and putting it on a page would advertise something
Northbound cannot deliver.

**Northbound.AI is in development, not on sale.** The division builds **AI
employees** — workers that hold a role and do a job end to end, not chatbots.
The roster lives in `src/lib/ai-employees.ts`; adding one is a single entry.
Each carries a `state` (`live` / `building` / `planned`) and **only `live` may
be described as usable today** — nothing is `live` yet. Attach no price and no
delivery date to anything in that division.

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
