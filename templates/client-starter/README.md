# Client starter

Next.js App Router base for a small-business site. Copy it, edit one file, ship.

## Use it

```bash
./scripts/new-client.sh acme-plumbing "Acme Plumbing"
cd ../acme-plumbing && npm install && cp .env.example .env.local && npm run dev
```

1. Edit `src/lib/site.ts` (name, URL, phone, email, address, nav).
2. Replace the colours in `src/app/globals.css`.
3. Build the real pages. Add each route to `src/app/sitemap.ts`.
4. Rewrite `src/app/privacy/page.tsx` to match what the site actually collects.

## Environment variables

See `.env.example`. Set them in Vercel, never in git. The contact form will not send until
`RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set and the sending domain is verified in Resend.

## Before launch

- [ ] No placeholder text left (search for `[` in `privacy/page.tsx`, "Client Name", "example")
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain
- [ ] Contact form tested on a phone against the preview URL
- [ ] Pre-launch audit run on the preview with no red items
- [ ] Enable HSTS in `next.config.ts` once the domain is live on HTTPS
- [ ] DNS change planned with current records written down first
- [ ] Record domain, registrar, renewal date and Stripe customer in the register
