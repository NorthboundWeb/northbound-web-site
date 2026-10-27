import type { Metadata } from 'next'
import { Arrival } from '@/components/arrival'
import { StartFlow } from '@/components/start-flow'
import { startFromParam } from '@/lib/contact/start'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Start a project',
  description: `Tell ${site.name} about your project and get a written quote with a fixed scope and a fixed price. Replies usually within one working day.`,
  alternates: { canonical: '/contact' },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string | string[] }>
}) {
  // Resolved on the server so a pricing card's link lands with its lane (or
  // the management box) already chosen.
  const initial = startFromParam((await searchParams).package)

  return (
    <div className="start">
      <Arrival plate="Start a project" />

      <div className="settle">
        <section className="swrap shead">
          <span className="kicker">Start a project</span>
          <h1 className="sh1">Plan your route. Four junctions, about two minutes.</h1>
          <p className="slede">
            Tell us about your business and pick a lane. You&apos;ll see the price, the deposit and
            a rough timeline as you go. Nothing is charged here: we reply with a written quote first.
            Rather email? <a href={`mailto:${site.email}`}>{site.email}</a> reaches the same place.
          </p>
        </section>

        <StartFlow initial={initial} />
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.start{--spring-soft:cubic-bezier(.22,1,.36,1);font-size:18px;line-height:1.55}
@supports (transition-timing-function: linear(0, 1)){
  .start{--spring-soft:linear(0, 0.030 2.5%, 0.106 5%, 0.210 7.5%, 0.325 10%, 0.443 12.5%, 0.556 15%, 0.658 17.5%, 0.748 20%, 0.824 22.5%, 0.886 25%, 0.935 27.5%, 0.972 30%, 0.999 32.5%, 1.018 35%, 1.030 37.5%, 1.036 40%, 1.038 42.5%, 1.038 45%, 1.035 47.5%, 1.031 50%, 1.027 52.5%, 1.022 55%, 1.018 57.5%, 1.014 60%, 1.010 62.5%, 1.007 65%, 1.005 67.5%, 1.003 70%, 1.001 72.5%, 1)}
}
.swrap{max-width:1320px;margin-inline:auto;padding-inline:40px;box-sizing:border-box}
.shead{padding-top:clamp(28px,5vw,56px);padding-bottom:clamp(20px,3vw,32px)}
.sh1{text-wrap:wrap;margin:16px 0 0;font-weight:900;font-size:clamp(38px,5.4vw,72px);line-height:.98;letter-spacing:-.025em;max-width:14em}
.slede{margin:16px 0 0;max-width:38em;font-size:clamp(17px,1.4vw,20px);color:#C9CED4;text-wrap:wrap}
.slede a{color:#FFFFFF}
@media (hover:hover){.slede a:hover{color:#FFB21A}}

.sflow{position:relative;scroll-margin-top:96px}
.sbody{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:32px;align-items:start;padding-top:28px;padding-bottom:clamp(48px,6vw,88px)}

.start .card{border-radius:16px;background:#1D4F91;color:#FFFFFF;box-shadow:inset 0 0 0 7px #1D4F91,inset 0 0 0 11px #FFFFFF;padding:40px 44px 36px}
.start .card a{color:#FFFFFF}
.step{animation:s-in 520ms var(--spring-soft) both}
.step.back{animation-name:s-in-back}
@keyframes s-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes s-in-back{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
.step-top{display:flex;align-items:center;gap:16px;padding-bottom:18px;margin-bottom:24px;border-bottom:3px solid rgba(255,255,255,.9)}
.step-top .jn{display:inline-flex;align-items:center;justify-content:center;min-width:60px;padding:9px 10px 5px;border-radius:6px;box-shadow:inset 0 0 0 3px #FFFFFF;font-weight:900;font-size:22px;line-height:1}
.step-top h2{margin:0;font-weight:900;font-size:clamp(26px,2.8vw,36px);line-height:1.05;letter-spacing:-.015em;outline:none}
.hint{margin:-8px 0 22px;font-size:16px;font-weight:500;color:#E3ECF8}
.fine{margin:12px 0 0;font-size:13px;line-height:1.5;color:#C9D7EA}

.field{margin-top:22px}
.step-top + .field{margin-top:0}
.two .field{margin-top:0}
.field > label,.legend{display:block;margin:0 0 9px;font-weight:800;font-size:16px;padding:0}
.opt-l{font-weight:500;color:#C9D7EA;font-size:14px;margin-left:6px}
.in{box-sizing:border-box;width:100%;min-height:54px;padding:8px 16px 5px;background:#0F2C55;border:2px solid #4A73AE;border-radius:8px;color:#FFFFFF;font:600 18px var(--font-sans);transition:border-color 150ms ease,box-shadow 150ms ease}
textarea.in{display:block;min-height:120px;resize:vertical;line-height:1.45;padding-top:12px}
select.in{appearance:auto}
.in::placeholder{color:#8FA8CC}
.in:focus{outline:none;border-color:#FFB21A;box-shadow:0 0 0 4px rgba(255,178,26,.22)}
.in.bad{border-color:#FF8A7A;box-shadow:0 0 0 4px rgba(255,138,122,.18)}
.err{display:block;margin-top:7px;font-size:14px;font-weight:700;color:#FFD0C8}
.two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
.start fieldset{margin:0;padding:0;border:0;min-width:0}

.chips{display:flex;flex-wrap:wrap;gap:10px}
.chip{box-sizing:content-box;position:relative;display:inline-flex;align-items:center;min-height:44px;padding:4px 16px 0;border-radius:999px;border:2px solid #4A73AE;background:#0F2C55;font-weight:700;font-size:15px;cursor:pointer;transition:background-color 150ms ease,border-color 150ms ease,transform 200ms var(--ease-out)}
.chip:active{transform:scale(.96);transition-duration:90ms}
.chip input,.lane input,.tick input,.mgmt input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
.chip.on{background:#FFFFFF;border-color:#FFFFFF;color:#0F2C55}
.chip:focus-within,.lane:focus-within,.tick:focus-within,.mgmt:focus-within{outline:3px solid #FFB21A;outline-offset:2px}

.lanes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.lane{position:relative;display:flex;flex-direction:column;gap:6px;padding:18px 18px 16px;border-radius:12px;background:#0F2C55;border:2px solid #4A73AE;cursor:pointer;transition:border-color 150ms ease,background-color 150ms ease,transform 200ms var(--ease-out)}
.lane:active{transform:scale(.985);transition-duration:90ms}
.lane.on{border-color:#FFB21A;background:#0B2244;box-shadow:0 0 0 2px #FFB21A}
.lane-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding-right:30px}
.lane-name{font-weight:900;font-size:22px;line-height:1.1}
.lane-price{font-weight:900;font-size:22px;font-variant-numeric:tabular-nums;white-space:nowrap}
.lane-price small{font-size:13px;font-weight:700;margin-right:4px}
.lane-sub{font-size:14px;font-weight:500;color:#D4E0F0;line-height:1.45}
.lane-time{font-size:13px;font-weight:700;color:#FFB21A;margin-top:2px}
.lane .mark{position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;border:2px solid #6E93C9;transition:background-color 150ms ease,border-color 150ms ease}
.lane.on .mark{background:#FFB21A;border-color:#FFB21A}
.lane.on .mark::after{content:"";position:absolute;left:6px;top:3px;width:6px;height:10px;border:solid #0B2244;border-width:0 3px 3px 0;transform:rotate(45deg)}

.ticks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.tick{box-sizing:content-box;position:relative;display:flex;align-items:center;gap:12px;min-height:48px;padding:6px 14px 4px;border-radius:10px;background:#0F2C55;border:2px solid #4A73AE;font-weight:600;font-size:15px;cursor:pointer;transition:border-color 150ms ease,transform 200ms var(--ease-out)}
.tick:active{transform:scale(.985);transition-duration:90ms}
.tick .box,.mgmt .box{box-sizing:content-box;flex:none;width:22px;height:22px;border-radius:5px;border:2px solid #6E93C9;transition:background-color 150ms ease,border-color 150ms ease;position:relative}
.tick.on{border-color:#FFFFFF}
.tick.on .box,.mgmt.on .box{background:#FFFFFF;border-color:#FFFFFF}
.tick.on .box::after,.mgmt.on .box::after{content:"";position:absolute;left:6px;top:2px;width:6px;height:11px;border:solid #0F2C55;border-width:0 3px 3px 0;transform:rotate(45deg)}

.advise{display:flex;gap:14px;align-items:flex-start;margin-top:22px;padding:16px 18px 13px;border-radius:10px;background:#000;box-shadow:inset 0 0 0 3px #FFB21A;color:#FFFFFF;font-size:15px;line-height:1.45;animation:s-in 420ms var(--spring-soft) both}
.advise b{color:#FFB21A}
.advise button{margin-top:8px;min-height:40px;padding:3px 14px 0;border:0;border-radius:6px;background:#FFB21A;color:#121417;font:800 14px var(--font-sans);cursor:pointer}
.advise svg{flex:none;width:26px;height:26px;margin-top:2px}

.mgmt{position:relative;display:flex;gap:14px;align-items:flex-start;margin-top:22px;padding:16px 18px 14px;border-radius:12px;background:#0F2C55;border:2px solid #4A73AE;cursor:pointer;transition:border-color 150ms ease}
.mgmt.on{border-color:#FFFFFF}
.mgmt .box{margin-top:2px}
.mgmt b{display:block;font-weight:800;font-size:16px}
.mgmt span.s{display:block;font-size:14px;color:#D4E0F0;margin-top:3px;line-height:1.45}
.free-tag{display:inline-block;margin-left:8px;padding:2px 8px 0;border-radius:4px;background:#FFB21A;color:#121417;font-weight:900;font-size:12px;letter-spacing:.06em;text-transform:uppercase;vertical-align:2px}

.controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-top:30px;padding-top:22px;border-top:2px dashed rgba(255,255,255,.35)}
.go{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:4px 24px 0;border:0;border-radius:8px;background:#FFB21A;color:#121417;font:900 17px var(--font-sans);cursor:pointer;transition:background-color 150ms ease,transform 200ms var(--ease-out)}
.go:active{transform:scale(.97);transition-duration:90ms}
.go[disabled]{opacity:.6;cursor:progress}
@media (hover:hover){.go:hover{background:#FFC24A}}
.go svg{width:20px;height:20px}
.backbtn{min-height:48px;padding:4px 16px 0;border:2px solid rgba(255,255,255,.6);border-radius:8px;background:transparent;color:#FFFFFF;font:800 15px var(--font-sans);cursor:pointer;transition:border-color 150ms ease,transform 200ms var(--ease-out)}
.backbtn:active{transform:scale(.97);transition-duration:90ms}
@media (hover:hover){.backbtn:hover{border-color:#FFFFFF}}
.stepcount{font-size:14px;font-weight:700;color:#D4E0F0}

.rv{margin:0}
.rv div{display:flex;justify-content:space-between;gap:20px;padding:12px 0 9px;border-bottom:2px solid rgba(255,255,255,.22)}
.rv dt{font-weight:700;color:#D4E0F0}
.rv dd{margin:0;font-weight:800;text-align:right}
.edit{margin-left:10px;padding:0;border:0;background:none;color:#FFB21A;font:700 14px var(--font-sans);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.small{margin:16px 0 0;font-size:14px;line-height:1.5;color:#D4E0F0}
.sendfail{margin:0 0 18px;padding:14px 16px 12px;border-radius:10px;background:#000;box-shadow:inset 0 0 0 3px #FF8A7A;font-size:15px;line-height:1.5}
.sendfail p{margin:0}
.sendfail ul{margin:8px 0 0;padding-left:18px}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

.done-card{border-radius:16px;background:#000;box-shadow:inset 0 0 0 7px #000,inset 0 0 0 11px #FFB21A;padding:44px 46px 40px}
.done-card h2{margin:0;font-weight:900;font-size:clamp(30px,3.6vw,48px);line-height:1.02;letter-spacing:-.02em;outline:none}
.done-card .ref{display:inline-block;margin-top:16px;padding:7px 12px 4px;border-radius:5px;border:3px solid #FFFFFF;font-weight:900;letter-spacing:.06em}
.done-msg{margin:16px 0 0;font-size:16px;color:#C9CED4}
.next{margin:26px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:16px}
.next li{display:grid;grid-template-columns:62px minmax(0,1fr);gap:14px;align-items:start}
.next .jn{display:inline-flex;align-items:center;justify-content:center;padding:8px 6px 4px;border-radius:5px;background:#000;border:3px solid #FFFFFF;font-weight:900;font-size:16px;line-height:1}
.next b{display:block;font-weight:800}
.next .t{display:block;font-size:15px;color:#C9CED4;margin-top:2px}

.summary{position:sticky;top:96px;border-radius:14px;background:#000;box-shadow:inset 0 0 0 3px #2B2F35;padding:24px 24px 20px}
.summary h3{margin:0 0 4px;font-weight:900;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#FFB21A}
.sum-big{font-weight:900;font-size:40px;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;margin-top:10px}
.sum-big small{font-size:15px;font-weight:700;margin-right:6px;letter-spacing:0;color:#C9CED4}
.sum-big .was{display:block;margin-top:6px;font-size:15px;font-weight:700;letter-spacing:0;color:#9AA1AA;text-decoration:line-through;text-decoration-thickness:2px}
.sum-pkg{font-weight:800;font-size:17px;margin-top:4px}
.sum-rows{margin:16px 0 0}
.sum-rows div{display:flex;justify-content:space-between;gap:14px;padding:9px 0 6px;border-top:1px solid #2B2F35;font-size:15px}
.sum-rows dt{color:#9AA1AA}
.sum-rows dd{margin:0;font-weight:700;text-align:right;font-variant-numeric:tabular-nums}
.sum-rows .disc dd{color:#7BE0A6}
.sum-note{margin:14px 0 0;font-size:13px;line-height:1.5;color:#9AA1AA}
.sum-empty{margin:10px 0 0;font-size:15px;color:#9AA1AA}

.promo{margin:22px 0 4px;padding:18px 18px 16px;border-radius:12px;background:rgba(0,0,0,.22);box-shadow:inset 0 0 0 2px rgba(255,255,255,.18)}
.promo > label{display:block;margin:0 0 9px;font-weight:800;font-size:16px}
.promo > label .opt{font-weight:600;font-size:14px;color:#B9CBE4;margin-left:6px}
.promo-row{display:flex;gap:10px}
.promo-row .in{flex:1;min-width:0;text-transform:uppercase;letter-spacing:.06em}
.promo-row .in::placeholder{text-transform:none;letter-spacing:0}
.promo-btn{flex:none;min-height:54px;padding:4px 20px 0;border:2px solid #FFFFFF;border-radius:8px;background:transparent;color:#FFFFFF;font:800 16px var(--font-sans);cursor:pointer;transition:background-color 150ms ease,color 150ms ease,transform 160ms var(--ease-out)}
.promo-btn:active{transform:scale(.97)}
@media (hover:hover){.promo-btn:hover{background:#FFFFFF;color:#1D4F91}}
.promo-btn:focus-visible{outline:3px solid #FFB21A;outline-offset:2px}
.promo-ok{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:4px 14px;align-items:center;animation:s-promo 420ms var(--spring-soft) both}
@keyframes s-promo{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
.promo-badge{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:#7BE0A6;color:#0B2E1C;font-weight:900;font-size:22px;padding-top:2px}
.promo-ok.ff .promo-badge{background:#FFB21A;color:#121417}
.promo-code{font-weight:900;font-size:17px;letter-spacing:.06em}
.promo-what{display:block;font-size:14.5px;font-weight:700;color:#D4E0F0;letter-spacing:0}
.promo-tag{display:inline-block;margin-left:8px;padding:3px 7px 1px;border-radius:4px;background:#7BE0A6;color:#0B2E1C;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;vertical-align:2px}
.promo-ok.ff .promo-tag{background:#FFB21A;color:#121417}
.promo-msg{grid-column:1/-1;margin:8px 0 0;font-size:14px;line-height:1.5;color:#D4E0F0}
.promo .edit{margin:0}
.summary .promo{margin:16px 0 0;padding:14px;background:transparent;box-shadow:inset 0 0 0 1px #2B2F35}
.summary .promo > label{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#9AA1AA}
.summary .promo > label .opt{display:none}
.summary .promo-row .in{min-height:44px;font-size:15px;background:#121417;border-color:#3A3F46}
.summary .promo-btn{min-height:44px;padding:3px 14px 0;font-size:14px;border-color:#6B717A}
.summary .promo-badge{width:34px;height:34px;font-size:17px}
.summary .promo-code{font-size:15px}
.summary .promo-what{font-size:13px;color:#C9CED4}

/* The road: a strip along the bottom of the screen while the form is on it.
   Junction signs stand beside it and the car is the progress indicator. It
   is sticky rather than fixed, so it comes to rest above the footer. */
.road{position:sticky;left:0;right:0;bottom:0;z-index:30;--roadh:72px;background:rgba(18,20,23,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,.06);padding-bottom:env(safe-area-inset-bottom,0px);animation:s-road 600ms var(--ease-out) 900ms both}
@keyframes s-road{from{transform:translateY(100%)}to{transform:none}}
.roadwrap{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center}
.carriage{position:relative;height:var(--roadh)}
.surface{position:absolute;left:0;right:0;top:46px;height:20px;border-radius:3px;background:#2B2F35;box-shadow:inset 0 -3px 0 #1A1D21}
.surface::before{content:"";position:absolute;left:8px;right:8px;top:9px;height:2px;background:repeating-linear-gradient(90deg,#FFFFFF 0 12px,transparent 12px 24px);opacity:.55}
.rd{list-style:none;margin:0;padding:0}
.rd li{position:absolute;top:6px;margin-left:-17px;display:flex;align-items:center;gap:8px}
.rd .plate{display:inline-flex;align-items:center;justify-content:center;width:34px;height:20px;padding-top:2px;border-radius:4px;background:#000;border:2px solid #6B717A;color:#9AA1AA;font-weight:900;font-size:11px;line-height:1;letter-spacing:.02em;transition:border-color 300ms ease,color 300ms ease,background-color 300ms ease}
.rd .post{position:absolute;left:15.5px;top:20px;width:3px;height:26px;background:#4A5058}
.rd .lab{font-weight:700;font-size:12px;color:#6B717A;white-space:nowrap;transition:color 300ms ease}
.rd li.done .plate{border-color:#FFFFFF;color:#FFFFFF}
.rd li.done .lab{color:#9AA1AA}
.rd li.here .plate{background:#FFB21A;border-color:#FFB21A;color:#121417}
.rd li.here .lab{color:#FFFFFF}
.car{position:absolute;z-index:1;top:29px;width:60px;height:28px;margin-left:-30px;transition:left 800ms var(--ease-out);animation:s-drive-in 1100ms var(--ease-out) 1000ms both}
.car svg{display:block;width:100%;height:100%;overflow:visible;transform-origin:50% 90%}
.car .wheel{transform-box:fill-box;transform-origin:center;animation:s-spin 1100ms var(--ease-out) 1000ms 1 both}
.car.moving .wheel{animation:s-spin 800ms var(--ease-out) 1}
.car.moving.rev .wheel{animation-direction:reverse}
.car.moving svg{animation:s-lean 800ms var(--ease-out) 1}
.car.moving.rev svg{animation-name:s-lean-rev}
@keyframes s-drive-in{from{transform:translateX(-40vw)}to{transform:none}}
@keyframes s-spin{to{transform:rotate(1080deg)}}
@keyframes s-lean{0%{transform:none}22%{transform:translateY(-1px) rotate(-2.5deg)}100%{transform:none}}
@keyframes s-lean-rev{0%{transform:none}22%{transform:translateY(-1px) rotate(2.5deg)}100%{transform:none}}
.psign{display:none}

@media (max-width:1000px){
  .sbody{grid-template-columns:minmax(0,1fr)}
  .summary{display:none}
  .road{--roadh:62px}
  .psign{display:flex;flex-direction:column;justify-content:center;width:134px;min-height:50px;max-height:58px;padding:5px 10px 4px;border-radius:7px;background:#1D4F91;box-shadow:inset 0 0 0 2px #1D4F91,inset 0 0 0 4px #FFFFFF;color:#FFFFFF}
  .psign .p{font-weight:900;font-size:17px;line-height:1.05;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .psign .d{margin-top:3px;font-weight:700;font-size:10.5px;line-height:1.2;color:#DCE6F3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .surface{top:40px;height:16px}
  .surface::before{top:7px}
  .rd li{top:4px;margin-left:-15px}
  .rd .plate{width:30px;height:18px;font-size:10px}
  .rd .post{left:13.5px;top:18px;height:22px}
  .car{top:26px;width:48px;height:22px;margin-left:-24px}
}
@media (max-width:900px){.rd .lab{display:none}}
@media (max-width:700px){
  .swrap{padding-inline:16px}
  .start .card{padding:28px 22px 24px}
  .lanes,.ticks,.two{grid-template-columns:minmax(0,1fr)}
  .two .field + .field{margin-top:22px}
  .done-card{padding:30px 22px 26px}
  .controls{flex-direction:column-reverse;align-items:stretch}
  .go{justify-content:center}
  .stepcount{text-align:center}
  .promo{padding:16px 14px 14px}
  .promo-ok{grid-template-columns:auto minmax(0,1fr)}
  .promo-ok .edit{grid-column:2;justify-self:start}
}
@media (prefers-reduced-motion:reduce){
  .step,.advise,.road,.promo-ok{animation:none}
  .car{transition:none;animation:none}
  .car .wheel,.car.moving .wheel,.car.moving svg{animation:none}
}
`
