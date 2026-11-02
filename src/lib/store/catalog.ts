/**
 * Everything on the store, in one list. Edit products here, not in JSX.
 *
 * Prices: website builds and management plans come from src/lib/services.ts
 * (the real, published prices). Physical products and tablet systems have
 * `price: null` until Che sets one, and show "Price on request" — never put a
 * made-up number here.
 */
import { buildPackages, managementPlans } from '@/lib/services'

export type CategoryId = 'websites' | 'care' | 'nfc-cards' | 'reviews' | 'tap' | 'tablets'

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: 'websites', label: 'Websites', blurb: 'Built for you, priced up front.' },
  { id: 'care', label: 'Care plans', blurb: 'Hosting, security and updates each month. Optional.' },
  { id: 'nfc-cards', label: 'NFC business cards', blurb: 'Tap a phone to share your details.' },
  { id: 'reviews', label: 'Google review stands', blurb: 'Customers tap their phone to leave a review.' },
  { id: 'tap', label: 'Tap & scan', blurb: 'Stands, tags and stickers that open a link.' },
  { id: 'tablets', label: 'Tablet systems', blurb: 'Order, book or check in on an iPad.' },
]

/** Which little illustration a product gets. */
export type Art =
  | { kind: 'site'; tone: 'pro' | 'ultimate' | 'custom' }
  | { kind: 'plan'; level: 1 | 2 | 3 }
  | { kind: 'card'; material: 'metal' | 'plastic' | 'wood' }
  | { kind: 'stand'; label: string; stars?: boolean }
  | { kind: 'plaque' }
  | { kind: 'tag'; label: string }
  | { kind: 'tablet'; mode: 'menu' | 'booking' | 'checkin' }

export type Product = {
  id: string
  category: CategoryId
  name: string
  summary: string
  details: string[]
  /** £; null shows "Price on request". */
  price: number | null
  /** e.g. "from", "a month". */
  pricePrefix?: string
  priceSuffix?: string
  /** Extra words that should match in search. */
  tags: string[]
  art: Art
  /** Choices shown in the product sheet, e.g. finishes. */
  options?: { label: string; choices: string[] }
  /** Cards: my design by default, or the customer's own design as an option. */
  customDesign?: boolean
  /** Show a quantity stepper (physical items). */
  quantity?: boolean
  /** Where the main button goes; default adds to the request list. */
  startHref?: string
  badge?: string
}

const NFC_NOTE = 'Works by tapping on most modern iPhone and Android phones. A QR code is printed on too, for phones that cannot tap.'
const LINK_NOTE = 'The link can be changed later without replacing the item.'

const websites: Product[] = buildPackages.map((p) => ({
  id: `site-${p.slug}`,
  category: 'websites',
  name: `${p.name} website`,
  summary: p.summary,
  details: [...p.includes, `${p.timeline}.`, ...(p.note ? [p.note] : [])],
  price: p.price,
  pricePrefix: p.variable ? 'from' : undefined,
  tags: ['website', 'site', 'web design', 'build', p.slug, p.bestFor],
  art: { kind: 'site', tone: p.slug as 'pro' | 'ultimate' | 'custom' },
  startHref: '/start',
  badge: p.badge,
}))

const care: Product[] = managementPlans.map((m, i) => ({
  id: m.slug,
  category: 'care',
  name: m.name,
  summary: m.summary,
  details: [...m.includes, m.changeTime, 'Your first month is free, and it does not turn into a paid plan unless you say so.'],
  price: m.price,
  pricePrefix: m.slug === 'custom-management' ? 'from' : undefined,
  priceSuffix: 'a month',
  tags: ['management', 'hosting', 'maintenance', 'updates', 'support', 'monthly', 'care'],
  art: { kind: 'plan', level: (i + 1) as 1 | 2 | 3 },
}))

