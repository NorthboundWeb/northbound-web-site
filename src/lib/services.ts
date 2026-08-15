/**
 * Services and example pricing.
 *
 * PLACEHOLDER PRICING: every `fromPrice` below is an illustrative figure, not a
 * committed rate. They exist so visitors can self-qualify before enquiring.
 * Review them against your own costs before launch — and note the site says
 * everywhere that the real number comes from a quote, so changing these does
 * not contradict anything else on the page.
 */

export type Service = {
  slug: string
  title: string
  summary: string
  /** Illustrative starting price in GBP. */
  fromPrice: number
  /** How the fee is usually structured, shown next to the price. */
  priceNote: string
  includes: string[]
  bestFor: string
}

export const services: Service[] = [
  {
    slug: 'business-website',
    title: 'Business website',
    summary:
      'The site most small businesses actually need: a handful of well-written pages that explain what you do, prove you can be trusted with it, and make getting in touch easy.',
    fromPrice: 1200,
    priceNote: 'one-off project fee',
    bestFor: 'Established businesses whose current site is dated, slow, or costing them enquiries.',
    includes: [
      'Up to around six pages, designed rather than dropped into a template',
      'Written to your audience, not stuffed with keywords',
      'Enquiry form with spam protection, delivered to your inbox',
      'Mobile-first layout tested on real screen sizes',
      'SEO fundamentals, metadata and structured data',
      'Analytics so you can see what visitors actually do',
    ],
  },
  {
    slug: 'landing-page',
    title: 'Landing page',
    summary:
      'A single page built around one action — book a call, request a quote, buy a thing. Useful when you are running ads or launching something and need a page that converts.',
    fromPrice: 600,
    priceNote: 'one-off project fee',
    bestFor: 'Campaigns, launches and paid traffic that needs somewhere sharp to land.',
    includes: [
      'One page, one goal, no competing navigation',
      'Copy structured around objections and proof',
      'Fast load — the thing that quietly kills ad performance',
      'Conversion tracking wired up from day one',
      'A/B-friendly structure if you want to test later',
    ],
  },
  {
    slug: 'redesign',
    title: 'Redesign and rebuild',
    summary:
      'Your business has moved on and the website has not. A rebuild keeps what is working — your traffic, your rankings, your content — and replaces the parts that are holding you back.',
    fromPrice: 1800,
    priceNote: 'one-off project fee',
    bestFor: 'Sites that still bring in business but embarrass you when you send the link.',
    includes: [
      'Audit of what is currently working and worth keeping',
      'Redirect mapping so existing search rankings survive the move',
      'New design and front end, built on modern foundations',
      'Content migrated and tidied rather than dumped across',
      'Performance and accessibility brought up to standard',
    ],
  },
  {
    slug: 'web-application',
    title: 'Web application',
    summary:
      'When a website is not enough — customer portals, booking systems, dashboards, internal tools. Software with accounts, data and rules, built on the same stack as everything else here.',
    fromPrice: 4000,
    priceNote: 'quoted per project, usually staged',
    bestFor: 'Businesses running something important on spreadsheets, email threads or paper.',
    includes: [
      'Discovery first — the wrong build is the expensive one',
      'Secure accounts and permissions, designed to the data you hold',
      'Database designed for the job, with access controls enforced server-side',
      'Payments, email and integrations where the workflow needs them',
      'Delivered in stages so you see it working as it is built',
    ],
  },
  {
    slug: 'automation',
    title: 'Automations and integrations',
    summary:
      'Connect the tools you already pay for so information stops being retyped. Enquiries into your CRM, payments into your accounts, updates into the places your team actually looks.',
    fromPrice: 450,
    priceNote: 'per automation, depending on the systems involved',
    bestFor: 'Any job someone on your team does every week by copying and pasting.',
    includes: [
      'A look at where time is genuinely going before anything is built',
      'Connections between the systems you already use',
      'Error handling, so a silent failure does not lose you work',
      'Documented, so it is not a black box only I understand',
    ],
  },
  {
    slug: 'care-plan',
    title: 'Website care plan',
    summary:
      'Ongoing management, so the site stays fast, secure and current instead of quietly rotting. Hosting, updates, monitoring, backups and a set amount of change time each month.',
    fromPrice: 45,
    priceNote: 'per month, rolling',
    bestFor: 'Anyone who does not want to think about their website until they need something changed.',
    includes: [
      'Hosting and deployment managed for you',
      'Dependency and security updates applied',
      'Uptime and error monitoring, so I usually know before you do',
      'Backups and version history for every change',
      'Content and copy changes included each month',
      'Cancel whenever — no lock-in, and the code is yours regardless',
    ],
  },
]

/** The steps a project actually runs through, used on the home and approach pages. */
export const process = [
  {
    step: '01',
    title: 'Conversation',
    body: 'A call to work out what the site is for, who it is talking to, and what would count as it working. No charge, no obligation, and no proposal written before I understand the business.',
  },
  {
    step: '02',
    title: 'Quote',
    body: 'A written proposal with fixed scope and a fixed price, so you know the number before anything starts. If there is a cheaper way to get you what you need, that is what I will quote for.',
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
    body: 'Handover with documentation you can actually use. Then either you take it from there, or a care plan keeps it maintained and monitored.',
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
