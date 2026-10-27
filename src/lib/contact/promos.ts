/**
 * Promo codes. SERVER ONLY.
 *
 * Only src/lib/contact/actions.ts imports this file, and that file is a
 * 'use server' module, so the table below is never bundled for the browser. A
 * visitor learns a code only by typing it and having the server confirm it.
 * Do not import this from a client component, and do not move the codes into
 * a file a client component imports: anything the browser can load, the
 * visitor can read.
 *
 * A code takes money off the BUILD price only. Management prices and the free
 * first month are unchanged, and the copy says so wherever a code is shown.
 */

export type Promo = {
  code: string
  kind: 'amount' | 'percent'
  value: number
  /** Short label shown next to the code. */
  tag: string
  /** One line saying what the code does. */
  what: string
  /** Sentence shown once the code is applied. */
  msg: string
  /** Family & friends styling. */
  ff?: boolean
}

const PROMOS = new Map<string, Promo>(
  (
    [
      {
        code: 'NORTHBOUND25',
        kind: 'amount',
        value: 25,
        tag: 'Launch offer',
        what: '£25 off your build',
        msg: '£25 off the build price. Management prices are unchanged.',
      },
      {
        code: 'NBFAMILY',
        kind: 'percent',
        value: 30,
        tag: 'Family & friends',
        what: '30% off your build',
        msg: 'Family & friends rate. Thanks for backing Northbound. Same build, same care, 30% off the build price.',
        ff: true,
      },
    ] satisfies Promo[]
  ).map((promo) => [promo.code, promo])
)

/** Case, spaces and dashes do not matter: "nb-family" finds NBFAMILY. */
export function normaliseCode(raw: unknown) {
  if (typeof raw !== 'string') return ''
  return raw.toUpperCase().replace(/[\s-]+/g, '').slice(0, 32)
}

export function findPromo(raw: unknown): Promo | null {
  const code = normaliseCode(raw)
  return code ? (PROMOS.get(code) ?? null) : null
}
