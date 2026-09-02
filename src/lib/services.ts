/**
 * Northbound Web — what is actually for sale.
 *
 * PRICING RULES (read before editing):
 *
 * 1. This file is the ONLY place a price is written down. Every page, every
 *    checkout session and every enquiry link reads from here, so two surfaces
 *    cannot disagree about what something costs.
 * 2. The confirmed ladder is Starter £249, Advanced £299, Pro £389 and Custom
 *    from £499. Earlier ladders (£119 entry; £199/£299/£399/£499; Business and
 *    Extended as tier names) have been withdrawn. Do not reinstate them.
 * 3. Build prices are ONE-OFF. Never render a build price as weekly or
 *    monthly, and never derive an instalment figure from one — see
 *    KLARNA_NOTE below.
 * 4. Management is a separate recurring subscription: Pro £39/month,
 *    Ultimate £59/month and Custom from £59/month. It is never a condition
 *    of having a site built.
 * 5. Do not invent a price that is not in this file.
 */

/** Build prices are one-off. This label renders beside every one of them. */
export const ONE_OFF_LABEL = 'One-off website build'

/**
 * ONLY renderable when `isCheckoutEnabled()` is true. Checkout is currently
 * off, so nothing on the site may say this — a visitor cannot pay online, and
 * claiming otherwise sends them to a dead end.
 *
 * When it is switched on: Klarna is offered by Stripe to whoever Stripe finds
 * eligible. Northbound must not calculate instalments, name a plan ("Pay in
 * 3") or promise terms. This sentence is the most we are ever allowed to say.
 */
export const KLARNA_NOTE = 'Klarna available at checkout'

/**
 * How a build actually happens today. One process, stated identically on
 * every surface — the services page, the package selector, the contact FAQ
 * and the practical terms all render from this array, so they cannot drift
 * apart and contradict each other the way they did.
 */
export const ENQUIRY_PROCESS = [
  {
    step: '01',
    title: 'Choose, or ask',
    body: 'Pick the package that looks right, or say what you are trying to do and I will tell you which one fits — including when it is the cheaper one.',
  },
  {
    step: '02',
    title: 'Send an enquiry',
    body: 'A few sentences about the business is plenty. Nothing is charged, and you are not committing to anything by asking.',
  },
  {
    step: '03',
    title: 'Get a fixed quote',
    body: 'I confirm the scope with you and put a fixed price in writing, with what is included set out beside it. No hourly billing and no surprise invoice.',
  },
  {
    step: '04',
    title: 'A 50% deposit starts it',
    body: 'Once you are happy with the quote, a 50% deposit secures the project and work begins. You are invoiced directly.',
  },
  {
    step: '05',
    title: 'The balance before launch',
    body: 'The remaining 50% is payable once the site is complete and you have approved it, before it goes live.',
  },
] as const

/** One sentence version of the above, for places with no room for five steps. */
export const ENQUIRY_PROCESS_SUMMARY =
  'Send an enquiry, get a fixed price in writing, then a 50% deposit starts the work and the balance is due before launch.'

/** Pro Management's monthly price, quoted wherever the free month is mentioned. */
export const PRO_MANAGEMENT_PRICE = 39

export type BuildScope = {
  slug: string
  name: string
  /** 'fixed' is payable now through Stripe; 'quoted' is scoped first. */
  pricing: 'fixed' | 'quoted'
  price: number
  /** True when `price` is a starting figure rather than the whole cost. */
  from?: boolean
  badge?: string
  summary: string
  bestFor: string
  /** Page cap — the main driver of how much work a build is. */
  pages: string
  revisions: string
  timeline: string
  includes: string[]
  note?: string
  freeProManagementMonth?: boolean
  /**
   * Stripe reads the amount from this file, never from the browser. Only
   * 'fixed' scopes are purchasable; Custom is quoted and has no checkout.
   */
  checkout: boolean
}

