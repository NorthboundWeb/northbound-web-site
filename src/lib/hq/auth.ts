import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { HQ_COOKIE, readHqConfig, verifySessionToken } from './session'

/**
 * Session checks for pages, server actions and route handlers under /hq.
 *
 * The proxy already turns away anyone without a session, but a proxy rule is a
 * single point of failure: a changed matcher or a refactor could quietly drop
 * it. Every entry point under /hq therefore asks again here.
 */
export async function isHqAuthed(): Promise<boolean> {
  const config = readHqConfig()
  if (!config) return false
  const token = (await cookies()).get(HQ_COOKIE)?.value
  return verifySessionToken(config.secret, token)
}

/** For pages and actions: send anyone without a session to the login page. */
export async function requireHq(): Promise<void> {
  if (!(await isHqAuthed())) redirect('/hq/login')
}
