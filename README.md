# Northbound — website

Marketing site for **Northbound**, the parent brand, and its two divisions:

- **Northbound Web** — `/web/*`. Live, taking projects.
- **Northbound AI** — `/ai/*`. Private preview. Nothing there is on sale.

Next.js 16 (App Router), Tailwind CSS v4, TypeScript, deployed on Vercel. The
enquiry form sends through Resend.

---

## Before this goes live

These are placeholders. Each has exactly one home.

| What | Where | Currently |
|---|---|---|
| Domain | `NEXT_PUBLIC_SITE_URL` env var, and the fallback in `src/lib/site.ts` | `northboundweb.co.uk` |
| Contact email | `site.email` in `src/lib/site.ts` | `che@northboundweb.co.uk` — the address already published on the live domain |
| Resend keys | Vercel env vars | **Not set** — the form cannot deliver until they are |

## Pricing

Read the header comment in `src/lib/services.ts` before changing any number.

**£119 is the only confirmed build price.** It is published as a *from* price on
the Starter scope. The previous ladder (£199 / £299 / £399 / £499) has been
**withdrawn**. It must not be reinstated, and replacement figures must not be
invented and presented as approved.

| Build scope | Price | Pages | Revisions | Timescale |
|---|---|---|---|---|
| Starter | **from £119** | Up to 3 | 1 round | ~5–7 working days |
| Business (*Most chosen*) | Quoted | Up to 5 | 2 rounds | ~7–10 working days |
| Extended | Quoted, + complimentary month | Up to 8 | 3 rounds | ~10–15 working days |
| Custom | Quoted, + complimentary month | No cap | Agreed in the quote | Agreed in the quote |

Scope was approved and is settled — only the money above the entry point is
open. When the ladder is confirmed, set `price` on each scope and flip
`pricing` from `'quoted'` to `'fixed'`. Every surface reads from that array, so
nothing else needs editing.

| Management plan | Price | Included change time |
|---|---|---|
| Essential | £39/month | Up to 30 minutes per billing month |
| Advanced | £80/month | Up to 1 hour per billing month |
| Complete | £149/month | Up to 2 hours per billing month |

Payment is **50% deposit to begin, 50% once complete and approved, before go-live**.

Prices are shown as plain figures — **no VAT wording either way**, by decision.

**Rules that the copy must keep honouring:**

- Included change time does **not** roll over; work beyond it is quoted first.
- Change time covers content, copy and small adjustments — **not** new
  features, redesigns or development work.
- Never promise unlimited fixes, updates or support.
- No absolute promises ("every time") and no guaranteed same-day response.
- The complimentary month must **not** auto-convert into a paid subscription —
  the customer chooses at the end of it.
- A management plan is optional and must not be implied as a condition of
  having a website built.
- Custom must not imply that accounts, databases, payments, portals or
  ecommerce are included; those are quoted separately.
- Timelines are **estimates, never guarantees**, and must always render
  alongside `TIMELINE_TERMS` so the conditions travel with the number.
- Cancelling a plan stops future renewals; the current billing period is not
  part-refunded. Never say cancelling takes the site offline.
- Management cards lead with benefits. Change time renders **below** them, so a
  plan does not read as hours sold by the month.
- Copywriting, photography, logo/brand design and paid stock are **not** in the
  fixed scopes.
- "Priority support" is a queue position, **not** a response-time promise.
- Extended's booking integration is **connecting/embedding an existing
  service**. Bespoke booking systems are scoped and quoted separately.
- Revision feedback is requested within **10 working days** of a preview; later
  feedback can pause the project. **Silence is never treated as approval.**

These live in `managementTerms`, `commercialTerms`, `TIMELINE_TERMS`,
`COMPLIMENTARY_MONTH_TERMS`, each plan's `changeTime`, and the `note` fields on
the Extended and Custom scopes — all in `src/lib/services.ts`.

`ADVANCED_MANAGEMENT_PRICE` is exported from the same file and used wherever
the complimentary month is mentioned, so its stated value cannot drift out of
sync with the plan's own price.

`roadmapServices` is a **private list of ideas**. It is never rendered. Putting
it on a page would advertise services Northbound cannot currently deliver.

The About page and `/web/work` deliberately contain no claims that could be
checked and found false — no invented years of experience, client counts or
case studies. `/web/work` holds an empty `projects` array and sets its own
`noindex` until there is real work to show.