export const buildScopes: BuildScope[] = [
  {
    slug: 'starter',
    name: 'Starter',
    pricing: 'fixed',
    price: 249,
    checkout: true,
    summary:
      'A small, sharp site that tells people who you are, what you do and how to reach you.',
    bestFor: 'Sole traders and new businesses who need to look established, fast.',
    pages: 'Up to 3 pages',
    revisions: '1 revision round',
    timeline: 'Approximately 5-7 working days',
    includes: [
      'Up to 3 pages',
      'Mobile responsive',
      'Enquiry form straight to your inbox',
      'Core SEO setup',
      '1 revision round',
    ],
  },
  {
    slug: 'advanced',
    name: 'Advanced',
    pricing: 'fixed',
    price: 299,
    checkout: true,
    badge: 'Most chosen',
    summary:
      'Room to explain each of your services properly, with analytics so you can see what visitors actually do.',
    bestFor: 'Established businesses with a few distinct services or locations.',
    pages: 'Up to 5 pages',
    revisions: '2 revision rounds',
    timeline: 'Approximately 7-10 working days',
    includes: [
      'Everything in Starter',
      'Up to 5 pages',
      'A page per service, so each can rank on its own',
      'Analytics setup',
      'Google Business link or integration, where applicable',
      '2 revision rounds',
    ],
  },
  {
    slug: 'pro',
    name: 'Pro',
    pricing: 'fixed',
    price: 389,
    checkout: true,
    freeProManagementMonth: true,
    summary:
      'A larger site with something working behind it — booking, enquiry routing, or a connection to a tool you already use.',
    bestFor: 'Businesses taking bookings or enquiries regularly, or with more to say.',
    pages: 'Up to 8 pages',
    revisions: '3 revision rounds',
    timeline: 'Approximately 10-15 working days',
    includes: [
      'Everything in Advanced',
      'Up to 8 pages',
      'One standard third-party booking integration, where compatible',
      'Structured data for richer search results',
      '3 revision rounds',
      `1 complimentary month of Pro Management, worth \u00a3${PRO_MANAGEMENT_PRICE}`,
    ],
    note: 'The booking integration means connecting or embedding a suitable booking service you already use, or one we pick together. Building a booking system from scratch — availability rules, custom payment flows, customer accounts — is a bigger job and is scoped and quoted separately.',
  },
  {
    slug: 'custom',
    name: 'Custom',
    pricing: 'quoted',
    price: 499,
    from: true,
    checkout: false,
    freeProManagementMonth: true,
    summary:
      'For work that does not fit a scope. We agree the requirements together and the price is quoted from that.',
    bestFor: 'Businesses whose requirements do not fit one of the fixed scopes.',
    pages: 'No fixed page cap',
    revisions: 'Revision allowance agreed in the quote',
    timeline: 'Agreed individually in your written quote',
    includes: [
      'Requirements and scope agreed individually',
      'No fixed page cap',
      'Revision allowance agreed in the quote',
      `1 complimentary month of Pro Management, worth \u00a3${PRO_MANAGEMENT_PRICE}`,
    ],
    note: 'Substantial functionality — user accounts, databases, payments, customer portals, ecommerce and the like — is scoped and quoted separately before any work begins.',
  },
]

/** Only these can reach Stripe. Custom has no purchasable amount. */
export const purchasableScopes = buildScopes.filter((s) => s.checkout)

export function scopeBySlug(slug: string): BuildScope | undefined {
  return buildScopes.find((s) => s.slug === slug)
}

/** What the site is allowed to say about money above the entry price. */
export const PRICING_PROMISE =
  'You get a fixed price in writing before you commit to anything. No hourly billing, no surprise invoice.'

export type ManagementPlan = {
  slug: string
  name: string
  /** Per month, recurring. Never conflate with a one-off build price. */
  price: number
  /** True when `price` is a starting figure rather than the whole cost. */
  from?: boolean
  summary: string
  includes: string[]
  /**
   * The monthly update allowance. Absent on a quoted plan — Custom's
   * allowance is agreed in writing per customer, and inventing a number for
   * it here would be inventing the product.
   */
  changeTime?: string
  enquiryParam: string
  cta: string
  badge?: string
}

/**
 * Three plans. Pro and Ultimate are fixed; Custom is quoted, because the
 * businesses that need it do not have a shape a standard plan can price.
 *
 * The update allowance is the boundary on every one of them. No plan
 * promises unlimited anything, and Custom deliberately carries no allowance
 * here — it is agreed in writing before work begins.
 */
