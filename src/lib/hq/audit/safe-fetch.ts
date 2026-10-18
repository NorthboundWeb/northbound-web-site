import dns from 'node:dns'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import zlib from 'node:zlib'
import { isPrivateAddress } from './ip'

/**
 * HTTP client for the site audit, built so it cannot be turned against our own
 * network.
 *
 * Three layers, because each one covers a gap in the others:
 *  1. The URL is validated up front (scheme, port, credentials, literal IPs,
 *     obviously internal hostnames).
 *  2. Every connection resolves the hostname through `guardedLookup`, which
 *     refuses private addresses at connect time. Checking the address the
 *     socket will actually use closes the DNS-rebinding gap that a separate
 *     "resolve, check, then fetch" step would leave open.
 *  3. Redirects are followed by hand so each hop goes through 1 and 2 again.
 */

export type FetchResult = {
  /** The URL that produced this response, after redirects. */
  url: string
  status: number
  /** Lower-cased header names; repeated headers are joined with ", ". */
  headers: Record<string, string>
  body: string
  /** Bytes after decompression. */
  bodyBytes: number
  /** Bytes as they crossed the network. */
  wireBytes: number
  truncated: boolean
  timeMs: number
  redirects: string[]
}

export type FetchOptions = {
  method?: 'GET' | 'HEAD'
  followRedirects?: boolean
  maxBytes?: number
  timeoutMs?: number
}

export type Fetcher = (url: string, options?: FetchOptions) => Promise<FetchResult>

export class FetchError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.name = 'FetchError'
    this.code = code
  }
}

const USER_AGENT =
  'Mozilla/5.0 (compatible; NorthboundSiteCheck/1.0; +https://northboundweb.co.uk)'
const MAX_REDIRECTS = 5
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024
const DEFAULT_TIMEOUT_MS = 12_000

const INTERNAL_SUFFIXES = ['.local', '.localhost', '.internal', '.lan', '.home', '.corp']

function bareHost(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, '').toLowerCase()
}

/** Throws FetchError unless the URL is one we are willing to request. */
export function assertPublicUrl(url: URL): void {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new FetchError('Only http and https addresses can be checked.', 'EBLOCKED')
  }
  if (url.username || url.password) {
    throw new FetchError('Addresses with a username or password are not allowed.', 'EBLOCKED')
  }
  const defaultPort = url.protocol === 'https:' ? '443' : '80'
  if (url.port && url.port !== defaultPort) {
    throw new FetchError('Only the standard web ports can be checked.', 'EBLOCKED')
  }

  const host = bareHost(url.hostname)
  if (!host) throw new FetchError('That address has no hostname.', 'EBLOCKED')

  if (net.isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new FetchError('That address points at a private network.', 'EBLOCKED')
    }
    return
  }

  // A single-label name ("intranet") only resolves through a local search
  // domain, which is exactly where internal hosts live.
  if (!host.includes('.') || INTERNAL_SUFFIXES.some((s) => host.endsWith(s))) {
    throw new FetchError('That looks like an internal hostname.', 'EBLOCKED')
  }
}

type LookupCallback = (
  error: NodeJS.ErrnoException | null,
  address: string | dns.LookupAddress[],
  family?: number
) => void

function guardedLookup(
  hostname: string,
  options: dns.LookupOptions,
  callback: LookupCallback
): void {
  dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error, '', 0)

    const list = addresses as dns.LookupAddress[]
    if (list.length === 0 || list.some((entry) => isPrivateAddress(entry.address))) {
      const blocked = new Error('Resolved to a private address.') as NodeJS.ErrnoException
      blocked.code = 'EBLOCKED'
      return callback(blocked, '', 0)
    }

    if (options.all) return callback(null, list)
    return callback(null, list[0].address, list[0].family)
  })
}

type RawResponse = {
  status: number
  headers: Record<string, string>
  body: string
  bodyBytes: number
  wireBytes: number
  truncated: boolean
  location: string | null
}

function flattenHeaders(raw: http.IncomingHttpHeaders): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue
    out[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value
  }
  return out
}

