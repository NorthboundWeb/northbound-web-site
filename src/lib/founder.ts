/**
 * The founder story on /about.
 *
 * Copy is supplied and approved — do not rewrite it, and do not add biography
 * that has not been confirmed. Specifically: no full name, no qualifications,
 * no client or project totals, no town or city. If any of those are wanted on
 * the page later, they have to come from the owner, not from inference.
 */
export const founderStory = {
  heading: 'Built from a problem I faced myself.',
  lede: 'I founded Northbound to help businesses build a strong online presence without the usual cost, confusion or technical barriers.',
  body: [
    'As the internet continues to expand, an online presence has become a key part of almost every successful business. It shapes how people discover a company, judge its credibility and decide whether to become a customer.',
    'My journey began when I was 17 and trying to launch my first online retail venture. The idea was to create a commercial network where shoppers and independent shop owners could interact and improve the online shopping experience.',
    'I was excited about the idea, but I quickly hit a wall when it came to building the website. I tried Wix, Shopify and several other website builders because I wanted to create it myself. None of them gave me the flexibility or functionality the idea needed.',
    'When I started looking for someone to build it professionally, the prices were far beyond what I could afford. As a 17-year-old entrepreneur, spending more than £1,000 on even a basic website simply wasn’t realistic. Eventually, I had to put the idea aside.',
    'That experience became the reason Northbound exists.',
    'I wanted to create the service I had needed: professionally built websites at realistic prices, with clear guidance and someone available to handle the technical side.',
    'As I began learning about website development, I discovered how much more goes into building an effective online presence—from user experience and search engine optimisation to website management, automation and AI task delegation.',
    'Today, Northbound brings those areas together to help businesses establish themselves online, reach more people and build something capable of growing with them.',
  ],
} as const

/**
 * A genuine founder photograph, when one exists.
 *
 * Deliberately null. The page is designed to read as finished without it — a
 * stock portrait or a generated face would be a lie about who runs the
 * business, and an empty grey box looks broken. To add a real photograph, drop
 * the file in /public and fill this in; the layout picks it up.
 */
export const founderPhoto: { src: string; alt: string; width: number; height: number } | null =
  null

/** Why Northbound exists, stated as commitments rather than claims. */
export const purpose = [
  {
    title: 'A price you can actually plan around',
    body: 'Package prices are published, and they are what you pay. The only variable build is Custom, and its figure is agreed in writing before anything starts.',
  },
  {
    title: 'No technical barrier to entry',
    body: 'Hosting, domains, deployment, updates and the parts that go wrong at 11pm are handled. You should not need to learn any of it to have a website that works.',
  },
  {
    title: 'Built to grow with the business',
    body: 'Every project is a real codebase in a repository you own, not a page builder you are locked into. It can be extended, handed over, or taken elsewhere.',
  },
]
