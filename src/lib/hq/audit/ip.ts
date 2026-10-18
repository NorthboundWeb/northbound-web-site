/**
 * Address classification for the audit fetcher.
 *
 * The audit tool fetches whatever URL it is given, which makes it a request
 * forgery risk: pointed at 169.254.169.254 or an internal hostname it would
 * happily read cloud metadata or reach services that were never meant to be
 * public. Every address a request would connect to is checked here first.
 *
 * Deliberately conservative: anything that is not clearly a public unicast
 * address is refused.
 */

function parseIPv4(ip: string): number[] | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  const octets = parts.map((p) => (/^\d{1,3}$/.test(p) ? Number(p) : NaN))
  if (octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) return null
  return octets
}

function isPrivateIPv4(octets: number[]): boolean {
  const [a, b, c] = octets
  if (a === 0) return true // "this network"
  if (a === 10) return true
  if (a === 100 && b >= 64 && b <= 127) return true // carrier-grade NAT
  if (a === 127) return true // loopback
  if (a === 169 && b === 254) return true // link-local, incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 0 && c === 0) return true // IETF protocol assignments
  if (a === 192 && b === 0 && c === 2) return true // documentation
  if (a === 192 && b === 168) return true
  if (a === 198 && (b === 18 || b === 19)) return true // benchmarking
  if (a === 198 && b === 51 && c === 100) return true // documentation
  if (a === 203 && b === 0 && c === 113) return true // documentation
  if (a >= 224) return true // multicast and reserved
  return false
}

/** Expands an IPv6 literal into eight 16-bit groups, or null if malformed. */
function parseIPv6(ip: string): number[] | null {
  let address = ip.toLowerCase()
  const zone = address.indexOf('%')
  if (zone !== -1) address = address.slice(0, zone)

  // An embedded dotted quad (::ffff:1.2.3.4) occupies the last two groups.
  const lastColon = address.lastIndexOf(':')
  const tail = address.slice(lastColon + 1)
  if (tail.includes('.')) {
    const v4 = parseIPv4(tail)
    if (!v4) return null
    const hi = ((v4[0] << 8) | v4[1]).toString(16)
    const lo = ((v4[2] << 8) | v4[3]).toString(16)
    address = `${address.slice(0, lastColon + 1)}${hi}:${lo}`
  }

  const halves = address.split('::')
  if (halves.length > 2) return null

  const toGroups = (part: string) =>
    part === '' ? [] : part.split(':')

  const head = toGroups(halves[0])
  const rest = halves.length === 2 ? toGroups(halves[1]) : []
  const missing = 8 - head.length - rest.length

  if (halves.length === 1 && head.length !== 8) return null
  if (halves.length === 2 && missing < 1) return null

  const groups = [
    ...head,
    ...(halves.length === 2 ? Array(missing).fill('0') : []),
    ...rest,
  ]
  if (groups.length !== 8) return null

  const numbers = groups.map((g) =>
    /^[0-9a-f]{1,4}$/.test(g) ? parseInt(g, 16) : NaN
  )
  return numbers.some((n) => Number.isNaN(n)) ? null : numbers
}

function isPrivateIPv6(groups: number[]): boolean {
  const [g0, g1, g2, g3, g4, g5, g6, g7] = groups

  // :: and ::1
  if (groups.slice(0, 7).every((g) => g === 0) && (g7 === 0 || g7 === 1)) {
    return true
  }
  // IPv4-mapped (::ffff:a.b.c.d) — judge by the embedded v4 address.
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0xffff) {
    return isPrivateIPv4([g6 >> 8, g6 & 255, g7 >> 8, g7 & 255])
  }
  // IPv4-compatible (::a.b.c.d), deprecated but still parseable.
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0) {
    return true
  }
  // NAT64 (64:ff9b::/96) can smuggle a private v4 address; refuse outright.
  if (g0 === 0x64 && g1 === 0xff9b) return true
  if ((g0 & 0xfe00) === 0xfc00) return true // unique local fc00::/7
  if ((g0 & 0xffc0) === 0xfe80) return true // link-local fe80::/10
  if ((g0 & 0xff00) === 0xff00) return true // multicast
  if (g0 === 0x2001 && g1 === 0x0db8) return true // documentation
  if (g0 === 0x2002) return true // 6to4 can wrap a private v4 address
  return false
}

/**
 * True when connecting to this address could reach something internal.
 * Unparseable input counts as private — failing closed.
 */
export function isPrivateAddress(ip: string): boolean {
  if (ip.includes(':')) {
    const groups = parseIPv6(ip)
    return groups ? isPrivateIPv6(groups) : true
  }
  const octets = parseIPv4(ip)
  return octets ? isPrivateIPv4(octets) : true
}
