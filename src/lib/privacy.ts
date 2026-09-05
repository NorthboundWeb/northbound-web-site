import { budgetBands, projectTypes } from '@/lib/contact/schema'

/**
 * Privacy policy content.
 *
 * HARD RULE: nothing in this file may be invented. A privacy notice is a legal
 * statement about what a business actually does, and a plausible-sounding
 * guess is worse than an admitted gap — it is a false statement to a
 * regulator and to the visitor.
 *
 * Everything below marked `confirmed` is derived from the code in this
 * repository: the fields the form posts, the services it sends them through,
 * and where the site is hosted. Everything in `awaitingOwner` is a decision
 * only the business owner can make. While any of those is null, the site is
 * NOT launch-ready and the page says the policy is being finalised rather than
 * publishing a made-up retention period or lawful basis.
 */

/** Facts established from the codebase itself. */
export const confirmed = {
  /** Fields the enquiry form posts. Derived from the contact schema. */
  formFields: [
    'Your name',
    'Your email address',
    'Your business name, if you give one',
    `What you are enquiring about (one of: ${projectTypes.length} options, including package and management enquiries)`,
    `An approximate budget, if you give one (${budgetBands.length} bands)`,
    'The message you write',
  ],
  /**
   * Collected as a side effect rather than asked for. The contact action reads
   * the forwarding headers to rate-limit submissions per address.
   */
  technicalData: [
    'Your IP address, used only to limit how many messages one sender can submit in an hour, as a defence against automated abuse',
  ],
  /** Third parties that necessarily see the data, read off the dependencies. */
  processors: [
    {
      name: 'Resend',
      role: 'Delivers the enquiry email. Your message passes through their systems to reach the Northbound inbox.',
    },
    {
      name: 'Vercel',
      role: 'Hosts this website and runs the code that receives the form submission.',
    },
  ],
} as const

/**
 * Decisions that must come from the business owner before this policy can be
 * published. Fill each one in; the page renders the section as soon as it is
 * no longer null, and `privacyIsComplete` flips on its own.
 */
export const awaitingOwner: {
  /** Registered/trading name and status, e.g. sole trader or limited company. */
  legalIdentity: string | null
  /** A contact address for data-protection requests. */
  postalAddress: string | null
  /** The lawful basis relied on under UK GDPR, and why. */
  lawfulBasis: string | null
  /** How long enquiries are kept, and what happens at the end. */
  retention: string | null
  /** Whether data leaves the UK, and the safeguard relied on if it does. */
  internationalTransfers: string | null
  /** ICO registration number, if the business is registered. */
  icoRegistration: string | null
} = {
  legalIdentity: null,
  postalAddress: null,
  lawfulBasis: null,
  retention: null,
  internationalTransfers: null,
  icoRegistration: null,
}

/** True only once every owner decision above has been supplied. */
export const privacyIsComplete = Object.values(awaitingOwner).every(
  (value) => value !== null
)

/** The rights a UK data subject has. These are statutory, not a business choice. */
export const dataRights = [
  'Ask for a copy of the personal data held about you',
  'Ask for inaccurate data to be corrected',
  'Ask for your data to be deleted',
  'Ask that it be restricted or object to it being used',
  'Ask to receive it in a portable format',
  'Withdraw consent, where consent is what the processing relies on',
]
