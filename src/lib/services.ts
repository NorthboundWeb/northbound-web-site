/**
 * Northbound Web's offer: fixed-price website builds and monthly management
 * plans.
 *
 * These are the real advertised prices, not illustrations. Only the Custom
 * build is variable ("from £499"), because its scope is agreed per project.
 * Do not reintroduce "example price" or "starting from" framing around the
 * £199, £299 and £399 packages — they are the advertised prices.
 *
 * Everything a customer is promised lives in this file. Do not add
 * deliverables here that have not been agreed as part of the offer, and do not
 * promise unlimited fixes, updates or support anywhere.
 */

/** Advanced Management's monthly price, quoted wherever the free month is mentioned. */
export const ADVANCED_MANAGEMENT_PRICE = 80

export type BuildPackage = {
  slug: string
  name: string
  price: number
  /** True only where the price is a floor rather than the advertised figure. */
  variable?: boolean
  badge?: string
  summary: string
  bestFor: string
  includes: string[]
  /**
   * An estimate, never a guarantee. Always render alongside TIMELINE_TERMS so
   * the conditions the estimate depends on are never separated from it.
   */
  timeline: string
  /**
   * Query-string value used by /contact?package=… to preselect this package in
   * the enquiry form. Deliberately separate from `slug`, which is a live page
   * anchor (/services#advanced) and must not change.
   */
  enquiryParam: string
  /** Label for the card's call to action. */
  cta: string
  /** Shown as small print under the package — used to bound what is included. */
  note?: string
  /** Whether the package bundles a complimentary month of Advanced Management. */
  freeAdvancedMonth?: boolean
}

export const buildPackages: BuildPackage[] = [
  {
    slug: 'basic',
    name: 'Basic',
    price: 199,
    summary:
      'A small, well-built site that tells people who you are, what you do and how to reach you.',
    bestFor:
      'Sole traders and new businesses who need a credible presence quickly.',
    includes: [
      'Up to 3 pages',
      'Mobile responsive',
      'Contact form',
      'Basic SEO setup',
      '1 revision round',
    ],
    timeline: 'Approximately 5–7 working days',
    enquiryParam: 'basic',
    cta: 'Choose Basic',
  },
  {
    slug: 'standard',
    name: 'Standard',
    price: 299,
    badge: 'Most popular',
    summary:
      'Room to explain each of your services properly, with analytics so you can see what visitors do.',
    bestFor:
      'Established businesses with a few distinct services or locations to cover.',
    includes: [
      'Everything in Basic',
      'Up to 5 pages',
      'Analytics setup',
      'Google Business link or integration, where applicable',
      '2 revision rounds',
    ],
    timeline: 'Approximately 7–10 working days',
    enquiryParam: 'standard',
    cta: 'Choose Standard',
  },
  {
    slug: 'advanced',
    name: 'Advanced',
    price: 399,
    freeAdvancedMonth: true,
    summary:
      'A larger site, with the option of a third-party booking tool connected where that suits how you work.',
    bestFor:
      'Businesses taking bookings or enquiries regularly, or with more to say.',
    includes: [
      'Everything in Standard',
      'Up to 8 pages',
      'One standard third-party booking integration, where compatible and appropriate',
      '3 revision rounds',
      `1 complimentary month of Advanced Management, worth £${ADVANCED_MANAGEMENT_PRICE}`,
    ],
    timeline: 'Approximately 10–15 working days',
    enquiryParam: 'advanced-build',
    cta: 'Choose Advanced',
    note: 'The booking integration means connecting or embedding a suitable booking service you already use, or one we pick together. Building a booking system from scratch — complex availability rules, custom payment flows, customer accounts or automated booking workflows — is a bigger job, so that gets scoped and quoted separately.',
  },
  {
    slug: 'custom',
    name: 'Custom',
    price: 499,
    variable: true,
    freeAdvancedMonth: true,
    summary:
      'For projects that do not fit a package. We agree the requirements and scope together, and the price is quoted from that.',
    bestFor:
      'Businesses whose requirements do not fit one of the fixed packages.',
    includes: [
      'Requirements and scope agreed individually',
      'No fixed page cap',
      'Revision allowance agreed in the project quote',
      `1 complimentary month of Advanced Management, worth £${ADVANCED_MANAGEMENT_PRICE}`,
    ],
    timeline: 'Agreed individually in your written quote',
    enquiryParam: 'custom',
    cta: 'Discuss a Custom Build',
    note: '£499 is where a custom project starts, not what every custom project costs. Substantial functionality — user accounts, databases, payments, customer portals, ecommerce and the like — is not included in that starting price. Anything of that kind is scoped and quoted separately before any work begins.',
  },
]

