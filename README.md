# Northbound Web — website

Marketing site for Northbound Web. Next.js 16 (App Router), Tailwind CSS v4,
TypeScript, deployed on Vercel. The enquiry form sends through Resend.

---

## Before this goes live

These are placeholders. Nothing else in the codebase needs to change to fix
them — each has one home.

| What | Where | Currently |
|---|---|---|
| Domain | `NEXT_PUBLIC_SITE_URL` env var, and the fallback in `src/lib/site.ts` | `northboundweb.co.uk` |
| Contact email | `site.email` in `src/lib/site.ts` | `hello@northboundweb.co.uk` |
| Resend keys | Vercel env vars | Not set |

## Pricing

The prices in `src/lib/services.ts` are the **real advertised prices**, not
examples:

| Package | Price |
|---|---|
| Basic Build | £199 |
| Standard Build | £299 (marked *Most popular*) |
| Advanced Build | £399 — includes 1 month Advanced Management free |
| Fully Custom Build | from £499 — includes 1 month Advanced Management free |

| Management plan | Price |
|---|---|
| Website Management | from £39/month |
| Advanced Management | £80/month |
| Complete Management | £149/month |

Only the Fully Custom Build is variable, because its final figure depends on
requirements. The three packaged builds must **not** be described as "example",
"starting from" or "indicative" prices anywhere in the copy.

`ADVANCED_MANAGEMENT_PRICE` is exported from `src/lib/services.ts` and used
wherever the free month is mentioned, so its stated value cannot drift out of
sync with the plan's own price.

The About page deliberately contains no claims that could be checked and found
false — no invented years of experience, client counts or case studies. Add
those once they are real.

---

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Without `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` set, the
form validates and behaves normally but the send fails and the visitor sees a
generic error. The specific cause is logged to the server console only —
configuration detail should never reach a visitor's screen.

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
    layout.tsx          root layout, fonts, metadata, header/footer
    page.tsx            home
    services/           packages, prices and management plans
    approach/           process, standards, stack
    about/              positioning
    contact/            enquiry form page
    opengraph-image.tsx build-time social share image
    sitemap.ts          robots.ts   icon.svg
  components/
    site-header.tsx     sticky nav with mobile disclosure
    site-footer.tsx
    contact-form.tsx    client component, useActionState
    ui.tsx              Container, Section, headings, buttons
    logo.tsx            compass mark
  lib/
    site.ts             name, url, email, nav — edit here, not in pages
    services.ts         services, prices, process, standards — the site's copy
    rate-limit.ts       in-memory limiter for the form
    contact/
      schema.ts         zod schema shared by client and server
      actions.ts        server action: spam checks, validation, Resend
```

Content lives in `src/lib/services.ts` and `src/lib/site.ts` rather than being
scattered through JSX, so copy and price edits are a one-file change.

---

## The enquiry form

A server action, not an API route, so it works without JavaScript. Four layers
before anything is sent:

1. **Honeypot** — a hidden `website` field. Filled in means a bot.
2. **Time trap** — submissions arriving under 3 seconds after the form mounts
   are rejected. Both traps return a fake success so a bot learns nothing.
3. **Rate limit** — 5 submissions per IP per hour.
4. **Validation** — the same zod schema the browser uses is re-run on the
   server, because a server action is a public POST endpoint that anyone can
   call directly.

Enquiry content is HTML-escaped before it goes into the notification email, and
CR/LF is stripped from anything interpolated into a mail header.

**Known limitation:** the rate limiter holds state in module memory, so on
serverless it is per-instance rather than global. That is a deliberate
trade-off for a site whose only write path is this form — it raises the cost of
casual spam without buying infrastructure for a problem that does not exist
yet. If this site ever grows a login or a payment path, swap it for a shared
store rather than extending it.

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