export const managementPlans: ManagementPlan[] = [
  {
    slug: 'pro-management',
    name: 'Pro Management',
    price: PRO_MANAGEMENT_PRICE,
    summary:
      'Your website hosted, maintained and monitored, with up to 2 hours of requested website updates per billing month.',
    includes: [
      'Website hosting',
      'Routine maintenance and updates',
      'Uptime and security monitoring',
      'Up to 2 hours of requested website updates per billing month',
    ],
    changeTime:
      'Includes up to 2 hours of requested website updates per billing month.',
    enquiryParam: 'pro-management',
    cta: 'Choose Pro Management',
  },
  {
    slug: 'ultimate-management',
    name: 'Ultimate Management',
    price: 59,
    badge: 'Best value',
    summary:
      'Everything in Pro, with up to 4 hours of requested website updates per billing month, priority requests and a clear monthly report.',
    includes: [
      'Everything included in Pro Management',
      'Up to 4 hours of requested website updates per billing month',
      'Priority requests',
      'Clear monthly performance and maintenance report',
    ],
    changeTime:
      'Includes up to 4 hours of requested website updates per billing month.',
    enquiryParam: 'ultimate-management',
    cta: 'Choose Ultimate Management',
  },
  {
    slug: 'custom-management',
    name: 'Custom Management',
    price: 59,
    from: true,
    summary:
      'Tailored ongoing support for businesses with multiple websites, larger workloads or requirements that do not fit the standard plans. The scope and monthly price are agreed in writing before work begins.',
    includes: [
      'Scope agreed around your business, not a fixed tier',
      'Suitable for multiple websites or larger workloads',
      'Update allowance and inclusions agreed in your quote',
      'A fixed monthly price, in writing, before anything starts',
    ],
    // No changeTime on purpose: see the type. Custom's allowance is quoted.
    enquiryParam: 'custom-management',
    cta: 'Discuss Custom Management',
  },
]

/**
 * The gap between the two fixed plans, quoted wherever the comparison is
 * made, so the "£20 more" claim can never drift away from the actual prices.
 */
export const MANAGEMENT_STEP_UP =
  managementPlans[1].price - managementPlans[0].price

/**
 * Bounded on purpose. Never promise unlimited fixes, updates, development or
 * support — the change-time allowance is what protects the business.
 */
/** The policy line that renders directly beneath the plan cards. */
export const MANAGEMENT_ALLOWANCE_POLICY =
  'Update allowances reset at the end of each billing month. Unused time does not roll over.'

export const managementTerms = [
  MANAGEMENT_ALLOWANCE_POLICY,
  'Every plan is optional and rolling. There is no minimum term, and you can cancel before your next billing date.',
  'Custom Management has no standard allowance. Its scope, inclusions and monthly price are agreed in writing before work begins.',
  'Additional work beyond the included allowance is quoted separately and agreed before it is carried out.',
  'Update time covers content, copy and small adjustments — not new features, redesigns or development work, which are quoted separately.',
  'You can cancel before your next billing date, which stops future renewals. Amounts already charged for the current billing period are not partially refunded if you cancel part-way through it.',
  'If you end a plan, I will set out your options — either continuing hosting separately, where that is available, or transferring the website to another suitable hosting provider.',
  'A management plan is optional. It is not a condition of having a website built.',
  'A management subscription is a separate monthly charge. It is not part of the one-off build price, and a build is never billed weekly or monthly.',
]

/** For businesses who already have a site — discoverable without competing with builds. */
export const existingSiteHelp = {
  slug: 'existing',
  word: 'Inherit',
  summary:
    'You already have a website. It just is not being looked after, or it is not doing its job.',
  options: [
    {
      title: 'Take over management',
      body: 'Move hosting and maintenance to Northbound and stop worrying about updates, uptime and security. Priced on the management plans.',
    },
    {
      title: 'Fix what is broken',
      body: 'Forms that do not send, pages that will not load on a phone, a site that has slowed to a crawl. Quoted once I have looked at it.',
    },
    {
      title: 'Improve what is there',
      body: 'Keep the site you have and make it work harder — clearer structure, faster pages, better copy on the pages that matter. Quoted by scope.',
    },
    {
      title: 'Move it somewhere sensible',
      body: 'Migration off a platform that is charging too much or holding your content hostage, onto infrastructure you own. Quoted per site.',
    },
  ],
  note: 'A short look at your current site is free. If it is a five-minute fix, I will tell you that rather than quote for a rebuild.',
}

export const TIMELINE_TERMS =
  'Estimates, not guarantees. The clock starts once the deposit has been received and I have the information, content and assets needed to begin. Delays in content, feedback or approvals can move the completion date.'

export const COMPLIMENTARY_MONTH_TERMS =
  'The complimentary month does not turn into a paid subscription automatically. When it ends, you decide whether to start a paid management plan — if you do nothing, nothing is charged.'