---

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Without `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` set, the
form validates and behaves normally, the send fails, and the visitor is offered
a prefilled `mailto:` fallback so the enquiry still reaches Northbound. The
specific cause is logged to the server console only — configuration detail
should never reach a visitor's screen.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

---

## Structure

```
src/
  app/
    layout.tsx            root layout, fonts, metadata, header/footer
    page.tsx              NORTHBOUND gateway — parent brand, two divisions
    web/
      page.tsx            Northbound Web overview
      services/           scopes, prices, management plans, commercial terms
      process/            how a build runs, standards, stack
      work/               empty by design, noindex until there is real work
    ai/
      page.tsx            Northbound AI overview (preview)
      full-access/        what Full Access unlocks, request route
    about/                parent-brand positioning
    contact/              enquiry form, prefilled from ?package= / ?type=
    unlock/               UNLOCK code redemption
    opengraph-image.tsx   build-time social share image
    sitemap.ts  robots.ts  icon.svg  not-found.tsx
  components/
    site-header.tsx       division-aware nav, mobile division switcher
    site-footer.tsx
    contact-form.tsx      client component, useActionState, CSS branching
    ui.tsx                Container, Section, Display, buttons, CardCta
    graphics.tsx          compass, browser frame, crop marks, wireframes
  lib/
    site.ts               brand, divisions, nav — edit here, not in pages
    services.ts           scopes, prices, process, standards — the site's copy
    unlock.ts             server-only: UNLOCK codes and rewards
    rate-limit.ts         in-memory limiter for the form
    contact/
      schema.ts           zod schema shared by client and server
      actions.ts          server action: spam checks, validation, Resend
```

Content lives in `src/lib/services.ts` and `src/lib/site.ts` rather than being
scattered through JSX, so copy and price edits are a one-file change.

Old URLs (`/services`, `/approach`, `/work`, `/jarvis`) are permanently
redirected to their new homes in `next.config.ts`.

---

## The enquiry form

A server action, not an API route, so it works without JavaScript. The type
picker at the top branches the rest of the form using CSS `:has()`, so the
relevant questions appear without JavaScript either.

Four layers before anything is sent:

1. **Honeypot** — an off-screen `subject` field. Filled in means a bot. It is
   named `subject` rather than `website` because the form has a real
   existing-site URL field, and the two collided.
2. **Time trap** — submissions arriving under 3 seconds after the form mounts
   are rejected. Both traps return a fake success so a bot learns nothing.
3. **Rate limit** — 5 submissions per IP per hour.
4. **Validation** — the same zod schema the browser uses is re-run on the
   server, because a server action is a public POST endpoint that anyone can
   call directly.

Enquiry content is HTML-escaped before it goes into the notification email, and
CR/LF is stripped from anything interpolated into a mail header. If delivery
fails, the visitor gets a prefilled `mailto:` containing the whole enquiry, and
the server logs name, email and enquiry type only — never the message body.

**Known limitation:** the rate limiter holds state in module memory, so on
serverless it is per-instance rather than global. That is a deliberate
trade-off for a site whose only write path is this form. If this site ever
grows a login or a payment path, swap it for a shared store rather than
extending it.

---

## Colour and contrast

Warm cream paper, deep bottle green, one burnt-orange interaction colour. No
purple, no gradients.

Brand orange `--accent` (#F04A0A) does **not** meet WCAG AA for small text on
either surface, so there are two companions: `--accent-deep` for small orange
text on cream, `--accent-lit` for small orange text on green. Fills, arrows,
full stops and large display type keep the brand orange.

Components that can sit on either surface (`Label`, `CardCta`) take a `tone`
prop rather than being overridden with a class. Two Tailwind colour utilities
of equal specificity are resolved by **stylesheet order**, not by the order
they appear in the class attribute — overriding by class once produced CTAs
that were invisible on the green sections.

---

## Deploying

1. Import the repository in Vercel. The framework preset is detected; no build
   settings need changing.
2. Set the environment variables from `.env.example` under
   **Vercel → Project → Settings → Environment Variables**. Set
   `NEXT_PUBLIC_SITE_URL` for Production only.
3. Verify the sending domain in **Resend → Domains** before expecting the form
   to deliver. The `CONTACT_FROM_EMAIL` address must be on that domain.
4. Point DNS at Vercel in Cloudflare. Plan this in advance — changing DNS
   records can take a domain's website *and email* offline if the existing MX
   records are disturbed.

Security headers (`X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy`) are set in `next.config.ts`.
