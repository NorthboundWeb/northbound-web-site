# Northbound — website

Marketing site for **Northbound**, the parent brand, and its two divisions:

- **Northbound.Web** — `/web/*`. Live, taking projects.
- **Northbound.AI** — `/ai/*`. In development. Northbound Employees —
  specialists hired for one job. Nothing there is on sale, and nothing claims
  to be working before it is.

Three visual environments share one token contract: the parent is cream and
near-black, Web adds burnt orange, AI is charcoal and signal yellow. Each is
set server-side by `SiteShell` via `data-division`, so a third division is one
entry in `divisions`, one palette block, and one layout file.

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
**That file is the only place a price is written down** — every page, the
Stripe session and every enquiry link read from it, so two surfaces cannot
disagree about what something costs.

Build prices are **one-off totals for the website**. Never render one as
weekly or monthly, and never derive an instalment figure from one.

| Build scope | Price | Pages | Revisions | Timescale |
|---|---|---|---|---|
| Starter | **£249** one-off | Up to 3 | 1 round | ~5–7 working days |
| Advanced (*Most chosen*) | **£299** one-off | Up to 5 | 2 rounds | ~7–10 working days |
| Pro | **£389** one-off, + complimentary month | Up to 8 | 3 rounds | ~10–15 working days |
| Custom | **From £499**, quoted | No cap | Agreed in the quote | Agreed in the quote |

Starter, Advanced and Pro are purchasable through Stripe Checkout
(`checkout: true`). Custom is not: its CTA is **Get a custom quote**, because
£499 is a starting figure rather than a price you can pay today.

Withdrawn and not to be reinstated: the £119 entry point, the
£199/£299/£399/£499 ladder, and Business/Extended as tier names.

| Management plan | Price | Included change time |
|---|---|---|
| Pro Management | £60/month | Up to 1 hour per billing month |
| Ultimate Management | £69/month | Up to 2 hours per billing month |

Management is a **separate recurring subscription**, never part of a build
price. The £9 gap is quoted from `MANAGEMENT_STEP_UP`, which is derived from
the two prices, so the "£9 more" claim cannot drift away from them.

**Rules that the copy must keep honouring:**

- Included change time does **not** roll over; work beyond it is quoted first.
- Change time covers content, copy and small adjustments — **not** new
  features, redesigns or development work.
- Never promise unlimited fixes, updates, development or support.
- No absolute promises ("every time") and no guaranteed same-day response.
- The complimentary month must **not** auto-convert into a paid subscription —
  the customer chooses at the end of it.
- A management plan is optional and must not be implied as a condition of
  having a website built.
- Custom must not imply that accounts, databases, payments, portals or
  ecommerce are included; those are quoted separately.
- Timelines are **estimates, never guarantees**, and must always render
  alongside `TIMELINE_TERMS`.
- Cancelling a plan stops future renewals; the current billing period is not
  part-refunded. Never say cancelling takes the site offline.
- Copywriting, photography, logo/brand design and paid stock are **not** in the
  fixed scopes.
- "Priority support" is a queue position, **not** a response-time promise.
- Pro's booking integration is **connecting/embedding an existing service**.
  Bespoke booking systems are scoped and quoted separately.
- Revision feedback is requested within **10 working days** of a preview.
- Prices are shown as plain figures — **no VAT wording either way**, by decision.

These live in `managementTerms`, `commercialTerms`, `TIMELINE_TERMS`,
`COMPLIMENTARY_MONTH_TERMS`, each plan's `changeTime`, and the `note` fields on
the Pro and Custom scopes — all in `src/lib/services.ts`.

`roadmapServices` is a **private list of ideas**. It is never rendered.

The About page and `/web/work` deliberately contain no claims that could be
checked and found false. `/web/work` holds an empty `projects` array and sets
its own `noindex` until there is real work to show.

---

## Payments

Stripe Checkout, entirely optional. With no `STRIPE_SECRET_KEY` the site works
exactly as before — the selector's button becomes an enquiry instead.

The one rule the integration exists to enforce: **the amount is read from
`services.ts`, never from the request.** The browser sends a package slug; the
worst it can do is name a package that does not exist or is not purchasable.
It can never name a price.

- `src/lib/checkout/stripe.ts` — session creation, session read-back, webhook
  verification. Server-only.
- `src/lib/checkout/actions.ts` — the server action behind the button, so
  checkout works without JavaScript.
- `src/app/api/stripe/webhook/route.ts` — signature-verified receiver. Fails
  closed without `STRIPE_WEBHOOK_SECRET`.
- `src/app/web/checkout/success/page.tsx` — re-reads the session from Stripe.
  **A payment is never treated as successful on the strength of a redirect.**

**Klarna is not implemented here and must not be.** `payment_method_types` is
deliberately not sent, so Stripe shows each customer the methods they are
actually eligible for, configured under Stripe → Settings → Payment methods.
Northbound never calculates an instalment, names a plan, or promises terms it
does not set. The only permitted wording is `KLARNA_NOTE`.

A live key (`sk_live_…`) outside production throws rather than warns, so a
branch deploy cannot charge a real card.

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
    layout.tsx            html/body and fonts only — the shell is per division
    (parent)/             route group: gateway, About, Contact, Unlock
      layout.tsx          SiteShell division="parent"
      page.tsx            NORTHBOUND gateway — two full-environment panels
    web/
      layout.tsx          SiteShell division="web"
      page.tsx            Northbound Web overview
      services/           scopes, prices, management plans, commercial terms
      process/            how a build runs, standards, stack
      work/               empty by design, noindex until there is real work
    ai/
      layout.tsx          SiteShell division="ai"
      page.tsx            hero, outcome picker, roster, teams, control
      employees/          roster and one page per employee (generated)
      services/           teams and one page per team (generated)
      access/             early access — reuses the site's one enquiry form
    about/                parent-brand positioning
    contact/              enquiry form, prefilled from ?package= / ?type=
    unlock/               UNLOCK code redemption
    opengraph-image.tsx   build-time social share image
    sitemap.ts  robots.ts  icon.svg  not-found.tsx
  components/
    site-shell.tsx        the frame: theme, grain, header, main, footer
    ai/                   employee-mark, employee-card, outcome-picker, team-flow
    site-header.tsx       division-aware nav, mobile division switcher
    site-footer.tsx
    contact-form.tsx      client component, useActionState, CSS branching
    ui.tsx                Container, Section, Display, buttons, CardCta
    graphics.tsx          compass, browser frame, crop marks, wireframes
  lib/
    site.ts               brand, divisions, nav — edit here, not in pages
    ai/employees.ts       the roster; `status` is what licenses a claim
    ai/teams.ts           employees combined around an outcome
    ai/outcomes.ts        "what do you need help with?" — validated at load
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