export const commercialTerms: { title: string; points: string[] }[] = [
  {
    title: 'Payment',
    points: [
      'Every project starts with an enquiry. There is no online checkout — you are invoiced directly once we have agreed the scope.',
      'The price you see is the one-off total for the website. It is confirmed in a written quote before anything is charged.',
      'A 50% deposit secures your project and allows work to begin.',
      'The remaining 50% is payable once the website is complete and approved, before it goes live.',
      'Custom projects are quoted first and invoiced against the agreed quote.',
    ],
  },
  {
    title: 'Timescales',
    points: [
      'Starter — approximately 5–7 working days.',
      'Advanced — approximately 7–10 working days.',
      'Pro — approximately 10–15 working days.',
      'Custom — agreed individually in your written quote.',
      TIMELINE_TERMS,
    ],
  },
  {
    title: 'Revisions and feedback',
    points: [
      'Each scope includes a set number of revision rounds — one on Starter, two on Advanced, three on Pro. Custom is agreed in your quote.',
      'Please send the feedback for each round within 10 working days of getting the preview link.',
      'If it arrives later than that, the project may be paused and the estimated completion date may move.',
      'Silence is never treated as approval. If I have not heard from you, I will follow up rather than sign the work off on your behalf.',
    ],
  },
  {
    title: 'Domains',
    points: [
      'Your domain should be owned and controlled by you.',
      'I can help you buy one, configure it, and connect it to your site.',
      'Domain registration and renewal charges are separate, unless a written quote says otherwise.',
    ],
  },
  {
    title: 'Content and images',
    points: [
      'You normally supply your business information, any branding or logo files you have, specific photographs you want used, accurate service or product details, and your contact information.',
      'I format and structure what you send, and make reasonable improvements to it as part of the build.',
      'Professional copywriting, photography, logo or brand design, and paid stock assets are not included. Anything substantially outside a scope is quoted separately.',
      'Waiting on content is the most common reason a project runs past its estimate.',
    ],
  },
]

export const process = [
  {
    step: '01',
    title: 'Conversation',
    body: 'A call to work out what the site is for, who it is talking to, and which scope fits. No charge and no obligation — and if a smaller scope would do the job, that is the one I will point you at.',
  },
  {
    step: '02',
    title: 'Quote',
    body: 'A fixed price in writing, with the scope spelled out beside it. A 50% deposit secures the project; the remaining 50% is payable once the site is complete and approved, before it goes live.',
  },
  {
    step: '03',
    title: 'Design',
    body: 'Structure and layout first, then the visual design, reviewed with you before a line of production code is written. Changing a design is cheap; changing a built site is not.',
  },
  {
    step: '04',
    title: 'Build',
    body: 'Built in the open on a live preview link you can check at any point. Most scopes take between one and three weeks, counted from the deposit and the arrival of your content.',
  },
  {
    step: '05',
    title: 'Revisions',
    body: 'Your scope includes a set number of revision rounds. Feedback within 10 working days of the preview keeps things moving; later than that and the finish date can shift. I will never take silence as approval.',
  },
  {
    step: '06',
    title: 'Launch',
    body: 'Testing across real devices, then a careful DNS switch — planned in advance so nothing goes dark. Handover comes with documentation you can actually use, and a management plan afterwards is entirely optional.',
  },
]

export const standards = [
  {
    title: 'Fast by default',
    body: 'Pages are pre-rendered and served from a global edge network. Performance is a design constraint from the start, not an optimisation pass bolted on at the end when it is too late to fix cheaply.',
  },
  {
    title: 'Accessible',
    body: 'Real semantic HTML, keyboard navigation, sensible contrast and labelled form fields. It is the right thing to do, it is better for search, and in the UK accessibility is increasingly a legal expectation rather than a nice-to-have.',
  },
  {
    title: 'Secure',
    body: 'Secrets stay server-side and never reach the browser. Forms validate on the server, not just in the page. Where a project stores data, access rules are enforced by the database rather than by trusting the front end to behave.',
  },
  {
    title: 'Yours to keep',
    body: 'Every project lives in a Git repository you own, with full history. No proprietary page builder, no hostage situation. If you ever want to take it to another developer, you hand over a repo and they get to work.',
  },
  {
    title: 'Privacy-conscious',
    body: 'Analytics configured to answer business questions without hoovering up personal data. UK GDPR is considered when the system is designed rather than patched in after someone asks about it.',
  },
  {
    title: 'Monitored',
    body: 'Sites are built so that downtime can be spotted by monitoring rather than by a customer emailing to say the contact form has been broken for a fortnight. Uptime monitoring is part of every management plan.',
  },
]

/**
 * ROADMAP ONLY — not rendered anywhere public, and must not be.
 * These are ideas, not products. Northbound cannot deliver them today.
 */
export const roadmapServices = [
  'Shopify / ecommerce builds',
  'Google Business Profile setup',
  'Local SEO',
  'Booking systems (bespoke)',
  'Review systems',
  'Professional business email',
  'Domain / DNS / SSL management',
  'Website rescue',
  'Website migrations',
  'Analytics and reporting',
  'Lead capture',
  'AI website assistants',
  'Business Launch bundles',
  'NB Brands / branding',
] as const
