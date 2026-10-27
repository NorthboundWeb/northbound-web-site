/**
 * The Discover page's content: four before-and-after website comparisons and
 * one build-method comparison.
 *
 * Every business here is invented, and the page says so beside each one. They
 * exist to show the kind of change a rebuild makes, not to claim a client.
 * Keep it that way: no real names, no testimonials, no invented traffic or
 * revenue numbers. The facts quoted under each comparison are measurable
 * properties of the mock-ups themselves (load weight, tap-target size,
 * contrast ratio), not outcomes.
 */

export type Comparison = {
  slug: string
  business: string
  trade: string
  /** One line on who they are, written as the visitor would recognise them. */
  who: string
  /** The one sentence that sums up what was wrong. */
  problem: string
  changes: { title: string; detail: string }[]
  /** Measured properties of the before and after mock-ups. */
  facts: { label: string; before: string; after: string }[]
  /** Visual recipe for the mock-ups — drawn in CSS, no images. */
  before: MockBefore
  after: MockAfter
}

export type MockBefore = {
  style: 'table-2009' | 'template-2016' | 'builder-generic' | 'facebook-only'
  title: string
  tagline: string
  nav: string[]
  body: string
  phone: string
}

export type MockAfter = {
  /** The wordmark in the mock's header. */
  name: string
  bg: string
  ink: string
  accent: string
  onAccent: string
  soft: string
  kicker: string
  headline: string
  sub: string
  ctaA: string
  ctaB: string
  tiles: [string, string][]
  strip: string
  phone: string
}