function requestOnce(
  url: URL,
  method: 'GET' | 'HEAD',
  maxBytes: number,
  timeoutMs: number
): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'https:' ? https : http
    let settled = false

    const finish = (action: () => void) => {
      if (settled) return
      settled = true
      clearTimeout(deadline)
      action()
    }

    const request = transport.request(
      {
        method,
        hostname: bareHost(url.hostname),
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        agent: false,
        lookup: guardedLookup as unknown as net.LookupFunction,
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
          'accept-language': 'en-GB,en;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
        },
      },
      (response) => {
        const headers = flattenHeaders(response.headers)
        const status = response.statusCode ?? 0
        const location = headers.location ?? null

        // Redirects and HEAD requests have nothing we need to read.
        if (method === 'HEAD' || (status >= 300 && status < 400)) {
          response.resume()
          request.destroy()
          return finish(() =>
            resolve({
              status,
              headers,
              body: '',
              bodyBytes: 0,
              wireBytes: 0,
              truncated: false,
              location,
            })
          )
        }

        let wireBytes = 0
        let bodyBytes = 0
        let truncated = false
        const chunks: Buffer[] = []

        const encoding = (headers['content-encoding'] ?? '').toLowerCase()
        const decoder =
          encoding === 'gzip' || encoding === 'x-gzip'
            ? zlib.createGunzip()
            : encoding === 'deflate'
              ? zlib.createInflate()
              : encoding === 'br'
                ? zlib.createBrotliDecompress()
                : null

        const source: NodeJS.ReadableStream = decoder ? response.pipe(decoder) : response

        response.on('data', (chunk: Buffer) => {
          wireBytes += chunk.length
        })

        source.on('data', (chunk: Buffer) => {
          if (truncated) return
          bodyBytes += chunk.length
          if (bodyBytes > maxBytes) {
            truncated = true
            request.destroy()
            return
          }
          chunks.push(chunk)
        })

        const done = () =>
          finish(() =>
            resolve({
              status,
              headers,
              body: Buffer.concat(chunks).toString('utf8'),
              bodyBytes: Math.min(bodyBytes, maxBytes),
              wireBytes,
              truncated,
              location,
            })
          )

        source.on('end', done)
        source.on('close', done)
        source.on('error', (error: Error) => {
          // A truncated stream also lands here once we destroy the request;
          // keep what was read rather than discarding a usable page.
          if (truncated) return done()
          finish(() => reject(error))
        })
        response.on('error', (error) => {
          if (truncated) return done()
          finish(() => reject(error))
        })
      }
    )

    const deadline = setTimeout(() => {
      request.destroy()
      finish(() => reject(new FetchError('The site took too long to respond.', 'ETIMEDOUT')))
    }, timeoutMs)

    request.on('error', (error: NodeJS.ErrnoException) => {
      finish(() =>
        reject(
          error instanceof FetchError
            ? error
            : new FetchError(error.message, error.code ?? 'EFETCH')
        )
      )
    })

    request.end()
  })
}

export const safeFetch: Fetcher = async (input, options = {}) => {
  const {
    method = 'GET',
    followRedirects = true,
    maxBytes = DEFAULT_MAX_BYTES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options

  let current: URL
  try {
    current = new URL(input)
  } catch {
    throw new FetchError('That is not a valid web address.', 'EBLOCKED')
  }

  const started = Date.now()
  const redirects: string[] = []

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    assertPublicUrl(current)
    const remaining = Math.max(1_000, timeoutMs - (Date.now() - started))
    const response = await requestOnce(current, method, maxBytes, remaining)

    const isRedirect = response.status >= 300 && response.status < 400
    if (followRedirects && isRedirect && response.location) {
      redirects.push(current.href)
      try {
        current = new URL(response.location, current)
      } catch {
        throw new FetchError('The site redirected to an invalid address.', 'EREDIRECT')
      }
      continue
    }

    return {
      url: current.href,
      status: response.status,
      headers: response.headers,
      body: response.body,
      bodyBytes: response.bodyBytes,
      wireBytes: response.wireBytes,
      truncated: response.truncated,
      timeMs: Date.now() - started,
      redirects,
    }
  }

  throw new FetchError('The site redirected too many times.', 'EREDIRECTS')
}
