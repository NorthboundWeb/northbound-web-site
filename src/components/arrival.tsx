/**
 * Arriving at a junction.
 *
 * When a page opens, a slip road sweeps across the screen with the junction's
 * blue plate, and the page settles in behind it. It is pure CSS with no
 * state, so it cannot get stuck: it always ends hidden. Wrap the page content
 * in `.settle` so it fades up as the slip road clears.
 */
export function Arrival({ plate }: { plate: string }) {
  return (
    <>
      <div className="arrive" aria-hidden>
        <div className="arrive-tarmac" />
        <div className="arrive-plate">{plate}</div>
      </div>
      <style>{css}</style>
    </>
  )
}

const css = `
.arrive{position:fixed;inset:0;z-index:70;pointer-events:none;overflow:hidden;animation:arrive-out 500ms ease 900ms forwards}
.arrive-tarmac{position:absolute;left:-20%;right:-20%;top:0;bottom:0;background:#1a1c20;animation:arrive-sweep 1100ms var(--ease-in-out) forwards}
.arrive-tarmac::before{content:"";position:absolute;left:38%;top:0;bottom:0;width:12px;background:rgba(255,255,255,.85)}
.arrive-tarmac::after{content:"";position:absolute;left:62%;top:0;bottom:0;width:10px;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.75) 0 60px,transparent 60px 140px);animation:arrive-drive 500ms linear infinite}
.arrive-plate{position:absolute;left:50%;top:38%;padding:18px 28px 14px;border-radius:12px;background:#1D4F91;box-shadow:inset 0 0 0 5px #1D4F91,inset 0 0 0 8px #FFFFFF;color:#fff;font-weight:900;font-size:clamp(28px,5vw,56px);line-height:1;white-space:nowrap;animation:arrive-plate 1000ms var(--ease-in-out) forwards}
@keyframes arrive-sweep{0%{transform:skewX(-14deg) translateX(110%)}45%{transform:skewX(-14deg) translateX(0)}100%{transform:skewX(-14deg) translateX(-125%)}}
@keyframes arrive-plate{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}30%{opacity:1;transform:translate(-50%,-50%) scale(1)}70%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-80%) scale(2.2)}}
@keyframes arrive-drive{to{transform:translateY(140px)}}
@keyframes arrive-out{to{opacity:0;visibility:hidden}}
.settle{animation:arrive-settle 700ms var(--ease-out) 850ms both}
@keyframes arrive-settle{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.arrive{display:none}.settle{animation:none}}
`