export const comparisons: Comparison[] = [
  {
    slug: 'heating',
    business: 'Thornley Heating',
    trade: 'Heating engineer',
    who: 'A one-van heating engineer whose site was built by a nephew in 2009 and has not been touched since.',
    problem:
      'The number is in a table cell, the page says "under construction", and on a phone you have to pinch to read anything.',
    changes: [
      { title: 'The number became a button', detail: 'Top right on every page, and it rings when tapped.' },
      { title: 'A price where it can be seen', detail: '"Repairs from £85" on the home page, agreed before any work starts.' },
      { title: 'One headline, two actions', detail: '"Boiler down?" then Book a visit or Get a price. Nothing else competing.' },
      { title: 'Secure and quick', detail: 'A padlock in the address bar and a page that loads before the kettle boils.' },
    ],
    facts: [
      { label: 'Page weight', before: '4.8 MB', after: '210 KB' },
      { label: 'Smallest tap target', before: '11 px link', after: '48 px button' },
      { label: 'Body text contrast', before: '2.9 : 1', after: '12.6 : 1' },
      { label: 'Readable on a phone', before: 'Pinch to zoom', after: 'Yes' },
    ],
    before: {
      style: 'table-2009',
      title: 'THORNLEY PLUMBING & HEATING LTD',
      tagline: '~ Quality Work At Affordable Prices ~',
      nav: ['Home', 'About Us', 'Services', 'Gallery', 'Contact Us'],
      body: 'We are a family run buisness serving the area for many years. No job to big or to small!! Please phone us for a quote.',
      phone: 'Tel: 0113 496 0123',
    },
    after: {
      name: 'Thornley', bg: '#ffffff', ink: '#0c1f3f', accent: '#d7261e', onAccent: '#ffffff', soft: '#f0f3f7',
      kicker: 'Boiler down?',
      headline: "We'll have you warm again today.",
      sub: 'Heating engineers covering the county. A fixed price before any work starts.',
      ctaA: 'Book a visit', ctaB: 'Get a price',
      tiles: [['Repairs', 'Same day'], ['Servicing', 'From £70'], ['New boilers', 'Free survey']],
      strip: 'Same-day callouts · Mon–Sat 8am–6pm',
      phone: '0113 496 0123',
    },
  },
  {
    slug: 'bakery',
    business: 'Saltmarsh Bakehouse',
    trade: 'Bakery and café',
    who: 'A village bakery with a queue out the door on Saturdays and a website nobody can find the opening hours on.',
    problem:
      'A 2016 template with a full-screen slideshow, a "Welcome" paragraph, and the opening times three clicks deep.',
    changes: [
      { title: 'Opening hours on the first screen', detail: 'Today’s hours and whether they are open right now, before anything else.' },
      { title: 'The menu is a page, not a PDF', detail: 'Readable on a phone, searchable by Google, updated in minutes.' },
      { title: 'Order ahead', detail: 'Collection orders through the site, confirmed by email, no phone tag.' },
      { title: 'Photos that load', detail: 'A handful of real photos, sized properly, instead of a slideshow that stalls.' },
    ],
    facts: [
      { label: 'Page weight', before: '11.2 MB', after: '340 KB' },
      { label: 'Clicks to opening hours', before: '3', after: '0' },
      { label: 'Menu format', before: 'Scanned PDF', after: 'Live page' },
      { label: 'Largest image', before: '3.1 MB', after: '82 KB' },
    ],
    before: {
      style: 'template-2016',
      title: 'Saltmarsh Bakehouse',
      tagline: 'Welcome to our website',
      nav: ['Home', 'About', 'Gallery', 'Menu (PDF)', 'Contact'],
      body: 'Welcome to Saltmarsh Bakehouse! We are passionate about baking and pride ourselves on our delicious range of artisan breads, cakes and pastries. Please browse our site to find out more.',
      phone: 'Click here for opening times',
    },
    after: {
      name: 'Saltmarsh', bg: '#1f3d2b', ink: '#f6e7b4', accent: '#f2c94c', onAccent: '#1f3d2b', soft: '#2a4d38',
      kicker: 'Open today 7am – 3pm',
      headline: 'Bread worth the queue.',
      sub: 'Baked before dawn, every day. Order ahead and skip the Saturday line.',
      ctaA: 'Order ahead', ctaB: 'See the menu',
      tiles: [['Breakfast', 'From 7am'], ['Lunch', 'Till 3pm'], ['Cakes', 'Order for events']],
      strip: 'Tuesday to Sunday · Closed Mondays',
      phone: 'Order ahead',
    },
  },
  {
    slug: 'lashes',
    business: 'Kestrel Lash Studio',
    trade: 'Lash and brow technician',
    who: 'A mobile lash tech who runs the whole business from Instagram DMs and a link-in-bio page.',
    problem:
      'There is no website. Booking means messaging back and forth about times, and Google has never heard of her.',
    changes: [
      { title: 'Bookings without the back-and-forth', detail: 'Pick a treatment, pick a time, pay a deposit. Reminders go out automatically.' },
      { title: 'Found on Google', detail: 'A real page for "lash extensions" and her town, plus a Google Business Profile.' },
      { title: 'Prices and policies, written down', detail: 'Deposit, cancellation and patch-test rules on the page, so nobody is surprised.' },
      { title: 'Instagram still does its job', detail: 'The feed is embedded. It drives people to the site; the site takes the booking.' },
    ],
    facts: [
      { label: 'Steps to book', before: '6+ messages', after: '3 taps' },
      { label: 'Deposit taken', before: 'By bank transfer, sometimes', after: 'Every booking' },
      { label: 'No-show reminders', before: 'None', after: '24h and 2h before' },
      { label: 'Appears on Google', before: 'No', after: 'Yes' },
    ],
    before: {
      style: 'facebook-only',
      title: 'kestrel.lash.studio',
      tagline: 'DM to book 💅 · Lashes · Brows',
      nav: ['Posts', 'Reels', 'Tagged'],
      body: 'Hi hun! Yes I have space Thursday, what time were you thinking? x',
      phone: 'Message',
    },
    after: {
      name: 'Kestrel', bg: '#fff6f7', ink: '#3b1730', accent: '#b4235a', onAccent: '#ffffff', soft: '#f7e3e8',
      kicker: 'Lashes · Brows · Mobile',
      headline: 'Book in seconds. Not in DMs.',
      sub: 'Classic and volume lashes, brow shaping and tinting. Pick a time that suits you.',
      ctaA: 'Book now', ctaB: 'Prices',
      tiles: [['Classic', 'From £45'], ['Volume', 'From £60'], ['Brows', 'From £18']],
      strip: 'Deposit secures your slot · Free reschedule up to 24h before',
      phone: 'Book now',
    },
  },
  {
    slug: 'grooming',
    business: 'Bramble & Bone',
    trade: 'Dog groomer',
    who: 'A two-groomer salon on a builder-made site that looks like every other builder-made site.',
    problem:
      'Generic stock photos of dogs that are not theirs, a "Services" page with no prices, and a contact form that goes to a dead inbox.',
    changes: [
      { title: 'Their dogs, their salon', detail: 'Photos from the shop, not a stock library. People recognise the place.' },
      { title: 'Prices by size, up front', detail: 'Small, medium, large, and what a full groom includes.' },
      { title: 'Two groomers, one calendar', detail: 'Book with either groomer, with reminders and a card on file for no-shows.' },
      { title: 'A form that actually arrives', detail: 'Enquiries go to the right inbox, with a copy to the customer.' },
    ],
    facts: [
      { label: 'Stock photos', before: '9', after: '0' },
      { label: 'Prices shown', before: 'None', after: 'By size and service' },
      { label: 'Form delivery', before: 'Lost', after: 'Confirmed both ways' },
      { label: 'Page weight', before: '6.3 MB', after: '290 KB' },
    ],
    before: {
      style: 'builder-generic',
      title: 'Bramble & Bone',
      tagline: 'Professional Dog Grooming Services',
      nav: ['Home', 'Services', 'About', 'Gallery', 'Contact'],
      body: 'We offer a wide range of professional grooming services for dogs of all breeds and sizes. Our experienced team is dedicated to providing the highest quality care. Contact us today!',
      phone: 'Contact Us',
    },
    after: {
      name: 'Bramble & Bone', bg: '#f4fbfa', ink: '#0b3b38', accent: '#0f766e', onAccent: '#ffffff', soft: '#d9f0ec',
      kicker: 'Dog grooming · Two groomers',
      headline: 'Clean dog. Happy dog.',
      sub: 'Full grooms, baths and nails. Prices by size, booked online with either groomer.',
      ctaA: 'Book a groom', ctaB: 'See prices',
      tiles: [['Small', 'From £32'], ['Medium', 'From £40'], ['Large', 'From £52']],
      strip: 'Tuesday to Saturday · Collection reminders by text',
      phone: 'Book a groom',
    },
  },
]

