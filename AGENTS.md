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
and the management plans are the actual advertised prices. Do **not** describe
them as example, indicative or "starting from" figures. Only the Fully Custom
Build carries a "from" (£499), because its final price depends on requirements.
Use the exported `ADVANCED_MANAGEMENT_PRICE` wherever the free month's value is
quoted, so it cannot drift from the plan's own price.

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
