/**
 * Northbound Web — what is actually for sale.
 *
 * PRICING RULES (read before editing):
 *
 * 1. £119 is the ONLY confirmed build price. It is the entry point.
 * 2. The previous ladder (£199 / £299 / £399 / £499) has been withdrawn by the
 *    owner. Do not reinstate it. Do not invent replacement figures and present
 *    them as approved — tiers above the entry point are quoted until CJ
 *    confirms numbers.
 * 3. The scope of each tier (page caps, revision rounds, timescales) WAS
 *    approved and is unchanged. Only the money is undecided.
 * 4. Management prices were approved separately and are unchanged.
 *
 * When CJ confirms the ladder, set `price` on each scope and flip `pricing`
 * to 'fixed'. Nothing else needs touching — every surface reads from here.
 */

/** The one confirmed, published build price. */
export const ENTRY_PRICE = 119

/** Advanced Management's monthly price, quoted wherever the free month is mentioned. */
export const ADVANCED_MANAGEMENT_PRICE = 80

export type BuildScope = {
  slug: string
  name: string
  /** 'from' publishes a price; 'quoted' publishes none until confirmed. */
  pricing: 'from' | 'quoted'
  /** Only set when pricing is 'from'. */
  price?: number
  badge?: string
  summary: string
  bestFor: string
  /** Page cap — the main driver of how much work a build is. */
  pages: string
  revisions: string
  timeline: string
  includes: string[]
  note?: string
  freeAdvancedMonth?: boolean
}

export const buildScopes: BuildScope[] = [
  {
    slug: 'starter',
    name: 'Starter',
    pricing: 'from',
    price: ENTRY_PRICE,
    summary:
      'A small, sharp site that tells people who you are, what you do and how to reach you.',
    bestFor: 'Sole traders and new businesses who need to look established, fast.',
    pages: 'Up to 3 pages',
    revisions: '1 revision round',
    timeline: 'Approximately 5–7 working days',
    includes: [
      'Up to 3 pages',
      'Mobile responsive',
      'Enquiry form straight to your inbox',
      'Core SEO setup',
      '1 revision round',
    ],
  },
  {
    slug: 'business',
    name: 'Business',
    pricing: 'quoted',
    badge: 'Most chosen',
    summary:
      'Room to explain each of your services properly, with analytics so you can see what visitors actually do.',
    bestFor: 'Established businesses with a few distinct services or locations.',
    pages: 'Up to 5 pages',
    revisions: '2 revision rounds',
    timeline: 'Approximately 7–10 working days',
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
    slug: 'extended',
    name: 'Extended',
    pricing: 'quoted',
    freeAdvancedMonth: true,
    summary:
      'A larger site with something working behind it — booking, enquiry routing, or a connection to a tool you already use.',
    bestFor: 'Businesses taking bookings or enquiries regularly, or with more to say.',
    pages: 'Up to 8 pages',
    revisions: '3 revision rounds',
    timeline: 'Approximately 10–15 working days',
    includes: [
      'Everything in Business',
      'Up to 8 pages',
      'One standard third-party booking integration, where compatible',
      'Structured data for richer search results',
      '3 revision rounds',
      `1 complimentary month of Advanced Management, worth £${ADVANCED_MANAGEMENT_PRICE}`,
    ],
    note: 'The booking integration means connecting or embedding a suitable booking service you already use, or one we pick together. Building a booking system from scratch — availability rules, custom payment flows, customer accounts — is a bigger job and is scoped and quoted separately.',
  },
  {
    slug: 'custom',
    name: 'Custom',
    pricing: 'quoted',
    freeAdvancedMonth: true,
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
      `1 complimentary month of Advanced Management, worth £${ADVANCED_MANAGEMENT_PRICE}`,
    ],
    note: 'Substantial functionality — user accounts, databases, payments, customer portals, ecommerce and the like — is scoped and quoted separately before any work begins.',
  },
]

/** What the site is allowed to say about money above the entry price. */
export const PRICING_PROMISE =
  'You get a fixed price in writing before you commit to anything. No hourly billing, no surprise invoice.'

export type ManagementPlan = {
  slug: string
  name: string
  price: number
  summary: string
  includes: string[]
  changeTime: string
  enquiryParam: string
  cta: string
}

export const managementPlans: ManagementPlan[] = [
  {
    slug: 'essential',
    name: 'Essential',
    price: 39,
    summary:
      'Keeps the site online, secure and up to date, without you having to think about it.',
    includes: [
      'Hosting and technical maintenance',
      'Security and dependency maintenance, where applicable',
      'Uptime monitoring',
    ],
    changeTime:
      'Includes up to 30 minutes of requested website changes per billing month.',
    enquiryParam: 'essential-management',
    cta: 'Choose Essential',
  },
  {
    slug: 'advanced-management',
    name: 'Advanced',
    price: ADVANCED_MANAGEMENT_PRICE,
    summary:
      'Adds a regular check on how the site is actually performing, and moves your requests up the queue.',
    includes: [
      'Everything in Essential',
      'Analytics and performance check',
      'Priority support — your requests go ahead of Essential ones in the queue',
    ],
    changeTime:
      'Includes up to 1 hour of requested website changes per billing month.',
    enquiryParam: 'advanced-management',
    cta: 'Choose Advanced',
  },
  {
    slug: 'complete',
    name: 'Complete',
    price: 149,
    summary:
      'The site reviewed and reported on properly, so you can see how it is doing rather than guess.',
    includes: [
      'Everything in Advanced',
      'Performance and SEO review',
      'Simple monthly performance report',
    ],
    changeTime:
      'Includes up to 2 hours of requested website changes per billing month.',
    enquiryParam: 'complete-management',
    cta: 'Choose Complete',
  },
]

/**
 * Bounded on purpose. Never promise unlimited fixes, updates, development or
 * support — the change-time allowance is what protects the business.
 */
export const managementTerms = [
  'Unused change time does not roll over from one billing month to the next.',
  'Additional work beyond the included allowance is quoted separately and agreed before it is carried out.',
  'Change time covers content, copy and small adjustments — not new features, redesigns or development work, which are quoted separately.',
  'You can cancel before your next billing date, which stops future renewals. Amounts already charged for the current billing period are not partially refunded if you cancel part-way through it.',
  'If you end a plan, I will set out your options — either continuing hosting separately, where that is available, or transferring the website to another suitable hosting provider.',
  'A management plan is optional. It is not a condition of having a website built.',
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
      'A 50% deposit secures your project and allows work to begin.',
      'The remaining 50% is payable once the website is complete and approved, before it goes live.',
    ],
  },
  {
    title: 'Timescales',
    points: [
      'Starter — approximately 5–7 working days.',
      'Business — approximately 7–10 working days.',
      'Extended — approximately 10–15 working days.',
      'Custom — agreed individually in your written quote.',
      TIMELINE_TERMS,
    ],
  },
  {
    title: 'Revisions and feedback',
    points: [
      'Each scope includes a set number of revision rounds — one on Starter, two on Business, three on Extended. Custom is agreed in your quote.',
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