/**
 * How the three usual ways of getting a website compare. Written to be fair:
 * the builder column is cheap and quick, and says so. The point is to make the
 * trade-offs visible, not to pretend the alternatives have no merits.
 */
export type MethodRow = {
  label: string
  builder: string
  agency: string
  northbound: string
  /** Which column comes out best on this row; drives a subtle highlight. */
  best?: 'builder' | 'agency' | 'northbound'
}

export const methods: MethodRow[] = [
  { label: 'Up-front cost', builder: 'Free – £20/month', agency: '£2,000 – £10,000+', northbound: '£249 – £349 fixed', best: 'builder' },
  { label: 'Time to live', builder: 'An afternoon', agency: '6 – 12 weeks', northbound: '7 – 15 working days', best: 'builder' },
  { label: 'Who does the work', builder: 'You do', agency: 'A team, through an account manager', northbound: 'One developer, directly', best: 'northbound' },
  { label: 'Designed for your business', builder: 'A template, adjusted', agency: 'Yes', northbound: 'Yes', best: 'agency' },
  { label: 'Speed on a phone', builder: 'Often slow — heavy scripts', agency: 'Varies', northbound: 'Pre-rendered, served from the edge', best: 'northbound' },
  { label: 'You own it', builder: 'No — it lives on their platform', agency: 'Usually', northbound: 'Yes — code, domain and all', best: 'northbound' },
  { label: 'Can you move it later', builder: 'Not without rebuilding', agency: 'Usually', northbound: 'Yes — hand over the repo', best: 'northbound' },
  { label: 'Looked after afterwards', builder: 'Up to you', agency: 'Retainer, often £300+/month', northbound: 'From £39/month, first month free', best: 'northbound' },
]

