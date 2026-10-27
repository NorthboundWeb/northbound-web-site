import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Arrival } from '@/components/arrival'
import {
  BookingDemo,
  ColoursDemo,
  HoursDemo,
  MenuDemo,
  QuoteDemo,
  RedesignDemo,
} from '@/components/project-demos'

// The made-up businesses in the demos have their own type: a warm serif, so
// they read as someone else's website rather than Northbound's.
const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Six things a small-business website can do, working on the page: book a haircut, drag a redesign, price a window clean. Try them. Every business shown is made up.',
  alternates: { canonical: '/projects' },
}

type Bay = {
  id: string
  title: string
  short: string
  why: string
  tag: string
  /** Outlined tag: the feature is quoted rather than included in a package. */
  quoted?: boolean
  wide?: boolean
  demoClass?: string
  demo: ReactNode
  note: ReactNode
}

const bays: Bay[] = [
  {
    id: 'booking',
    title: 'Online booking',
    short: 'Online booking',
    why: 'Customers book themselves in at 11pm instead of ringing you mid-job. Pick a service, a barber, a day and a time.',
    tag: 'Pro & Ultimate',
    wide: true,
    demo: <BookingDemo />,
    note: (
      <>
        <strong>Pro</strong> sets this up for one staff calendar with email confirmations.{' '}
        <strong>Ultimate</strong> covers several staff, reminders, booking payments, cancelling and
        rescheduling. It’s set up on an established booking service rather than built from scratch,
        and a bespoke booking system is quoted separately. Nothing here is saved or sent.
      </>
    ),
  },
  {
    id: 'redesign',
    title: 'The redesign',
    short: 'Redesign',
    why: 'Same café, same menu, same phone number. Drag the handle to see what fifteen years does to a first impression.',
    tag: 'Every package',
    wide: true,
    demo: <RedesignDemo />,
    note: (
      <>
        The Harbour Café is made up. A rebuild is just a build: Pro or Ultimate, at the same fixed
        price. You supply the words and photos and we format and tidy them; copywriting and
        photography aren’t part of the fixed packages.
      </>
    ),
  },
  {
    id: 'quote',
    title: 'Instant quotes',
    short: 'Instant quotes',
    why: 'Answer the question every customer asks before they’ve picked up the phone.',
    tag: 'Custom',
    quoted: true,
    demoClass: 'qt',
    demo: <QuoteDemo />,
    note: (
      <>
        Clearview Window Cleaning and its prices are made up. A calculator like this runs on your
        own pricing rules, so it’s a Custom build, quoted before any work starts.
      </>
    ),
  },
  {
    id: 'menu',
    title: 'Menus & price lists',
    short: 'Menus & price lists',
    why: 'A real menu instead of a 4MB PDF, so people can read it on a phone and find what they can eat.',
    tag: 'Every package',
    demo: <MenuDemo />,
    note: (
      <>
        The Harbour Café’s menu is made up. Your menu, services or price list go in as proper page
        content rather than a PDF.
      </>
    ),
  },
  {
    id: 'hours',
    title: 'Live opening hours',
    short: 'Live opening hours',
    why: 'It reads the visitor’s clock, so “are they open?” gets answered before anyone rings.',
    tag: 'Ask about this one',
    quoted: true,
    demo: <HoursDemo />,
    note: <>Kestrel Barbers’ hours are made up. Live right now, from your device’s clock.</>,
  },
  {
    id: 'colours',
    title: 'Your colours',
    short: 'Your colours',
    why: 'The site is built around your brand, not squeezed into a template’s. Pick a palette.',
    tag: 'Every package',
    demo: <ColoursDemo />,
    note: (
      <>
        We build with the colours and logo you already have. Logo and brand design aren’t part of
        the fixed packages.
      </>
    ),
  },
]

