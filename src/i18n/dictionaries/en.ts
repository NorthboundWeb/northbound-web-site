/**
 * English — the source of truth for every translatable string on the site.
 *
 * This object's SHAPE is the contract: `Dictionary` is derived from it, so
 * every other locale is type-checked against it and a missing or misspelled
 * key is a build error rather than a blank space on a live page.
 *
 * What does NOT belong here: prices (they live in services.ts as pence),
 * slugs, query params, and product or brand names. "Starter", "Pro
 * Management", "Scout", "Northbound" and "Northbound.AI" stay identical in
 * every language on purpose — they are names, not words.
 *
 * Translations of the legal notice are a convenience for reading. The English
 * text is the operative one, and every locale says so on the page.
 */
export const en = {
  meta: {
    /** Reads "English" in its own language — see LOCALE_META. */
    languageName: 'English',
  },

  common: {
    skipToContent: 'Skip to content',
    home: 'home',
    nav: {
      web: 'Web Services',
      ai: 'AI Employees',
      work: 'Our Work',
      about: 'About',
      contact: 'Contact',
    },
    cta: {
      letsTalk: 'Let’s talk',
      startProject: 'Start a project',
      seePackages: 'See website packages',
      getInTouch: 'Get in touch',
      registerInterest: 'Register interest',
      learnMore: 'Learn more about us',
      viewWork: 'View our work',
      askToSee: 'Ask to see examples',
      discussProject: 'Discuss a project',
      talkToNorthbound: 'Talk to Northbound',
      meetEmployees: 'Meet the employees',
      exploreComing: 'Explore what’s coming',
      exploreWeb: 'Explore web services',
    },
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    comingSoon: 'Coming soon',
    inDevelopment: 'In development',
    language: 'Language',
    currency: 'Currency',
    approx: 'approx.',
    availableNow: 'Available now',
    from: 'From',
    perMonth: '/month',
  },

  footer: {
    blurb: 'Digital infrastructure for modern businesses. Web services now, AI employees coming soon.',
    columns: {
      web: 'Northbound.Web',
      ai: 'Northbound.AI',
      company: 'Company',
      talk: 'Let’s talk',
    },
    links: {
      webServices: 'Web services',
      ourWork: 'Our work',
      packages: 'Website packages',
      management: 'Management',
      improvements: 'Improvements',
      aiEmployees: 'AI employees',
      meetEmployees: 'Meet the employees',
      howItWorks: 'How it will work',
      registerInterest: 'Register interest',
      about: 'About us',
      process: 'Our process',
      contact: 'Contact',
      privacy: 'Privacy',
    },
    talkBlurb: 'Have a project, or want to know more about what Northbound is building?',
    rights: 'All rights reserved.',
    builtIn: 'Built and hosted in the United Kingdom',
  },

  home: {
    metaTitle: 'Digital infrastructure for modern businesses',
    eyebrow: 'Welcome to Northbound',
    h1Line1: 'Digital infrastructure',
    h1Line2: 'for modern businesses',
    /** {price} is substituted with the formatted entry price. */
    lede: 'Northbound builds, hosts and manages websites for small businesses. Fixed prices from {price}, and none of the technical side lands on you.',
    aiNote: 'AI employees that work for your business are coming soon.',
    aiNoteLink: 'See what’s coming',
    credentials: [
      { label: 'Based in', value: 'The UK' },
      { label: 'Built for', value: 'Small business' },
      { label: 'Focused on', value: 'Results' },
    ],
    divisions: {
      webHeadline: 'Websites that grow your business.',
      webBody: 'One-off website builds, ongoing management and continuous improvements.',
      aiHeadline: 'Employees that work for your business.',
      aiBody: 'AI-powered employees designed to save time, take repetitive work off your hands and help businesses operate more effectively.',
    },
    signature: 'Northbound. Built to last.',
    whatWeDo: 'What we do',
    twoDivisionsLine1: 'Two divisions.',
    twoDivisionsLine2: 'One Northbound.',
    twoDivisionsBody1: 'Northbound.Web builds and manages the digital infrastructure a business runs on — the site, the hosting, the upkeep and the improvements that follow.',
    twoDivisionsBody2: 'Northbound.AI will provide digital employees designed to help businesses operate, grow and save time. That side is still being built, and it is marked as such everywhere on this site.',
    pillars: {
      web: { title: 'Web services', body: 'Strategy, design, build and management for websites that perform.' },
      ai: { title: 'AI employees', body: 'Digital employees designed to handle the work, so you can focus on what matters.' },
      growth: { title: 'Growth focused', body: 'Built around real outcomes, and changed on the strength of what the numbers show.' },
      secure: { title: 'Secure & reliable', body: 'Your data, your business. Secure systems and clear control at every step.' },
    },
    recentWork: 'Recent work',
    workLine1: 'Built for business.',
    workLine2: 'Designed to perform.',
    workMore: 'More projects are added as they go live. Recent client sites can be shared on request — some are under wraps until launch.',
  },

  web: {
    metaTitle: 'Web services',
    metaDescription: 'Fixed-price website builds from £249, and optional monthly management. Fast, accessible, secure sites for UK small businesses — the price you see is the price you pay.',
    eyebrow: 'Northbound.Web',
    h1Line1: 'Websites that grow',
    h1Line2: 'your business',
    lede: 'One-off website builds, ongoing management and continuous improvements. The price is published, the scope is written down, and the site is yours to keep.',
    pricing: {
      eyebrow: 'Website packages',
      h2Line1: 'One-off builds.',
      h2Line2: 'Fixed prices.',
      aside: 'These are the advertised prices, not estimates. Only a Custom build varies, and its scope and figure are agreed in writing first.',
      oneOff: 'One-off build',
      popular: 'Most popular',
      approxNote: 'Amounts in {currency} are an approximate conversion, shown as a guide. Quotes, contracts and payments are agreed and settled in pounds sterling.',
    },
    packages: {
      starter: {
        summary: 'A small, well-built site that tells people who you are, what you do and how to reach you.',
        bestFor: 'Sole traders and new businesses who need a credible presence quickly.',
        includes: ['Up to 3 pages', 'Mobile responsive', 'Contact form', 'Search engine setup', '1 revision round'],
        timeline: 'Approximately 5–7 working days',
        cta: 'Choose Starter',
        note: null,
      },
      advanced: {
        summary: 'Room to explain each of your services properly, with analytics so you can see what visitors do.',
        bestFor: 'Established businesses with a few distinct services or locations to cover.',
        includes: ['Everything in Starter', 'Up to 5 pages', 'Analytics setup', 'Google Business link or integration, where applicable', '2 revision rounds'],
        timeline: 'Approximately 7–10 working days',
        cta: 'Choose Advanced',
        note: null,
      },
      pro: {
        summary: 'A larger site, with the option of a third-party booking tool connected where that suits how you work.',
        bestFor: 'Businesses taking bookings or enquiries regularly, or with more to say.',
        includes: ['Everything in Advanced', 'Up to 8 pages', 'One standard third-party booking integration, where compatible and appropriate', '3 revision rounds', 'One complimentary month of Pro Management, worth £39'],
        timeline: 'Approximately 10–15 working days',
        cta: 'Choose Pro',
        note: 'The booking integration means connecting or embedding a suitable booking service you already use, or one we pick together. Building a booking system from scratch — complex availability rules, custom payment flows, customer accounts or automated booking workflows — is a bigger job, so that gets scoped and quoted separately.',
      },
      custom: {
        summary: 'For projects that do not fit a package. We agree the requirements and scope together, and the price is quoted from that.',
        bestFor: 'Businesses whose requirements do not fit one of the fixed packages.',
        includes: ['Requirements and scope agreed individually', 'No fixed page cap', 'Revision allowance agreed in the project quote', 'One complimentary month of Pro Management, worth £39'],
        timeline: 'Agreed individually in your written quote',
        cta: 'Discuss a Custom build',
        note: '£499 is where a custom project starts, not what every custom project costs. Substantial functionality — user accounts, databases, payments, customer portals, ecommerce and the like — is not included in that starting price. Anything of that kind is scoped and quoted separately before any work begins.',
      },
    },
    management: {
      eyebrow: 'Management',
      h2Line1: 'Looked after',
      h2Line2: 'once it is live.',
      aside: 'Optional, rolling, and never a condition of having a site built.',
      plans: {
        'pro-management': {
          summary: 'Keeps the site online, secure and up to date, with a regular check on how it is actually performing.',
          includes: ['Hosting and technical maintenance', 'Security and dependency maintenance, where applicable', 'Uptime monitoring', 'Analytics and performance checks'],
          changeTime: 'Includes up to 2 hours of requested website updates per billing month.',
          cta: 'Choose Pro Management',
        },
        'ultimate-management': {
          summary: 'Adds a proper review and a written report, and moves your requests up the queue.',
          includes: ['Everything in Pro Management', 'Faster queue priority', 'A monthly performance report'],
          changeTime: 'Includes up to 4 hours of requested website updates per billing month.',
          cta: 'Choose Ultimate Management',
        },
      },
      terms: [
        'Unused change time does not roll over from one billing month to the next.',
        'Additional work beyond the included allowance can be quoted separately.',
        'Faster queue priority means Ultimate requests are handled ahead of Pro ones. It is a place in the queue rather than a guaranteed response time.',
        'You can cancel before your next billing date, which stops future renewals. Amounts already charged for the current billing period are not partially refunded if you cancel part-way through it.',
        'If you end a plan, I will set out your options — either continuing hosting separately, where that is available, or transferring the website to another suitable hosting provider.',
        'A management plan is optional. It is not a condition of having a website built.',
      ],
    },
    improvements: {
      eyebrow: 'Improvements',
      h2Line1: 'Better every',
      h2Line2: 'month.',
      body: 'A site is not finished at launch. Improvement work is part of a management plan rather than a separate product — small, measured changes inside your plan’s included change time.',
      link: 'See management plans',
      items: [
        { title: 'Measured, then changed', body: 'Changes come from what the analytics actually show — which pages people leave, which ones bring enquiries — rather than from redesigning things that are working.' },
        { title: 'Small and continuous', body: 'Copy, layout, page speed and forms, adjusted a piece at a time within your plan’s included change time. No rebuild required to fix something that is underperforming.' },
        { title: 'Reported plainly', body: 'On Ultimate Management you get a simple monthly note on what changed and what it did. No dashboard you have to learn to read.' },
      ],
    },
    standardsEyebrow: 'Standards',
    standardsHeading: 'How every site is built.',
    standardsHeadingAlt: 'The standard, regardless of package.',
    standards: [
      { title: 'Fast by default', body: 'Pages are pre-rendered and served from a global edge network. Performance is a design constraint from the start, not an optimisation pass bolted on at the end when it is too late to fix cheaply.' },
      { title: 'Accessible', body: 'Real semantic HTML, keyboard navigation, sensible contrast and labelled form fields. It is the right thing to do, it is better for search, and in the UK accessibility is increasingly a legal expectation rather than a nice-to-have.' },
      { title: 'Secure', body: 'Secrets stay server-side and never reach the browser. Forms validate on the server, not just in the page. Where a project stores data, access rules are enforced by the database rather than by trusting the front end to behave.' },
      { title: 'Yours to keep', body: 'Every project lives in a Git repository you own, with full history. No proprietary page builder, no hostage situation. If you ever want to take it to another developer, you hand over a repo and they get to work.' },
      { title: 'Privacy-conscious', body: 'Analytics configured to answer business questions without hoovering up personal data. UK GDPR is considered when the system is designed rather than patched in after someone asks about it.' },
      { title: 'Monitored', body: 'Sites are built so that downtime can be spotted by monitoring rather than by a customer emailing to say the contact form has been broken for a fortnight. Uptime monitoring is part of every management plan.' },
    ],
    termsEyebrow: 'Terms',
    termsHeading: 'The practical detail.',
    terms: [
      { title: 'Payment', points: ['A 50% deposit secures your project and allows work to begin.', 'The remaining 50% is payable once the website is complete and approved, before it goes live.'] },
      { title: 'Timescales', points: ['Starter — approximately 5–7 working days.', 'Advanced — approximately 7–10 working days.', 'Pro — approximately 10–15 working days.', 'Custom — agreed individually in your written quote.', 'Estimates, not guarantees. The clock starts once the deposit has been received and I have the information, content and assets needed to begin. Delays in content, feedback or approvals can move the completion date.'] },
      { title: 'Revisions and feedback', points: ['Each package includes a set number of revision rounds — one on Starter, two on Advanced, three on Pro. Custom is agreed in your quote.', 'Please send the feedback for each round within 10 working days of getting the preview link.', 'If it arrives later than that, the project may be paused and the estimated completion date may move.', 'Silence is never treated as approval. If I have not heard from you, I will follow up rather than sign the work off on your behalf.'] },
      { title: 'Domains', points: ['Your domain should be owned and controlled by you.', 'I can help you buy one, configure it, and connect it to your site.', 'Domain registration and renewal charges are separate, unless a written quote says otherwise.'] },
      { title: 'Content and images', points: ['You normally supply your business information, any branding or logo files you have, specific photographs you want used, accurate service or product details, and your contact information.', 'I format and structure what you send, and make reasonable improvements to it as part of the build.', 'Professional copywriting, photography, logo or brand design, and paid stock assets are not included in the fixed packages. Anything substantially outside a package can be quoted separately.', 'Waiting on content is the most common reason a project runs past its estimate.'] },
    ],
    complimentaryTerms: 'The complimentary month does not turn into a paid subscription automatically. When it ends, you decide whether to start a paid management plan — if you do nothing, nothing is charged.',
    timelineTerms: 'Estimates, not guarantees. The clock starts once the deposit has been received and I have the information, content and assets needed to begin. Delays in content, feedback or approvals can move the completion date.',
  },

  ai: {
    metaTitle: 'AI employees',
    metaDescription: 'Northbound Employees are coming soon — AI-powered digital workers designed around actual business jobs. A preview of what is being built, and how to register interest.',
    eyebrow: 'Northbound.AI',
    h1Line1: 'Your next employee',
    h1Line2: 'might not be human',
    statusHeadline: 'Northbound Employees are coming soon.',
    statusBody: 'AI-powered digital workers designed around actual business jobs — not another generic chatbot.',
    teamEyebrow: 'The team',
    teamLine1: 'Meet your',
    teamLine2: 'future team.',
    teamAside: 'Seven workers, each with its own job. None is available to buy or hire yet, and every card says exactly where it stands.',
    forExample: 'For example',
    disclaimer: 'Every employee above is in development. Nothing on this page describes a capability that is available today, and no pricing, integrations or performance figures are published because none have been finalised.',
    employees: {
      scout: { role: 'Lead Finder', problem: 'Finding people worth approaching is slow, and it is the first thing to get dropped when the week gets busy.', benefit: 'You start each week with a list of realistic prospects instead of a blank page.', tasks: ['Search for businesses matching the kind of customer you want', 'Pull together what is publicly known about each one', 'Filter out the ones clearly not worth your time', 'Hand over a shortlist with a reason attached to each name'] },
      audit: { role: 'Opportunity Analyst', problem: 'Most owners suspect something is losing them work online, but not which thing, or what it is costing.', benefit: 'You get a short, ranked list of what to fix first — and why it matters.', tasks: ['Review a website for the problems that lose enquiries', 'Compare how a business shows up against others nearby', 'Flag the pages doing the least work', 'Rank the findings by likely impact rather than by ease'] },
      closer: { role: 'Sales Assistant', problem: 'Enquiries go cold because nobody had ten minutes to follow up on the third day.', benefit: 'Nothing sits unanswered while you are on site or with a customer.', tasks: ['Draft replies to new enquiries for you to check and send', 'Keep track of who is owed a follow-up and when', 'Prepare a summary of the conversation before a call', 'Raise the ones that need a human decision'] },
      forge: { role: 'Web Builder', problem: 'Small website changes queue up for weeks because each one needs a developer.', benefit: 'Routine page and content work stops being a bottleneck.', tasks: ['Build out new pages from an agreed structure', 'Turn supplied copy and images into finished sections', 'Apply consistent changes across many pages at once', 'Prepare the work for review before anything goes live'] },
      keeper: { role: 'Website Manager', problem: 'A site quietly drifts — broken links, stale details, an out-of-date price nobody noticed.', benefit: 'Problems get spotted before a customer runs into them.', tasks: ['Watch for pages that break or stop loading properly', 'Check that contact details, prices and opening hours still match reality', 'Keep a record of what changed and when', 'Report anything that needs a decision rather than a fix'] },
      signal: { role: 'Content and Growth', problem: 'Posting consistently is the first casualty of a full diary, and the gap shows.', benefit: 'The business keeps showing up without you writing everything yourself.', tasks: ['Draft posts and updates in your own tone for approval', 'Keep a schedule moving rather than posting in bursts', 'Suggest topics from what customers actually ask about', 'Summarise what got attention and what did not'] },
      venture: { role: 'Revenue Researcher', problem: 'There is usually money in something the business already does — but finding it means research nobody has time for.', benefit: 'You see options for earning more from what you already have.', tasks: ['Research what comparable businesses charge for', 'Look for services worth adding to the existing offer', 'Estimate what a change would mean in practice', 'Set the options out plainly so you can choose'] },
    },
    director: {
      role: 'Coordination layer',
      summary: 'The part that decides which employee picks up what, keeps them working to the same brief, and puts anything consequential in front of a person before it happens.',
    },
    howItWorks: {
      eyebrow: 'How it will work',
      h2Line1: 'Built around',
      h2Line2: 'the job.',
      body: 'Not another generic chatbot bolted onto a website. The intention is a digital worker that takes on a defined job, inside limits you set, with a person keeping sign-off on anything that matters.',
      steps: [
        { title: 'Pick the job', body: 'You start from a job that needs doing — finding prospects, chasing follow-ups, keeping admin straight — rather than from a piece of technology.' },
        { title: 'Set the boundaries', body: 'An employee is intended to work inside limits you set, on the tasks you agree, with the things that matter kept under your sign-off.' },
        { title: 'Review the work', body: 'The plan is that work comes back for review rather than going out unseen, so you keep control of anything that reaches a customer.' },
      ],
    },
    ctaLine1: 'Want to know when',
    ctaLine2: 'they are ready?',
    ctaBody: 'There is no waitlist system yet, so registering interest sends a normal enquiry — it reaches a person, and you will hear back.',
    registerInterestIn: 'Register interest in {name}',
  },

  work: {
    metaTitle: 'Our work',
    metaDescription: 'Selected Northbound.Web projects. Every piece is labelled for what it actually is — client project, demo, internal work or concept — with no invented case studies.',
    eyebrow: 'Recent work',
    h1Line1: 'Built for business.',
    h1Line2: 'Designed to perform.',
    lede: 'Northbound is a young studio, and this page shows only work that genuinely exists. Every project is labelled for what it is, and nothing here is presented as a client relationship that has not happened.',
    askToSeeMore: 'Ask to see more',
    whatWasBuilt: 'What was built',
    services: 'Services',
    visitSite: 'Visit the site',
    whatYouGet: 'What you get',
    kinds: {
      client: 'Client project',
      demo: 'Demo project',
      internal: 'Internal project',
      concept: 'Concept',
    },
    projects: {
      northbound: {
        category: 'Brand and marketing site',
        brief: 'Northbound’s own site had to carry two divisions at once — a web service that is trading today, and a product line that is still being built — without either one misleading the visitor about what they can buy.',
        built: ['Static-rendered pages served from the edge', 'A single pricing source that every page, link and enquiry option reads from', 'Currency and language selection with GBP kept as the contractual currency', 'Automated link, contrast and duplicate-id checks that run against a real build'],
        services: ['Design', 'Build', 'Management'],
      },
    },
  },

  about: {
    metaTitle: 'About',
    metaDescription: 'Northbound builds and manages websites for UK businesses, and is building Northbound Employees — AI workers designed around real business jobs.',
    eyebrow: 'About Northbound',
    heading: 'Built from a problem I faced myself.',
    lede: 'I founded Northbound to help businesses build a strong online presence without the usual cost, confusion or technical barriers.',
    storyEyebrow: 'The story',
    story: [
      'As the internet continues to expand, an online presence has become a key part of almost every successful business. It shapes how people discover a company, judge its credibility and decide whether to become a customer.',
      'My journey began when I was 17 and trying to launch my first online retail venture. The idea was to create a commercial network where shoppers and independent shop owners could interact and improve the online shopping experience.',
      'I was excited about the idea, but I quickly hit a wall when it came to building the website. I tried Wix, Shopify and several other website builders because I wanted to create it myself. None of them gave me the flexibility or functionality the idea needed.',
      'When I started looking for someone to build it professionally, the prices were far beyond what I could afford. As a 17-year-old entrepreneur, spending more than £1,000 on even a basic website simply wasn’t realistic. Eventually, I had to put the idea aside.',
      'That experience became the reason Northbound exists.',
      'I wanted to create the service I had needed: professionally built websites at realistic prices, with clear guidance and someone available to handle the technical side.',
      'As I began learning about website development, I discovered how much more goes into building an effective online presence—from user experience and search engine optimisation to website management, automation and AI task delegation.',
      'Today, Northbound brings those areas together to help businesses establish themselves online, reach more people and build something capable of growing with them.',
    ],
    pullQuote: 'Spending more than £1,000 on even a basic website simply wasn’t realistic.',
    pullQuoteFooter: 'Why Northbound exists',
    purposeEyebrow: 'What Northbound is for',
    purposeHeading: 'The service I needed.',
    purpose: [
      { title: 'A price you can actually plan around', body: 'Package prices are published, and they are what you pay. The only variable build is Custom, and its figure is agreed in writing before anything starts.' },
      { title: 'No technical barrier to entry', body: 'Hosting, domains, deployment, updates and the parts that go wrong at 11pm are handled. You should not need to learn any of it to have a website that works.' },
      { title: 'Built to grow with the business', body: 'Every project is a real codebase in a repository you own, not a page builder you are locked into. It can be extended, handed over, or taken elsewhere.' },
    ],
    divisionsEyebrow: 'Two divisions',
    divisionsHeading: 'One Northbound.',
    processEyebrow: 'Our process',
    processLine1: 'How a project',
    processLine2: 'actually runs.',
    processAside: 'Six steps, in the order they happen. No stage is a surprise and no stage is skipped to hit a date.',
    process: [
      { title: 'Conversation', body: 'A call to work out what the site is for, who it is talking to, and which package fits. No charge and no obligation — and if a smaller package would do the job, that is the one I will point you at.' },
      { title: 'Confirmation', body: 'You know the price before anything starts, because it is published. For a Custom build, the scope and the final figure are agreed in writing first. A 50% deposit secures the project, and the remaining 50% is payable once the site is complete and approved, before it goes live.' },
      { title: 'Design', body: 'Structure and layout first, then the visual design, reviewed with you before a line of production code is written. Changing a design is cheap; changing a built site is not.' },
      { title: 'Build', body: 'Built in the open on a live preview link you can check at any point. Most packages take somewhere between one and three weeks, counted from the deposit and the arrival of your content — an estimate rather than a promise, since it moves if content or feedback is slow.' },
      { title: 'Revisions', body: 'Your package includes a set number of revision rounds — one on Starter, two on Advanced, three on Pro. A round means you collect your changes, send them over, and I work through them together. Feedback within 10 working days of the preview keeps things moving; later than that and the finish date can shift. I will never take silence as approval.' },
      { title: 'Launch', body: 'Testing across real devices, then a careful DNS switch — planned in advance so nothing goes dark. Handover comes with documentation you can actually use, and a management plan afterwards is entirely optional.' },
    ],
    standardsHeading: 'What does not get traded away.',
  },

  contact: {
    metaTitle: 'Contact',
    metaDescription: 'Tell Northbound about your project and get a written quote with a fixed scope and a fixed price. Reply within one working day.',
    eyebrow: 'Let’s talk',
    heading: 'Start a project.',
    replyPromise: 'Reply within one working day',
    ledeBefore: 'The more you can tell me about the business and the problem, the more useful my first reply will be. If you would rather just email,',
    ledeAfter: 'reaches the same place.',
    form: {
      name: 'Your name',
      email: 'Email address',
      business: 'Business name',
      projectType: 'What is this about?',
      projectTypePlaceholder: 'Choose one',
      budget: 'Approximate budget',
      message: 'Your message',
      messagePlaceholder: 'What does your business do, what is the site or system for, and is there a date you need it by?',
      optional: '(optional)',
      submit: 'Send enquiry',
      submitting: 'Sending…',
      privacyNote: 'Your details are used only to reply to this enquiry. Nothing is added to a mailing list and nothing is passed on.',
      privacyLink: 'How your data is handled',
      sentLabel: 'Sent',
      sentHeading: 'Message sent',
      notSure: 'Not sure yet',
      somethingElse: 'Something else',
      employeesInterest: 'Northbound Employees — register interest',
      budgets: ['Not sure yet', 'Under £500', '£500 – £1,000', '£1,000 – £2,500', 'Over £2,500'],
    },
    errors: {
      nameRequired: 'Please enter your name.',
      nameTooLong: 'That name is too long.',
      emailRequired: 'Please enter your email address.',
      emailTooLong: 'That email address is too long.',
      emailInvalid: 'Please enter a valid email address.',
      businessTooLong: 'That is too long.',
      messageTooShort: 'Please give me a little more detail — 20 characters or more.',
      messageTooLong: 'Please keep this under 4,000 characters.',
      checkFields: 'Please check the highlighted fields.',
      generic: 'Something went wrong sending your message. Please email me directly and I will pick it up.',
      rateLimited: 'You have sent a few messages already. Please try again later, or email me directly at {email}.',
      success: 'Thanks — your message is with me. I reply within one working day.',
    },
    faqEyebrow: 'Before you ask',
    faq: [
      { question: 'What happens after I send this?', answer: 'I read it properly and reply within one working day. If it looks like a fit, the next step is a short call to fill in the gaps — no charge and no obligation.' },
      { question: 'When do I find out the price?', answer: 'You already know it — the package prices are on the web services page, and they are what you pay. Only a Custom build varies, and its scope and price are agreed in writing before any work begins.' },
      { question: 'How does payment work?', answer: 'A 50% deposit secures the project and lets work begin. The remaining 50% is payable once the site is complete and approved, before it goes live.' },
      { question: 'How long does a build take?', answer: 'Roughly 5–7 working days for Starter, 7–10 for Advanced and 10–15 for Pro. Custom is agreed in your quote. These are estimates: the clock starts once the deposit and your content have arrived, and slow feedback moves the date.' },
      { question: 'Can I hire a Northbound Employee yet?', answer: 'Not yet. Northbound Employees are in development and none of them is available to buy or hire. You can register interest here and I will let you know when that changes.' },
      { question: 'Do I have to take a management plan?', answer: 'No. Plans are optional and rolling, and the build price does not depend on taking one. The Pro and Custom builds include one complimentary month of Pro Management — it does not turn into a paid subscription on its own, so if you do nothing when it ends, nothing is charged.' },
    ],
  },

  privacy: {
    metaTitle: 'Privacy',
    metaDescription: 'How Northbound Web handles the information you send through this website, and the rights you have over it.',
    eyebrow: 'Privacy',
    heading: 'Your information.',
    lede: 'What this website collects when you send an enquiry, why it is collected, who else sees it, and what you can ask for.',
    /**
     * Shown on every non-English version. A translated legal notice is a
     * convenience, not the operative text — a mistranslated lawful basis or
     * retention period is a compliance problem, so the English is stated to be
     * authoritative rather than quietly assumed to be.
     */
    translationNotice: 'This notice is provided in English and in translation. If the two differ, the English version is the one that applies.',
    lastUpdated: 'Last updated',
    sections: {
      who: 'Who this is about',
      collected: 'What is collected',
      why: 'Why it is collected',
      basis: 'Lawful basis',
      shared: 'Who else sees it',
      transfers: 'Where it goes',
      retention: 'How long it is kept',
      rights: 'Your rights',
      complain: 'Complaining',
    },
    whoBody: 'This website is operated by Che Walker, a sole trader trading as Northbound Web, based in the United Kingdom.',
    whoContact: 'For anything to do with your data, email {email}, or write to:',
    collectedIntro: 'The only place this site asks you for anything is the enquiry form. It collects:',
    collectedFields: [
      'Your name',
      'Your email address',
      'Your business name, if you give one',
      'What you are enquiring about',
      'An approximate budget, if you give one',
      'The message you write',
      'The language and currency you were viewing the site in',
    ],
    technicalIntro: 'Alongside that, one technical detail is recorded:',
    technicalFields: [
      'Your IP address, used only to limit how many messages one sender can submit in an hour, as a defence against automated abuse',
    ],
    noTracking: 'There is no advertising tracking on this site, and no account to create.',
    whyBody: 'To read your enquiry, reply to it, and carry on the conversation about the work you are asking about. The IP address is used only to stop the form being abused by automated submissions.',
    basisIntro: 'Different parts of this rely on different lawful bases under UK GDPR:',
    bases: [
      { name: 'Steps before entering a contract', body: 'Where you are asking for a quote, discussing a project, or asking Northbound to provide services. Handling that enquiry is what you asked for.' },
      { name: 'Legitimate interests', body: 'For replying to general business enquiries, keeping a record of enquiries, preventing spam, protecting the website and running the business. The assessment behind this is set out below.' },
      { name: 'Legal obligation', body: 'Where information has to be kept for tax, accounting or other regulatory requirements.' },
      { name: 'Consent', body: 'Only for optional marketing. Contacting Northbound does not subscribe you to anything, and there is no marketing list to join through this form.' },
    ],
    liaHeading: 'Legitimate interests assessment',
    lia: [
      { label: 'Purpose', body: 'To answer business enquiries, keep a record of who has been in touch and what was discussed, and protect the website from automated abuse.' },
      { label: 'Necessity', body: 'An enquiry cannot be answered without the sender’s name, address and message. The record is needed to avoid asking a returning enquirer for the same information twice, and to evidence what was agreed. Rate limiting cannot work without briefly recognising the sender’s IP address.' },
      { label: 'Balance', body: 'The data is what you chose to send in order to be contacted, it is used only for that, it is not sold, profiled or used for advertising, and it is deleted on the schedule below or sooner on request. On that basis the processing is not considered to override your interests or rights.' },
    ],
    sharedIntro: 'Your enquiry is not sold, and it is not shared for marketing. Two services necessarily handle it in order for the form to work at all:',
    transfersBody: 'Yes — information may be processed outside the UK. Both providers process data primarily in the United States and use international subprocessors. Transfers are covered by each provider’s data-processing agreement and the safeguards in it, including the UK International Data Transfer Addendum to the EU standard contractual clauses, and recognised data-transfer frameworks where those apply.',
    transfersLinksIntro: 'Their current privacy information:',
    retentionIntro: 'Information is kept only as long as there is a reason to keep it:',
    retention: [
      'Enquiries that do not become customers: deleted or anonymised 12 months after the last meaningful contact.',
      'Active customers: kept while services are being provided.',
      'Contractual, invoicing and accounting records: kept for the applicable legal or accounting period after the relationship ends.',
      'Spam, security and rate-limiting records: kept only for the short period needed to protect the service.',
    ],
    rightsIntro: 'Under UK data protection law you can:',
    rights: [
      'Ask for a copy of the personal data held about you',
      'Ask for inaccurate data to be corrected',
      'Ask for your data to be deleted',
      'Ask that it be restricted, or object to it being used',
      'Ask to receive it in a portable format',
      'Withdraw consent, where consent is what the processing relies on',
    ],
    rightsHow: 'To exercise any of them, email {email} or write to the address above. You do not have to give a reason.',
    complainBody: 'If you think your data has been handled badly, you can complain to the Information Commissioner’s Office, the UK’s data protection regulator, at {link}. Raising it with Northbound first is welcome but not required.',
  },

  notFound: {
    metaTitle: 'Page not found',
    metaDescription: 'That page does not exist on the Northbound website.',
    eyebrow: 'Error 404',
    heading: 'Off the map.',
    body: 'That page does not exist — it may have moved when the site was restructured around the two divisions.',
    recovery: 'Recovery',
    backHome: 'Back to home',
  },
} as const

/**
 * Widens the literal types `as const` produces into their base types.
 *
 * Without this, `Dictionary` would demand that the French file contain the
 * literal string "Skip to content" — the contract is the SHAPE of the
 * dictionary (which keys exist, which are arrays, which may be null), not the
 * English wording. Nulls widen to `string | null` so an optional note can be
 * absent in one language and present in another.
 */
type Widen<T> = T extends null
  ? string | null
  : T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends readonly (infer U)[]
          ? readonly Widen<U>[]
          : { -readonly [K in keyof T]: Widen<T[K]> }

export type Dictionary = Widen<typeof en>



