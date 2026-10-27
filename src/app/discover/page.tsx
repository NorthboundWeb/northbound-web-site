import type { Metadata } from 'next'
import Link from 'next/link'
import { Arrival } from '@/components/arrival'
import { DiscoverGantries } from '@/components/discover-gantries'
import { fits } from '@/lib/discover'
import { ADVANCED_MANAGEMENT_PRICE } from '@/lib/services'
import { currency } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Discover — three ways to get a website',
  description:
    'A template you build yourself, an agency build, or a Northbound build: compared on speed, design, features and price.',
  alternates: { canonical: '/discover' },
}

export default function DiscoverPage() {
  return (
    <div className="disc">
      <Arrival plate="Junction 2" />

      <div className="settle">
        <section className="dwrap dhero">
          <span className="kicker drise">Junction 2 · Discover</span>
          <h1 className="dh1 drise" style={{ animationDelay: '80ms' }}>
            Three ways to get a website. Read the signs.
          </h1>
          <p className="dlede drise" style={{ animationDelay: '160ms' }}>
            A template you build yourself, an agency build, or a Northbound build.
            Open each gantry to see how they compare on speed, design, features and
            price. The template column gets its due where it wins.
          </p>
          <Link className="dback drise" href="/" style={{ animationDelay: '300ms' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back on the motorway
          </Link>
          <div className="dlegend drise" style={{ animationDelay: '240ms' }}>
            <span>
              <i style={{ background: '#1D4F91' }} />
              Template site
            </span>
            <span>
              <i style={{ background: '#0B6B3A' }} />
              Agency site
            </span>
            <span>
              <i style={{ background: '#000', boxShadow: 'inset 0 0 0 2px #FFB21A' }} />
              Northbound site
            </span>
          </div>
        </section>

        <section className="dwrap" aria-label="Compare the three options">
          <DiscoverGantries />

          <div className="dfit" aria-label="Which one fits">
            {fits.map((f) => (
              <div key={f.title}>
                <h2>{f.title}</h2>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dwrap dsec dend" aria-label="Next exit: management plans">
          <Link className="dexit" href="/#prices">
            <svg viewBox="0 0 96 96" width="84" height="84" aria-hidden>
              <path d="M43 81V44L24 63 14 53 48 19l34 34-10 10-19-19v37z" fill="#FFFFFF" transform="rotate(45 48 50)" />
            </svg>
            <span className="dexit-txt">
              Next exit: looked after.
              <span className="dexit-sub">
                Management plans from {currency.format(ADVANCED_MANAGEMENT_PRICE)} a
                month, hosting included. Pay annually and get twelve months for the
                price of ten.
              </span>
            </span>
            <span className="dfree">
              <b>1st</b>
              <span>month free</span>
            </span>
          </Link>
          <p className="dsmall">
            The free month does not turn into a paid plan on its own — when it ends,
            you decide. Safety and security fixes never count against your update
            hours. Plans are optional and not a condition of the build.
          </p>
        </section>
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.disc{--spring-soft:cubic-bezier(.22,1,.36,1);--spring-snap:cubic-bezier(.34,1.56,.64,1);font-size:18px;line-height:1.55;overflow-x:clip}
@supports (transition-timing-function: linear(0, 1)){
  .disc{--spring-soft:linear(0, 0.030 2.5%, 0.106 5%, 0.210 7.5%, 0.325 10%, 0.443 12.5%, 0.556 15%, 0.658 17.5%, 0.748 20%, 0.824 22.5%, 0.886 25%, 0.935 27.5%, 0.972 30%, 0.999 32.5%, 1.018 35%, 1.030 37.5%, 1.036 40%, 1.038 42.5%, 1.038 45%, 1.035 47.5%, 1.031 50%, 1.027 52.5%, 1.022 55%, 1.018 57.5%, 1.014 60%, 1.010 62.5%, 1.007 65%, 1.005 67.5%, 1.003 70%, 1.001 72.5%, 1);--spring-snap:linear(0, 0.057 2.5%, 0.198 5%, 0.383 7.5%, 0.579 10%, 0.760 12.5%, 0.913 15%, 1.029 17.5%, 1.106 20%, 1.149 22.5%, 1.163 25%, 1.155 27.5%, 1.133 30%, 1.103 32.5%, 1.071 35%, 1.041 37.5%, 1.016 40%, 0.997 42.5%, 0.983 45%, 0.976 47.5%, 0.973 50%, 0.975 52.5%, 0.978 55%, 0.983 57.5%, 0.988 60%, 0.993 62.5%, 0.997 65%, 1.000 67.5%, 1.003 70%, 1.004 75%, 1.002 85%, 1)}
}
.dwrap{max-width:1320px;margin-inline:auto;padding-inline:40px;box-sizing:border-box}
.dhero{padding-top:clamp(40px,6vw,72px);padding-bottom:clamp(40px,6vw,64px)}
.dh1{margin:18px 0 0;font-weight:900;font-size:clamp(42px,6.4vw,84px);line-height:.98;letter-spacing:-.025em;max-width:13em}
.dlede{margin:22px 0 0;max-width:36em;font-size:clamp(18px,1.5vw,21px);color:#C9CED4;text-wrap:wrap}
.drise{animation:d-rise 760ms var(--spring-soft) both}
@keyframes d-rise{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
.dback{display:inline-flex;align-items:center;gap:10px;margin-top:26px;font-weight:700;font-size:15px;color:#D5D9DE;text-decoration:none}
.dback svg{width:18px;height:18px}
@media (hover:hover){.dback:hover{color:#FFB21A}}
.dlegend{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:28px;font-size:14px;color:#9AA1AA}
.dlegend span{display:inline-flex;align-items:center;gap:8px}
.dlegend i{display:block;width:14px;height:14px;border-radius:3px}

.gantries{display:flex;flex-direction:column;gap:clamp(28px,4vw,48px);padding-top:8px}
.dg{position:relative;isolation:isolate;animation:d-arrive 1100ms var(--spring-soft) both;transform-origin:50% 0}
.dg:nth-child(2){animation-delay:120ms}
.dg:nth-child(3){animation-delay:240ms}
@keyframes d-arrive{from{opacity:0;transform:translateY(-12px) scale(.9)}to{opacity:1;transform:none}}
.dg-beam{height:16px;border-radius:2px;background:repeating-linear-gradient(135deg,#3B4048 0 10px,#30343B 10px 20px)}
.dg-post{position:absolute;top:0;width:16px;background:linear-gradient(90deg,#2E3238,#43484F 45%,#2A2E33);z-index:-1;transition:height 520ms var(--ease-out)}
.dg-post.l{left:0}.dg-post.r{right:0}
.dg-sign{position:relative;margin:36px 34px 0;border-radius:14px;overflow:hidden;background:#1D4F91;color:#FFFFFF;transform-origin:50% -36px;animation:var(--swayK,d-swayA) var(--swayT,6s) ease-in-out var(--swayD,0s) infinite;box-shadow:inset 0 0 0 6px #1D4F91,inset 0 0 0 10px #FFFFFF,0 22px 40px -14px rgba(0,0,0,.85);transition:background-color 320ms ease,box-shadow 320ms ease}
.dg-sign::before,.dg-sign::after{content:"";position:absolute;top:-36px;width:4px;height:36px;background:linear-gradient(#6b717a,#3b4048);box-shadow:0 0 0 1px rgba(0,0,0,.5)}
.dg-sign::before{left:12%}.dg-sign::after{right:12%}
.dg-sign.green{background:#0B6B3A;box-shadow:inset 0 0 0 6px #0B6B3A,inset 0 0 0 10px #FFFFFF,0 22px 40px -14px rgba(0,0,0,.85)}
.dg-sign.nb{background:#000000;box-shadow:inset 0 0 0 6px #000000,inset 0 0 0 10px #FFB21A,0 22px 40px -14px rgba(0,0,0,.85)}
.dg:nth-child(1) .dg-sign{--swayK:d-swayA;--swayT:6.2s;--swayD:-1s}
.dg:nth-child(2) .dg-sign{--swayK:d-swayB;--swayT:7.1s;--swayD:-3.4s}
.dg:nth-child(3) .dg-sign{--swayK:d-swayC;--swayT:8.3s;--swayD:-.6s}
@keyframes d-swayA{0%,100%{transform:rotate(-.5deg)}50%{transform:rotate(.5deg)}}
@keyframes d-swayB{0%,100%{transform:rotate(.45deg)}50%{transform:rotate(-.45deg)}}
@keyframes d-swayC{0%,100%{transform:rotate(-.2deg)}33%{transform:rotate(.55deg)}66%{transform:rotate(-.5deg)}}
.dg-sign.is-open{animation:none;transform:none}
.dg-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:22px;width:100%;padding:28px 34px 24px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}
.dg-head:focus-visible{outline:3px solid #FFB21A;outline-offset:-14px;border-radius:12px}
.dg-shield{box-sizing:content-box;display:inline-flex;align-items:center;justify-content:center;min-width:64px;padding:10px 12px 6px;border-radius:7px;box-shadow:inset 0 0 0 3px #FFFFFF;font-weight:900;font-size:24px;line-height:1;letter-spacing:.02em}
.dg-sign.nb .dg-shield{box-shadow:inset 0 0 0 3px #FFB21A;color:#FFB21A}
.dg-title{display:flex;flex-direction:column;gap:4px;min-width:0}
.dg-title b{font-weight:900;font-size:clamp(24px,3.2vw,40px);line-height:1;letter-spacing:-.015em}
.dg-title > span{font-weight:600;font-size:15px;line-height:1.4;color:#E3ECF8}
.dg-sign.nb .dg-title > span{color:#E6EBF2}
.dg-chev{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.1);transition:transform 560ms var(--spring-snap),background-color 150ms ease}
.dg-chev svg{width:22px;height:22px;transition:transform 520ms var(--spring-snap)}
.dg-head[aria-expanded="true"] .dg-chev svg{transform:rotate(180deg)}
.dg-head:active .dg-chev{transform:scale(.92)}
@media (hover:hover){.dg-head:hover .dg-chev{background:rgba(255,255,255,.18)}}
.dg-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows 620ms var(--spring-soft)}
.dg-panel.open{grid-template-rows:1fr}
.dg-panel-in{min-height:0;overflow:hidden}
.dg-panel-body{padding:0 34px 34px;opacity:0;transform:translateY(-6px);transition:opacity 260ms ease,transform 420ms var(--ease-out)}
.dg-panel.open .dg-panel-body{opacity:1;transform:none;transition-delay:120ms}
.dg-rule{height:3px;background:rgba(255,255,255,.9);margin:0 0 6px}
.dg-sign.nb .dg-rule{background:#FFB21A}
.dg-rows{margin:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 24px}
.dg-rows > div{display:flex;flex-direction:column;gap:8px;padding:22px 0 18px;border-top:2px dashed rgba(255,255,255,.35)}
.dg-rows > div:nth-child(-n+4){border-top:0}
.dg-rows dt{display:flex;align-items:center;gap:10px;font-weight:900;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#DCE6F2}
.dg-sign.nb .dg-rows dt{color:#FFB21A}
.dg-rows dt svg{width:18px;height:18px;flex:none}
.dg-rows dd{margin:0}
.dg-big{font-weight:900;font-size:clamp(26px,3vw,40px);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.dg-big small{font-size:.5em;font-weight:700;margin-left:6px;letter-spacing:0}
.dg-note{display:block;margin-top:8px;font-size:15.5px;font-weight:500;line-height:1.5;color:#F1F5FA}
.dg-verdict{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 20px;margin-top:22px;padding:16px 18px 13px;border-radius:8px;background:rgba(0,0,0,.22);font-size:15px}
.dg-sign.nb .dg-verdict{background:rgba(255,178,26,.12)}
.dg-verdict b{font-weight:800}
.dg-verdict a{font-weight:800;color:#FFB21A;text-decoration:none;border-bottom:2px solid #FFB21A;padding-bottom:1px}
@media (hover:hover){.dg-verdict a:hover{color:#FFFFFF;border-color:#FFFFFF}}

.dfit{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:clamp(56px,7vw,88px)}
.dfit div{padding:22px 24px 20px;border-radius:12px;border:2px solid #2B2F35}
.dfit h2{margin:0;font-weight:800;font-size:18px}
.dfit p{margin:8px 0 0;font-size:15px;color:#C9CED4}

.dsec{padding-top:clamp(80px,9vw,120px)}
.dend{padding-bottom:clamp(96px,10vw,140px)}
.dexit{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:36px;align-items:center;padding:44px 52px 40px;border-radius:16px;background:#1D4F91;box-shadow:inset 0 0 0 7px #1D4F91,inset 0 0 0 11px #FFFFFF;color:#FFFFFF;text-decoration:none;transition:transform 200ms var(--ease-out),filter 150ms ease}
.dexit:active{transform:scale(.985);transition-duration:90ms}
@media (hover:hover){.dexit:hover{color:#FFFFFF;filter:brightness(1.1)}}
.dexit-txt{font-weight:900;font-size:clamp(34px,4.6vw,66px);line-height:.98;letter-spacing:-.02em}
.dexit-sub{display:block;margin-top:12px;font-weight:600;font-size:17px;line-height:1.45;color:#E6EBF2;letter-spacing:0;max-width:34em}
.dfree{box-sizing:content-box;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;min-width:150px;padding:18px 18px 14px;border-radius:10px;background:#FFB21A;color:#121417;text-align:center}
.dfree b{font-weight:900;font-size:44px;line-height:1;letter-spacing:-.03em}
.dfree span{font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-top:4px}
.dsmall{margin:18px 0 0;max-width:46em;font-size:14px;color:#9AA1AA}

@media (max-width:980px){
  .dg-rows{grid-template-columns:repeat(2,minmax(0,1fr))}
  .dg-rows > div:nth-child(-n+4){border-top:2px dashed rgba(255,255,255,.35)}
  .dg-rows > div:nth-child(-n+2){border-top:0}
  .dfit{grid-template-columns:minmax(0,1fr)}
  .dexit{grid-template-columns:auto minmax(0,1fr)}
  .dexit .dfree{grid-column:1/-1;justify-self:start}
}
@media (max-width:640px){
  .dwrap{padding-inline:18px}
  .dg-sign{margin:36px 10px 0}
  .dg-post{display:none}
  .dg-head{grid-template-columns:auto minmax(0,1fr);gap:14px;padding:20px 18px 16px}
  .dg-head .dg-chev{grid-column:2;justify-self:end;grid-row:1}
  .dg-head .dg-title{grid-column:1/-1}
  .dg-shield{min-width:52px;font-size:19px;padding:8px 10px 5px}
  .dg-panel-body{padding:0 18px 22px}
  .dg-rows{grid-template-columns:minmax(0,1fr)}
  .dg-rows > div:nth-child(-n+2){border-top:2px dashed rgba(255,255,255,.35)}
  .dg-rows > div:first-child{border-top:0}
  .dexit{grid-template-columns:minmax(0,1fr);padding:30px 24px 26px;gap:22px}
  .dexit svg{display:none}
}
@media (prefers-reduced-motion:reduce){
  .dg-sign{animation:none}
  .dg,.drise{animation:d-fade 300ms ease both}
  .dg-panel{transition:none}
  .dg-panel-body{transition:opacity 200ms ease;transform:none}
  .dg-chev,.dg-chev svg{transition:none}
}
@keyframes d-fade{from{opacity:0}to{opacity:1}}
`