export default function ProjectsPage() {
  return (
    <div className={`proj ${serif.variable}`}>
      <Arrival plate="Projects" />

      <div className="settle">
        <section className="pwrap phead">
          <span className="kicker">Junction 3 · Projects</span>
          <h1 className="ph1">Don’t look at screenshots. Have a go.</h1>
          <p className="plede">
            Six things a small-business website can do, built properly and working on this page.
            Book a haircut, drag a redesign, price a window clean. The businesses are made up. The
            features are real.
          </p>
          <nav className="svc" aria-label="Demos on this page">
            <div className="svc-h">
              <span className="big">Services</span>
              <span className="small">6 bays ahead</span>
            </div>
            <ol>
              {bays.map((bay, i) => (
                <li key={bay.id}>
                  <a className="chip" href={`#bay-${bay.id}`}>
                    <span className="n">{i + 1}</span>
                    {bay.short}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <div className="pwrap bays">
          {bays.map((bay, i) => (
            <section
              key={bay.id}
              className={bay.wide ? 'bay wide' : 'bay'}
              id={`bay-${bay.id}`}
              aria-labelledby={`${bay.id}-h`}
            >
              <div className="bay-head">
                <span className="bn">{i + 1}</span>
                <div>
                  <h2 className="bay-title" id={`${bay.id}-h`}>
                    {bay.title}
                  </h2>
                  <p className="bay-why">{bay.why}</p>
                </div>
                <span className={bay.quoted ? 'tag custom' : 'tag'}>{bay.tag}</span>
              </div>
              <div className={bay.demoClass ? `demo ${bay.demoClass}` : 'demo'}>{bay.demo}</div>
              <p className="bay-note">{bay.note}</p>
            </section>
          ))}
        </div>

        <section className="pwrap pnext" aria-label="Next">
          <Link className="pexit" href="/contact">
            <span className="pexit-n">J6</span>
            <span>
              <span className="pexit-t">Want one of these on your site?</span>
              <span className="pexit-s">
                Start a project. Tell us what you need and get a price before anything starts.
              </span>
            </span>
            <span className="pexit-a" aria-hidden>
              →
            </span>
          </Link>
          <p className="alt">
            Not sure what you need yet? <Link href="/discover">See how the options compare</Link>.
          </p>
          <p className="pfine">
            Every business on this page is made up for the demos: Kestrel Barbers, The Harbour Café
            and Clearview Window Cleaning aren’t clients. The features are real and working.
          </p>
        </section>
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.proj{--spring-soft:cubic-bezier(.22,1,.36,1);--serif:var(--font-serif),Georgia,serif;font-size:18px;line-height:1.55;overflow-x:clip}
@supports (transition-timing-function: linear(0, 1)){
  .proj{--spring-soft:linear(0, 0.030 2.5%, 0.106 5%, 0.210 7.5%, 0.325 10%, 0.443 12.5%, 0.556 15%, 0.658 17.5%, 0.748 20%, 0.824 22.5%, 0.886 25%, 0.935 27.5%, 0.972 30%, 0.999 32.5%, 1.018 35%, 1.030 37.5%, 1.036 40%, 1.038 42.5%, 1.038 45%, 1.035 47.5%, 1.031 50%, 1.027 52.5%, 1.022 55%, 1.018 57.5%, 1.014 60%, 1.010 62.5%, 1.007 65%, 1.005 67.5%, 1.003 70%, 1.001 72.5%, 1)}
}
.pwrap{max-width:1320px;margin-inline:auto;padding-inline:40px;box-sizing:border-box}
.phead{padding-top:clamp(28px,5vw,56px);padding-bottom:clamp(24px,3vw,36px)}
.ph1{margin:16px 0 0;font-weight:900;font-size:clamp(40px,6vw,84px);line-height:.96;letter-spacing:-.03em;max-width:12em}
.plede{margin:18px 0 0;max-width:36em;font-size:clamp(17px,1.4vw,20px);color:#C9CED4;text-wrap:wrap}

.svc{margin-top:34px;border-radius:14px;background:#1D4F91;box-shadow:inset 0 0 0 5px #1D4F91,inset 0 0 0 8px #FFFFFF;padding:22px 26px 20px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:20px;align-items:center}
.svc-h{display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding-right:20px;border-right:2px solid rgba(255,255,255,.75)}
.svc-h .big{font-weight:900;font-size:30px;line-height:1}
.svc-h .small{font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#DCE6F3}
.svc ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.svc a.chip{display:inline-flex;align-items:center;gap:9px;padding:8px 13px 6px 8px;border-radius:7px;background:rgba(0,0,0,.28);color:#FFFFFF;text-decoration:none;font-weight:800;font-size:15px;transition:background-color 150ms ease,transform 160ms var(--ease-out)}
.svc a.chip:active{transform:scale(.97)}
@media (hover:hover){.svc a.chip:hover{background:rgba(0,0,0,.5);color:#FFFFFF}}
.svc .n{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#FFFFFF;color:#1D4F91;font-size:13px;font-weight:900;padding-top:2px}

.bays{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;padding-top:44px;padding-bottom:30px}
.bay{grid-column:span 1;scroll-margin-top:90px;display:flex;flex-direction:column;border-radius:16px;background:#1A1D21;border:1px solid #2B2F35;overflow:hidden}
.bay.wide{grid-column:1/-1}
.bay-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:16px;align-items:start;padding:22px 24px 18px;border-bottom:1px solid #2B2F35}
.bn{display:inline-flex;align-items:center;justify-content:center;min-width:46px;height:40px;padding:3px 8px 0;border-radius:6px;background:#000;border:3px solid #FFFFFF;font-weight:900;font-size:18px}
.bay-title{margin:0;font-weight:900;font-size:clamp(22px,2vw,28px);line-height:1.1;letter-spacing:-.01em}
.bay-why{margin:6px 0 0;font-size:15.5px;line-height:1.5;color:#C9CED4}
.tag{display:inline-flex;align-items:center;white-space:nowrap;padding:6px 10px 4px;border-radius:5px;background:#FFB21A;color:#121417;font-weight:900;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.tag.custom{background:transparent;color:#FFB21A;box-shadow:inset 0 0 0 2px #FFB21A}
.demo{position:relative;flex:1;padding:24px}
.bay-note{margin:0;padding:14px 24px 18px;border-top:1px dashed #2B2F35;font-size:13.5px;line-height:1.5;color:#9AA1AA}
.bay-note strong{color:#D5D9DE}

.seg{display:flex;flex-wrap:wrap;gap:8px}
.pill{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:4px 14px 0;border-radius:999px;border:2px solid #3A3F46;background:transparent;color:#E4E7EB;font:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:border-color 150ms ease,background-color 150ms ease,color 150ms ease,transform 160ms var(--ease-out)}
.pill:active{transform:scale(.97)}
@media (hover:hover){.pill:hover{border-color:#8A929B}}
.pill.on{background:#FFFFFF;border-color:#FFFFFF;color:#121417}
.pill:focus-visible,.slot:focus-visible,.day:focus-visible,.sw:focus-visible,.gobtn:focus-visible{outline:3px solid #FFB21A;outline-offset:2px}
.lbl{display:block;margin:0 0 10px;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#9AA1AA}
.gobtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:4px 22px 0;border:0;border-radius:8px;background:#FFB21A;color:#121417;font:inherit;font-weight:900;font-size:16px;cursor:pointer;transition:background-color 150ms ease,transform 160ms var(--ease-out),opacity 150ms ease}
.gobtn:active{transform:scale(.97)}
@media (hover:hover){.gobtn:hover{background:#FFC24A}}
.gobtn[disabled]{opacity:.35;cursor:not-allowed;transform:none}

.bk{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:32px;align-items:start}
.bk-steps{display:flex;flex-direction:column;gap:22px}
.days{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}
.day{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px 8px;border-radius:10px;border:2px solid #3A3F46;background:transparent;color:#E4E7EB;font:inherit;cursor:pointer;transition:border-color 150ms ease,background-color 150ms ease,transform 160ms var(--ease-out)}
.day:active{transform:scale(.97)}
@media (hover:hover){.day:hover{border-color:#8A929B}}
.day .dw{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#9AA1AA}
.day .dn{font-size:22px;font-weight:900;line-height:1.1}
.day.on{background:#FFFFFF;border-color:#FFFFFF;color:#121417}
.day.on .dw{color:#4A5058}
.slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.slot{min-height:42px;padding:3px 6px 0;border-radius:8px;border:2px solid #3A3F46;background:transparent;color:#E4E7EB;font:inherit;font-size:15px;font-weight:800;font-variant-numeric:tabular-nums;cursor:pointer;transition:border-color 150ms ease,background-color 150ms ease,transform 160ms var(--ease-out)}
.slot:active{transform:scale(.97)}
@media (hover:hover){.slot:hover:not([disabled]){border-color:#8A929B}}
.slot.on{background:#FFB21A;border-color:#FFB21A;color:#121417}
.slot[disabled]{cursor:not-allowed;color:#4A5058;border-color:#24272C;text-decoration:line-through}
.noslots{margin:0;font-size:15px;color:#9AA1AA}
.ticket{position:sticky;top:96px;border-radius:14px;background:#F4F1EA;color:#16181B;padding:22px 22px 20px;box-shadow:0 20px 50px rgba(0,0,0,.4)}
.ticket .shop{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-weight:800;font-size:22px;line-height:1.1}
.ticket .mark{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#16181B;color:#F4F1EA;font-family:var(--font-sans);font-size:15px;font-weight:900;padding-top:2px}
.ticket dl{margin:16px 0 18px;display:grid;gap:9px}
.ticket dl > div{display:flex;justify-content:space-between;gap:12px;padding-bottom:9px;border-bottom:1px dashed #C9C3B6;font-size:15px}
.ticket dt{color:#5B6068}
.ticket dd{margin:0;font-weight:800;text-align:right}
.ticket .gobtn{width:100%}
.booked{animation:p-pop 520ms var(--spring-soft) both}
@keyframes p-pop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
.booked .tickmark{display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;background:#1F7A4D;color:#FFFFFF;font-size:30px;font-weight:900;margin-bottom:12px}
.booked h3{margin:0;font-family:var(--serif);font-size:26px;line-height:1.1}
.booked p{margin:10px 0 0;font-size:15px;line-height:1.5;color:#3A3F46}
.linkbtn{margin-top:14px;padding:0;border:0;background:none;color:#16181B;font:inherit;font-size:15px;font-weight:800;text-decoration:underline;text-underline-offset:3px;cursor:pointer}

.ba{position:relative;height:clamp(340px,40vw,460px);border-radius:12px;overflow:hidden;background:#000;user-select:none;-webkit-user-select:none;touch-action:pan-y}
.ba-old,.ba-new{position:absolute;inset:0}
.ba-new{clip-path:inset(0 0 0 var(--cut))}
.ba-old{background:#FFFFE0 repeating-linear-gradient(45deg,transparent 0 14px,rgba(0,0,160,.05) 14px 28px);color:#000;font-family:'Times New Roman',Times,serif;text-align:left;padding:22px clamp(16px,3vw,32px)}
.ba-old .o-title{margin:0;font-size:clamp(26px,3.2vw,40px);color:#C00000;font-weight:700;text-shadow:2px 2px 0 #FFD700;font-style:italic}
.ba-old .o-marq{margin:8px 0;max-width:520px;background:#0000A0;color:#FFFF00;font-family:'Comic Sans MS','Comic Sans',cursive;font-size:14px;padding:4px;overflow:hidden;white-space:nowrap}
.ba-old .o-marq-in{display:inline-block;animation:p-marq 9s linear infinite}
@keyframes p-marq{from{transform:translateX(100%)}to{transform:translateX(-100%)}}
.ba-old .o-links{margin:10px 0;font-size:15px}
.ba-old .o-links a{color:#0000EE;margin:0 6px;text-decoration:underline}
.ba-old .o-box{display:inline-block;margin-top:6px;border:3px ridge #999;padding:10px 16px;background:#FFFFFF;font-size:14px;max-width:340px}
.ba-old .o-box a{text-decoration:underline}
.ba-old .o-count{display:inline-block;margin-top:12px;background:#000;color:#0F0;font-family:'Courier New',monospace;padding:2px 6px;font-size:13px}
.ba-new{background:#0F2A3D;color:#F6F1E7;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
.n-copy{padding:clamp(22px,4vw,48px);display:flex;flex-direction:column;justify-content:center;gap:14px}
.n-nav{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:16px clamp(22px,4vw,48px);font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#C7D3DB}
.n-logo{font-family:var(--serif);font-size:19px;letter-spacing:0;text-transform:none;color:#F6F1E7}
.n-h{margin:0;font-family:var(--serif);font-size:clamp(30px,4vw,54px);line-height:1;letter-spacing:-.02em}
.n-p{margin:0;max-width:24em;font-size:clamp(14px,1.3vw,17px);color:#C7D3DB}
.n-cta{display:flex;gap:10px;flex-wrap:wrap}
.n-btn{display:inline-flex;align-items:center;padding:10px 16px 8px;border-radius:999px;background:#F08A5D;color:#0F2A3D;font-weight:900;font-size:14px}
.n-btn.ghost{background:transparent;color:#F6F1E7;box-shadow:inset 0 0 0 2px rgba(246,241,231,.5)}
.n-art{position:relative;overflow:hidden;background:radial-gradient(circle at 30% 30%,#F08A5D 0 18%,transparent 19%),linear-gradient(160deg,#16405C,#0B1F2D)}
.n-cup{position:absolute;left:50%;bottom:16%;width:46%;aspect-ratio:1.15;transform:translateX(-50%);border-radius:0 0 46% 46%;background:#F6F1E7;box-shadow:inset 0 -14px 0 rgba(0,0,0,.08)}
.n-cup::after{content:"";position:absolute;right:-22%;top:16%;width:30%;height:44%;border:8px solid #F6F1E7;border-left:0;border-radius:0 50% 50% 0}
.n-cup::before{content:"";position:absolute;left:10%;right:10%;top:7%;height:20%;border-radius:50%;background:#7A4A2B}
.n-steam{position:absolute;left:50%;bottom:58%;width:8px;height:60px;margin-left:-4px;border-radius:8px;background:linear-gradient(to top,rgba(246,241,231,.6),transparent);animation:p-steam 3.2s ease-in-out infinite}
.n-steam.s2{margin-left:-28px;animation-delay:.9s}.n-steam.s3{margin-left:20px;animation-delay:1.7s}
@keyframes p-steam{0%{opacity:0;transform:translateY(10px) scaleY(.6)}40%{opacity:1}100%{opacity:0;transform:translateY(-30px) scaleY(1.1)}}
.ba-line{position:absolute;top:0;bottom:0;left:var(--cut);width:4px;margin-left:-2px;background:#FFB21A;pointer-events:none}
.ba-knob{position:absolute;top:50%;left:var(--cut);width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:#FFB21A;color:#121417;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;box-shadow:0 6px 20px rgba(0,0,0,.45);pointer-events:none;transition:transform 160ms var(--ease-out)}
.ba.grab .ba-knob{transform:scale(1.08)}
.ba-lab{position:absolute;bottom:14px;padding:6px 10px 4px;border-radius:5px;background:rgba(0,0,0,.72);color:#FFFFFF;font-weight:900;font-size:12px;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
.ba-lab.l{left:14px}.ba-lab.r{right:14px}
.ba-range{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;touch-action:pan-y}
.ba-range:focus-visible ~ .ba-knob{outline:3px solid #FFFFFF;outline-offset:3px}

.qt{display:flex;flex-direction:column;gap:20px}
.qt-out{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:18px 20px;border-radius:12px;background:#000;border:2px solid #2B2F35}
.qt-price{font-weight:900;font-size:clamp(40px,4.4vw,56px);line-height:.9;font-variant-numeric:tabular-nums;color:#FFB21A}
.qt-price .per{display:block;margin-top:8px;font-size:14px;font-weight:700;color:#9AA1AA;letter-spacing:.02em}
.qt-meter{flex:1;max-width:160px;height:10px;border-radius:5px;background:#2B2F35;overflow:hidden;margin-bottom:8px}
.qt-fill{height:100%;width:var(--w);border-radius:5px;background:#FFB21A;transition:width 420ms var(--spring-soft)}
.ticks{display:flex;flex-wrap:wrap;gap:8px}

.menu{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:2px}
.mi{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 14px;padding:12px 4px;border-bottom:1px solid #2B2F35;transition:opacity 260ms ease,filter 260ms ease,transform 260ms var(--ease-out)}
.mi.dim{opacity:.18;filter:grayscale(1);transform:translateX(6px)}
.mi-name{font-weight:800;font-size:17px}
.mi-price{font-weight:800;font-variant-numeric:tabular-nums}
.mi-tags{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap}
.dt{padding:3px 7px 1px;border-radius:4px;background:#24272C;color:#C9CED4;font-size:11.5px;font-weight:800;letter-spacing:.05em}
.count{margin:14px 0 0;font-size:14px;color:#9AA1AA}

.hrs-status{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:12px;background:#000;border:2px solid #2B2F35}
.lamp{flex:none;width:16px;height:16px;border-radius:50%;background:#6B717A}
.lamp.open{background:#38D27A;box-shadow:0 0 0 5px rgba(56,210,122,.18),0 0 16px rgba(56,210,122,.7);animation:p-breathe 2.4s ease-in-out infinite}
.lamp.shut{background:#E5484D;box-shadow:0 0 0 5px rgba(229,72,77,.16)}
@keyframes p-breathe{50%{box-shadow:0 0 0 9px rgba(56,210,122,.08),0 0 22px rgba(56,210,122,.9)}}
.hrs-big{font-weight:900;font-size:22px;line-height:1.15}
.hrs-sub{font-size:14.5px;color:#C9CED4}
.hrs{list-style:none;margin:16px 0 0;padding:0}
.hrs li{display:flex;justify-content:space-between;gap:12px;padding:9px 10px;border-radius:6px;font-size:16px;font-variant-numeric:tabular-nums}
.hrs li.today{background:#24272C;font-weight:800}
.hrs .closed{color:#9AA1AA}

.th-sw{display:flex;gap:10px;flex-wrap:wrap}
.sw{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:4px 14px 0 6px;border-radius:999px;border:2px solid #3A3F46;background:transparent;color:#E4E7EB;font:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:border-color 150ms ease,transform 160ms var(--ease-out)}
.sw:active{transform:scale(.97)}
.sw.on{border-color:#FFFFFF;color:#FFFFFF}
.sw .dots{display:inline-flex;margin-top:-3px}
.sw .dot{width:22px;height:22px;border-radius:50%;box-shadow:0 0 0 2px #1A1D21}
.sw .dot + .dot{margin-left:-7px}
.th-prev{margin-top:18px;border-radius:12px;overflow:hidden;background:var(--bg);color:var(--ink);transition:background-color 420ms ease,color 420ms ease;box-shadow:0 0 0 1px rgba(255,255,255,.08)}
.tp-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--brand);color:var(--on);transition:background-color 420ms ease,color 420ms ease}
.tp-logo{font-family:var(--serif);font-weight:800;font-size:18px}
.tp-links{display:flex;gap:12px;font-size:13px;font-weight:700;opacity:.9}
.tp-body{padding:20px 18px 22px}
.tp-h{margin:0;font-family:var(--serif);font-size:26px;line-height:1.05}
.tp-p{margin:8px 0 14px;font-size:14.5px;opacity:.8}
.tp-btn{display:inline-flex;padding:9px 16px 7px;border-radius:8px;background:var(--accent);color:var(--onaccent);font-weight:900;font-size:14px;transition:background-color 420ms ease,color 420ms ease}
.tp-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:16px}
.tp-card{height:46px;border-radius:8px;background:var(--brand);opacity:.16;transition:background-color 420ms ease}

.pnext{padding-bottom:clamp(72px,8vw,110px)}
.pexit{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:26px;align-items:center;margin:20px 0 0;padding:30px 34px;border-radius:16px;background:#1F7A4D;box-shadow:inset 0 0 0 6px #1F7A4D,inset 0 0 0 10px #FFFFFF;color:#FFFFFF;text-decoration:none;transition:transform 200ms var(--ease-out),filter 150ms ease}
.pexit:active{transform:scale(.99)}
@media (hover:hover){.pexit:hover{color:#FFFFFF;filter:brightness(1.08)}}
.pexit-n{display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:54px;padding-top:4px;border-radius:7px;background:#000;border:3px solid #FFFFFF;font-weight:900;font-size:22px}
.pexit-t{display:block;font-weight:900;font-size:clamp(26px,3vw,40px);line-height:1.05}
.pexit-s{display:block;margin-top:6px;font-weight:600;font-size:16px;color:#E3F1E9}
.pexit-a{font-weight:900;font-size:44px;line-height:1}
.alt{margin:16px 0 0;font-size:16px;color:#C9CED4}
.alt a{color:#FFFFFF}
@media (hover:hover){.alt a:hover{color:#FFB21A}}
.pfine{margin:28px 0 0;max-width:46em;font-size:13px;line-height:1.5;color:#9AA1AA}

@media (max-width:1000px){
  .bk{grid-template-columns:minmax(0,1fr)}
  .ticket{position:relative;top:auto}
}
@media (max-width:860px){
  .bays{grid-template-columns:minmax(0,1fr)}
  .svc{grid-template-columns:minmax(0,1fr)}
  .svc-h{border-right:0;border-bottom:2px solid rgba(255,255,255,.75);padding:0 0 14px}
  .ba-new{grid-template-columns:minmax(0,1fr)}
  .n-art{display:none}
}
@media (max-width:700px){
  .pwrap{padding-inline:16px}
  .bay-head{grid-template-columns:auto minmax(0,1fr);padding:18px 18px 16px}
  .bay-head .tag{grid-column:2;justify-self:start}
  .demo{padding:18px}
  .bay-note{padding:12px 18px 16px}
  .days{grid-template-columns:repeat(3,minmax(0,1fr))}
  .slots{grid-template-columns:repeat(3,minmax(0,1fr))}
  .pexit{grid-template-columns:minmax(0,1fr);padding:26px 22px;gap:14px}
  .pexit-a{display:none}
  .ba-old .o-box{display:none}
}
@media (prefers-reduced-motion:reduce){
  .booked{animation:none}
  .ba-old .o-marq-in,.n-steam,.lamp.open{animation:none}
  .mi,.qt-fill,.th-prev,.tp-bar,.tp-btn,.tp-card{transition:none}
}
`
