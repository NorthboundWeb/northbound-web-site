import { discounted, money } from '@/lib/pricing'
import type { AppliedPromo, Lane, StartInput } from './start'

/**
 * The enquiry text for a guided-flow submission, written on the SERVER from the
 * validated answers. Prices are worked out here from services.ts and the code
 * the server itself accepted, never taken from the browser.
 */
export function composeStartMessage({
  input,
  lane,
  promo,
  ref,
}: {
  input: StartInput
  lane: Lane
  promo: AppliedPromo | null
  ref: string
}) {
  const fixed = lane.price > 0 && !lane.variable
  const net = fixed ? discounted(lane.price, promo) : lane.price

  const priceLine = fixed
    ? `${money(net)}, fixed${promo ? ` (was ${money(lane.price)})` : ''}. Deposit ${money(net / 2)}, balance ${money(net / 2)} before go-live.`
    : lane.price > 0
      ? `From ${money(lane.price)}, to be quoted in writing.`
      : 'Not chosen: please recommend a package.'

  const lines = [
    `Guided enquiry. Ref ${ref}`,
    '',
    `Business: ${input.biz.trim()} (${input.trade})`,
    input.site.trim() ? `Current website: ${input.site.trim()}` : null,
    `Lane: ${lane.name}. ${priceLine}`,
    promo
      ? `Promo code: ${promo.code} (${promo.tag}, ${promo.what}).${fixed ? '' : ' Take it off the quote.'}`
      : null,
    input.budget ? `Rough budget: ${input.budget}` : null,
    `Management: ${input.mgmt ? 'interested (first month free)' : 'not now'}`,
    input.pages ? `Pages: ${input.pages}` : null,
    input.feats.length ? `Needs: ${input.feats.join(', ')}` : null,
    input.content ? `Words and photos ready: ${input.content}` : null,
    input.phone.trim() ? `Phone: ${input.phone.trim()}` : null,
  ].filter((line): line is string => line !== null)

  const note = input.msg.trim()
  if (note) lines.push('', 'Notes:', note)

  return lines.join('\n')
}