/**
 * The three gantries on /discover: three ways to get a website, compared on
 * the same four signs. The template and agency rows are typical market
 * ranges, not quotes; the template gets its due where it wins.
 */
export type Route = {
  key: 'template' | 'agency' | 'northbound'
  code: string
  /** Sign colour: blue for the template, green for the agency, black and amber for Northbound. */
  tone: 'blue' | 'green' | 'nb'
  title: string
  sub: string
  speed: string
  speedNote: string
  design: string
  designNote: string
  features: string
  featuresNote: string
  price: string
  priceUnit: string
  priceNote: string
  bestWhen: string
}

export const routes: Route[] = [
  {
    key: 'template',
    code: 'A1',
    tone: 'blue',
    title: 'A template site',
    sub: 'Wix, Squarespace, GoDaddy and the like. You build it on a Sunday afternoon.',
    speed: '4–8 s',
    speedNote: 'Typical load on 4G. Builders ship every feature they offer whether you use it or not, so the page is heavy before you add a photo.',
    design: 'A theme',
    designNote: 'Chosen from a few hundred. Looks fine; looks like the other businesses that chose it. Spacing and type are whatever the theme set.',
    features: 'Bolt-on',
    featuresNote: 'Forms and bookings come from an app store, each with its own monthly fee and its own login. Local SEO is a checklist you follow yourself.',
    price: '£0–£25',
    priceUnit: '/month',
    priceNote: 'For as long as you keep it. Cancel and the site goes with it — it only exists on their platform. Your time is the real cost.',
    bestWhen: 'you need a page up today and the site is a placeholder, not how people find and book you.',
  },
  {
    key: 'agency',
    code: 'A2',
    tone: 'green',
    title: 'An agency site',
    sub: 'A studio with a team: strategist, designer, developer, account manager.',
    speed: '2–4 s',
    speedNote: 'Varies with the stack. Good agencies build fast sites; plenty hand over a heavy WordPress theme with twenty plugins.',
    design: 'Bespoke',
    designNote: 'Designed for you, properly, with research and revisions — and rightly so at the price. Brand work is often part of the package.',
    features: 'Scoped',
    featuresNote: 'Anything you can specify, quoted line by line. Changes after sign-off go through change requests and the account manager.',
    price: '£2k–£10k+',
    priceUnit: '',
    priceNote: 'Plus a retainer, commonly £300 a month or more, for hosting and updates. Six to twelve weeks from kick-off is typical.',
    bestWhen: 'you have a brand team, a five-figure budget and a project that genuinely needs five specialists.',
  },
  {
    key: 'northbound',
    code: 'NB',
    tone: 'nb',
    title: 'A Northbound site',
    sub: 'One developer, working directly with you, at a fixed published price.',
    speed: '~1 s',
    speedNote: 'Typical load on 4G. Pages are built ahead of time and served from a network near your visitor, so there is very little to wait for. Speed is a design constraint, not a fix at the end.',
    design: 'Yours',
    designNote: 'Designed around your trade and your customers, on a phone first. No theme underneath it, so it does not look like the shop two doors down.',
    features: 'Set up',
    featuresNote: 'Booking is set up for you on an established booking service as part of the build. Pro covers one staff calendar; Ultimate runs a whole team, with reminders and payments, and adds local SEO.',
    price: '£249–£349',
    priceUnit: 'fixed',
    priceNote: 'Half to start, and half once it is approved, before it goes live. You own the code, the domain and the content. Custom work starts from £349 and is quoted first.',
    bestWhen: 'you want it designed for your business, fast on a phone, owned outright and looked after — without the agency price or the DIY weekends.',
  },
]

/** The "which one fits" strip under the gantries. */
export const fits = [
  {
    title: 'Pick the template if',
    body: 'You need something today, you enjoy tinkering, and the site is a placeholder rather than how people find and book you.',
  },
  {
    title: 'Pick the agency if',
    body: 'You have a brand team, a budget in the thousands, and a project that genuinely needs five specialists and a project manager.',
  },
  {
    title: 'Pick Northbound if',
    body: 'You want it designed for your business, fast on a phone, owned outright, and looked after — without the agency price or the DIY weekends.',
  },
]