const physical: Product[] = [
  {
    id: 'nfc-card-metal',
    category: 'nfc-cards',
    name: 'Metal NFC business card',
    summary: 'A weighty metal card that shares your contact details, website and socials with one tap.',
    details: ['Metal card with an NFC chip and a QR code', 'Your logo and details engraved', 'Opens your own contact page, built by me', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['nfc', 'business card', 'contactless', 'tap', 'metal', 'steel', 'premium', 'digital business card'],
    art: { kind: 'card', material: 'metal' },
    customDesign: true,
    options: { label: 'Finish', choices: ['Black', 'Silver', 'Gold'] },
    quantity: true,
    badge: 'Premium',
  },
  {
    id: 'nfc-card-plastic',
    category: 'nfc-cards',
    name: 'Plastic NFC business card',
    summary: 'A full-colour printed card with a hidden NFC chip. The everyday option for a whole team.',
    details: ['Printed card with an NFC chip and a QR code', 'Full-colour design on both sides', 'Opens your own contact page, built by me', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['nfc', 'business card', 'contactless', 'tap', 'plastic', 'pvc', 'printed', 'team'],
    art: { kind: 'card', material: 'plastic' },
    customDesign: true,
    options: { label: 'Finish', choices: ['Matte', 'Gloss'] },
    quantity: true,
  },
  {
    id: 'nfc-card-wood',
    category: 'nfc-cards',
    name: 'Wooden NFC business card',
    summary: 'A natural wooden card with your logo engraved and an NFC chip inside.',
    details: ['Wooden card with an NFC chip and a QR code', 'Your logo and details engraved', 'Opens your own contact page, built by me', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['nfc', 'business card', 'contactless', 'tap', 'wood', 'bamboo', 'eco', 'natural'],
    art: { kind: 'card', material: 'wood' },
    customDesign: true,
    options: { label: 'Wood', choices: ['Light', 'Dark'] },
    quantity: true,
  },
  {
    id: 'review-stand',
    category: 'reviews',
    name: 'Google review stand',
    summary: 'Sits on the counter. Customers tap their phone on it and your Google review page opens, ready to write.',
    details: ['Counter stand with an NFC chip and a QR code', 'Goes straight to your Google review form', 'Your logo on the front', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['google', 'reviews', 'review stand', 'stars', 'nfc', 'counter', 'tap', 'feedback'],
    art: { kind: 'stand', label: 'Tap to review', stars: true },
    quantity: true,
    badge: 'Popular',
  },
  {
    id: 'review-plaque',
    category: 'reviews',
    name: 'Google review wall plaque',
    summary: 'A slim plaque for the wall by the till or the door, for when the counter is busy.',
    details: ['Wall-mounted plaque with an NFC chip and a QR code', 'Goes straight to your Google review form', 'Your logo on the front', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['google', 'reviews', 'plaque', 'wall', 'nfc', 'qr', 'tap'],
    art: { kind: 'plaque' },
    quantity: true,
  },
  {
    id: 'review-card',
    category: 'reviews',
    name: 'Google review card',
    summary: 'A pocket card to hand over after a job, or leave on the table with the bill.',
    details: ['Card with an NFC chip and a QR code', 'Goes straight to your Google review form', 'Good for trades and mobile businesses', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['google', 'reviews', 'card', 'trades', 'mobile', 'nfc', 'tap', 'bill'],
    art: { kind: 'card', material: 'plastic' },
    customDesign: true,
    quantity: true,
  },
  {
    id: 'social-stand',
    category: 'tap',
    name: 'Social follow stand',
    summary: 'Tap to follow you on Instagram, TikTok or Facebook, right from the counter.',
    details: ['Counter stand with an NFC chip and a QR code', 'Opens a page with all your socials', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['instagram', 'tiktok', 'facebook', 'social', 'follow', 'stand', 'nfc'],
    art: { kind: 'stand', label: 'Tap to follow' },
    quantity: true,
  },
  {
    id: 'menu-stand',
    category: 'tap',
    name: 'Table menu stand',
    summary: 'One on each table. Tap or scan to open your menu on the customer’s phone.',
    details: ['Table stand with an NFC chip and a QR code', 'Opens your online menu, which I can build', 'Update the menu without reprinting', NFC_NOTE],
    price: null,
    tags: ['menu', 'restaurant', 'cafe', 'pub', 'table', 'qr menu', 'nfc', 'food'],
    art: { kind: 'stand', label: 'Tap for menu' },
    quantity: true,
  },
  {
    id: 'wifi-stand',
    category: 'tap',
    name: 'Wi-Fi tap stand',
    summary: 'Guests tap to see your Wi-Fi details, so nobody has to ask for the password.',
    details: ['Small stand with an NFC chip and a QR code', 'Good for cafés, salons, rentals and offices', NFC_NOTE],
    price: null,
    tags: ['wifi', 'wi-fi', 'password', 'guest', 'airbnb', 'cafe', 'nfc'],
    art: { kind: 'stand', label: 'Tap for Wi-Fi' },
    quantity: true,
  },
  {
    id: 'nfc-stickers',
    category: 'tap',
    name: 'NFC tags and stickers',
    summary: 'Small round tags you can stick on anything: a van, a shop window, packaging or a product.',
    details: ['Programmed with any link you choose', 'Can be printed with your logo', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['nfc', 'sticker', 'tag', 'label', 'packaging', 'van', 'window'],
    art: { kind: 'tag', label: 'TAP' },
    quantity: true,
  },
  {
    id: 'nfc-keyring',
    category: 'tap',
    name: 'NFC keyring',
    summary: 'Your contact page on your keys, so it is always on you.',
    details: ['Keyring with an NFC chip', 'Opens your contact page or any link', NFC_NOTE, LINK_NOTE],
    price: null,
    tags: ['keyring', 'keychain', 'nfc', 'contact', 'tap'],
    art: { kind: 'tag', label: 'KEY' },
    quantity: true,
  },
  {
    id: 'tablet-menu',
    category: 'tablets',
    name: 'Tablet ordering menu',
    summary: 'An interactive menu on an iPad at the table or the counter. Customers browse, pick and send their order.',
    details: [
      'Built as a web app that runs on iPad or any tablet',
      'Photos, categories, options and allergens',
      'Orders go straight to you',
      'Can work alongside your existing till; checked during the quote',
      'Tablets and stands can be supplied or you can use your own',
    ],
    price: null,
    tags: ['ipad', 'tablet', 'kiosk', 'menu', 'order', 'restaurant', 'cafe', 'takeaway', 'self service', 'food'],
    art: { kind: 'tablet', mode: 'menu' },
    startHref: '/start?build=system',
    badge: 'New',
  },
  {
    id: 'tablet-booking',
    category: 'tablets',
    name: 'Tablet booking screen',
    summary: 'Let customers book an appointment, a table, a trip or a holiday on an iPad in your shop or window.',
    details: [
      'Built as a web app that runs on iPad or any tablet',
      'Shows real availability and takes the booking',
      'Good for salons, travel agents, gyms and activity centres',
      'Tablets and stands can be supplied or you can use your own',
    ],
    price: null,
    tags: ['ipad', 'tablet', 'kiosk', 'booking', 'appointments', 'holiday', 'travel', 'salon', 'self service'],
    art: { kind: 'tablet', mode: 'booking' },
    startHref: '/start?build=system',
  },
  {
    id: 'tablet-checkin',
    category: 'tablets',
    name: 'Tablet check-in kiosk',
    summary: 'Visitors check themselves in on arrival, fill in a form or sign, and you get a note straight away.',
    details: [
      'Built as a web app that runs on iPad or any tablet',
      'Sign-in, consent forms and visitor logs',
      'Good for clinics, gyms, offices and events',
      'Tablets and stands can be supplied or you can use your own',
    ],
    price: null,
    tags: ['ipad', 'tablet', 'kiosk', 'check in', 'sign in', 'visitor', 'form', 'reception', 'self service'],
    art: { kind: 'tablet', mode: 'checkin' },
    startHref: '/start?build=system',
  },
]

export const PRODUCTS: Product[] = [...websites, ...care, ...physical]

export function priceLabel(p: Product) {
  if (p.price === null) return 'Price on request'
  return [p.pricePrefix, `£${p.price.toLocaleString('en-GB')}`, p.priceSuffix].filter(Boolean).join(' ')
}

export function searchProducts(q: string, list: Product[] = PRODUCTS) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return list
  return list.filter((p) => {
    const hay = [p.name, p.summary, ...p.tags, ...p.details, CATEGORIES.find((c) => c.id === p.category)?.label ?? ''].join(' ').toLowerCase()
    return words.every((w) => hay.includes(w))
  })
}
