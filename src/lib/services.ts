/**
 * Northbound Web's offer: fixed-price build packages and monthly management
 * plans.
 *
 * These are the real advertised prices, not illustrations. Only the Fully
 * Custom Build is variable ("from £499"), because its final figure depends on
 * requirements. Do not reintroduce "example price" or "starting from" framing
 * around the £199, £299 and £399 packages — they are the advertised prices.
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
  /** Whether the package bundles a free month of Advanced Management. */
  freeAdvancedMonth?: boolean
}

export const buildPackages: BuildPackage[] = [
  {
    slug: 'basic-build',
    name: 'Basic Build',
    price: 199,
    summary:
      'A single, well-built page that tells people who you are, what you do and how to reach you. Enough to look established and be found — without paying for pages you would never fill.',
    bestFor:
      'Sole traders and new businesses who need a credible presence quickly.',
    includes: [
      'One-page website, designed around your business rather than a template',
      'Mobile and tablet layouts, tested on real screen sizes',
      'Enquiry form with spam protection, delivered to your inbox',
      'Core SEO: page titles, descriptions and a sitemap search engines can read',
      'HTTPS, hosting and deployment set up for you',
      'Your code in a repository you own',
    ],
  },
  {
    slug: 'standard-build',
    name: 'Standard Build',
    price: 299,
    badge: 'Most popular',
    summary:
      'The size of site most small businesses actually need: room to explain each service properly, build trust, and give search engines something to rank.',
    bestFor:
      'Established businesses with a few distinct services or locations to cover.',
    includes: [
      'Everything in the Basic Build',
      'Up to five pages',
      'A page per service or product, so each one can rank on its own',
      'Google Business Profile and local SEO groundwork',
      'Analytics, so you can see what visitors actually do',
      'A copy review across every page before launch',
    ],
  },
  {
    slug: 'advanced-build',
    name: 'Advanced Build',
    price: 399,
    freeAdvancedMonth: true,
    summary:
      'A larger site with something working behind it — online booking, enquiry routing, or a connection to a tool you already use. For businesses whose website has a job to do beyond looking right.',
    bestFor:
      'Businesses taking bookings or enquiries at volume, or with a lot to say.',
    includes: [
      'Everything in the Standard Build',
      'Up to ten pages',
      'Online booking, enquiry routing or a straightforward integration',
      'Structured data, so search results show more than a blue link',
      'A dedicated performance and accessibility pass before launch',
      `One month of Advanced Management included free, worth £${ADVANCED_MANAGEMENT_PRICE}`,
    ],
  },
  {
    slug: 'fully-custom-build',
    name: 'Fully Custom Build',
    price: 499,
    variable: true,
    freeAdvancedMonth: true,
    summary:
      'When a website is not enough — customer portals, booking systems, dashboards, internal tools. Software with accounts, data and rules, built on the same foundations as everything else here.',
    bestFor:
      'Businesses running something important on spreadsheets, email threads or paper.',
    includes: [
      'Everything in the Advanced Build',
      'Customer accounts, portals, dashboards or internal tools',
      'A database designed for the job, with access rules enforced server-side',
      'Payments, email and third-party integrations where the workflow needs them',
      'Built and delivered in stages, so you see it working as it goes',
      `One month of Advanced Management included free, worth £${ADVANCED_MANAGEMENT_PRICE}`,
    ],
  },
]

export type ManagementPlan = {
  slug: string
  name: string
  price: number
  /** True where the price is a floor rather than a single advertised figure. */
  variable?: boolean
  summary: string
  includes: string[]
}

export const managementPlans: ManagementPlan[] = [
  {
    slug: 'website-management',
    name: 'Website Management',
    price: 39,
    variable: true,
    summary:
      'The essentials, so the site stays fast, secure and online instead of quietly rotting.',
    includes: [
      'Hosting and deployment managed for you',
      'Security and dependency updates applied',
      'Uptime monitoring and regular backups',
      'Small content and copy changes each month',
      'Cancel whenever — the code stays yours regardless',
    ],
  },
  {
    slug: 'advanced-management',
    name: 'Advanced Management',
    price: ADVANCED_MANAGEMENT_PRICE,
    summary:
      'More change time each month, plus active monitoring — so problems get found by me rather than by your customers.',
    includes: [
      'Everything in Website Management',
      'More change time each month for updates and new sections',
      'Error monitoring, with fixes included rather than billed',
      'A monthly performance and SEO check',
      'Priority response on working days',
    ],
  },
  {
    slug: 'complete-management',
    name: 'Complete Management',
    price: 149,
    summary:
      'The website treated as an ongoing part of the business, improved deliberately rather than only when something breaks.',
    includes: [
      'Everything in Advanced Management',
      'Ongoing content, page and copy updates',
      'Improvements planned with you each quarter',
      'Analytics reporting in plain English',
      'Same-day response on working days',
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
    body: 'You know the price before anything starts, because it is published. For a Fully Custom Build, the final figure is confirmed in writing once the requirements are clear.',
  },
  {
    step: '03',
    title: 'Design',
    body: 'Structure and layout first, then the visual design, reviewed with you before a line of production code is written. Changing a design is cheap; changing a built site is not.',
  },
  {
    step: '04',
    title: 'Build',
    body: 'Built in the open on a live preview link you can check at any point. You see progress as it happens rather than a reveal at the end.',
  },
  {
    step: '05',
    title: 'Launch',
    body: 'Testing across real devices, performance and accessibility checks, analytics and monitoring connected, then a careful DNS switch — planned in advance so nothing goes dark.',
  },
  {
    step: '06',
    title: 'Aftercare',
    body: 'Handover with documentation you can actually use. Then either you take it from there, or a management plan keeps it maintained and monitored.',
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
    body: 'Secrets stay server-side and never reach the browser. Forms validate on the server, not just in the page. Databases enforce access rules at the row level rather than trusting the front end to behave.',
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
    body: 'Errors and downtime are reported automatically. Problems get found by monitoring rather than by a customer emailing to say your contact form has been broken for a fortnight.',
  },
]