export type ManagementPlan = {
  slug: string
  name: string
  price: number
  summary: string
  /**
   * The benefits of the plan. Change time is deliberately NOT listed here — a
   * plan is looking after the site, not a block of hours sold by the month.
   * It goes in `changeTime`, rendered below the benefits.
   */
  includes: string[]
  changeTime: string
  /** See BuildPackage.enquiryParam. */
  enquiryParam: string
  /** Label for the card's call to action. */
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
    cta: 'Choose Advanced Management',
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
 * The terms that bound every management plan. Shown wherever plans are, so the
 * limits are as visible as the features.
 */
export const managementTerms = [
  'Unused change time does not roll over from one billing month to the next.',
  'Additional work beyond the included allowance can be quoted separately.',
  'Priority support means Advanced and Complete requests are handled ahead of Essential ones. It is a place in the queue rather than a guaranteed response time.',
  'You can cancel before your next billing date, which stops future renewals. Amounts already charged for the current billing period are not partially refunded if you cancel part-way through it.',
  'If you end a plan, I will set out your options — either continuing hosting separately, where that is available, or transferring the website to another suitable hosting provider.',
  'A management plan is optional. It is not a condition of having a website built.',
]

/** Stated wherever the complimentary month is mentioned. */
export const COMPLIMENTARY_MONTH_TERMS =
  'The complimentary month does not turn into a paid subscription automatically. When it ends, you decide whether to start a paid management plan — if you do nothing, nothing is charged.'

/**
 * The conditions every timeline estimate depends on. Render this wherever a
 * `timeline` is shown; an estimate separated from its conditions reads as a
 * guarantee, which is exactly what these are not.
 */
export const TIMELINE_TERMS =
  'Estimates, not guarantees. The clock starts once the deposit has been received and I have the information, content and assets needed to begin. Delays in content, feedback or approvals can move the completion date.'

/**
 * The practical commercial terms, shown on the services page. Wording here is
 * deliberately bounded — read the constraints at the top of this file before
 * editing any of it.
 */
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
      'Basic — approximately 5–7 working days.',
      'Standard — approximately 7–10 working days.',
      'Advanced — approximately 10–15 working days.',
      'Custom — agreed individually in your written quote.',
      TIMELINE_TERMS,
    ],
  },
  {
    title: 'Revisions and feedback',
    points: [
      'Each package includes a set number of revision rounds — one on Basic, two on Standard, three on Advanced. Custom is agreed in your quote.',
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
      'Professional copywriting, photography, logo or brand design, and paid stock assets are not included in the fixed packages. Anything substantially outside a package can be quoted separately.',
      'Waiting on content is the most common reason a project runs past its estimate.',
    ],
  },
]

/** The steps a project actually runs through, used on the home and approach pages. */
export const process = [
  {
    step: '01',
    title: 'Conversation',
    body: 'A call to work out what the site is for, who it is talking to, and which package fits. No charge and no obligation — and if a smaller package would do the job, that is the one I will point you at.',
  },
  {
    step: '02',
    title: 'Confirmation',
    body: 'You know the price before anything starts, because it is published. For a Custom build, the scope and the final figure are agreed in writing first. A 50% deposit secures the project, and the remaining 50% is payable once the site is complete and approved, before it goes live.',
  },
  {
    step: '03',
    title: 'Design',
    body: 'Structure and layout first, then the visual design, reviewed with you before a line of production code is written. Changing a design is cheap; changing a built site is not.',
  },
  {
    step: '04',
    title: 'Build',
    body: 'Built in the open on a live preview link you can check at any point. Most packages take somewhere between one and three weeks, counted from the deposit and the arrival of your content — an estimate rather than a promise, since it moves if content or feedback is slow.',
  },
  {
    step: '05',
    title: 'Revisions',
    body: 'Your package includes a set number of revision rounds — one on Basic, two on Standard, three on Advanced. A round means you collect your changes, send them over, and I work through them together. Feedback within 10 working days of the preview keeps things moving; later than that and the finish date can shift. I will never take silence as approval.',
  },
  {
    step: '06',
    title: 'Launch',
    body: 'Testing across real devices, then a careful DNS switch — planned in advance so nothing goes dark. Handover comes with documentation you can actually use, and a management plan afterwards is entirely optional.',
  },
]

/** Standards applied to every build — the differentiator, so stated plainly. */
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
