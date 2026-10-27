import Link from 'next/link'
import { Gantry } from '@/components/gantry'
import { currency, site } from '@/lib/site'
import {
  ADVANCED_MANAGEMENT_PRICE,
  TIMELINE_TERMS,
  buildPackages,
  junctions,
  managementPlans,
} from '@/lib/services'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    areaServed: site.location,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website packages',
      itemListElement: buildPackages.map((pkg) => ({
        '@type': 'Offer',
        name: pkg.name,
        price: pkg.price,
        priceCurrency: 'GBP',
        description: pkg.summary,
      })),
    },
  }

  return (
    <div className="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Gantry />

      {/* ── Prices: a distance sign ─────────────────────────────── */}
      <section className="sec" id="prices" aria-labelledby="prices-h">
        <div className="wrap">
          <div className="sign-b big">
            <div className="sign-top">
              <span className="shield" aria-hidden>
                NB
              </span>
              <h2 className="h2" id="prices-h">
                Fixed prices
              </h2>
            </div>
            <dl className="dist">
              {buildPackages.map((pkg) => (
                <div key={pkg.slug}>
                  <dt>{pkg.name}</dt>
                  <dd>
                    {pkg.variable ? <small>from</small> : null}
                    {currency.format(pkg.price)}
                  </dd>
                </div>
              ))}
              <div className="split">
                <dt>Management</dt>
                <dd>
                  <small>from</small>
                  {currency.format(ADVANCED_MANAGEMENT_PRICE)}
                  <span className="after">/month</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="detail">
            {buildPackages.map((pkg) => (
              <div className="pk" key={pkg.slug}>
                <h3>{pkg.name}</h3>
                <ul>
                  {pkg.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="time">{pkg.timeline}</p>
                <Link className="pk-go" href={`/contact?package=${pkg.enquiryParam}`}>
                  {pkg.cta} <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
          <p className="terms">
            Half to start, and half once it is complete and approved, before it
            goes live. {TIMELINE_TERMS} Hosting, domains and provider fees are
            separate. <Link href="/services">Everything each package includes</Link>.
          </p>

          <div className="sign-b care">
            <div>
              <h3>Looked after, every month</h3>
              <p>
                Management from {currency.format(ADVANCED_MANAGEMENT_PRICE)} a
                month, with hosting included while it&apos;s active. It is
                optional, and not a condition of the build. Your first month is
                free and does not turn into a paid plan by itself. Pay annually
                and get twelve months for the price of ten.
              </p>
            </div>
            <dl>
              {managementPlans.map((plan) => (
                <div key={plan.slug}>
                  <dt>{plan.name}</dt>
                  <dd>{plan.changeTimeShort}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="terms">
            Unused update time does not roll over to the next month, and safety
            and security fixes never count against it.
          </p>
        </div>
      </section>

      {/* ── How it works: the route ─────────────────────────────── */}
      <section className="sec" id="how" aria-labelledby="how-h">
        <div className="wrap route-sec">
          <h2 className="h2" id="how-h">
            Three junctions to a live site.
          </h2>
          <ol className="route">
            {junctions.map((j) => (
              <li key={j.code}>
                <span className="jn">{j.code}</span>
                <h3>{j.title}</h3>
                <p>{j.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── The exit ────────────────────────────────────────────── */}
      <section className="sec end" id="start" aria-label="Start a project">
        <div className="wrap">
          <Link className="sign-b exit" href="/contact">
            <svg viewBox="0 0 96 96" width="96" height="96" aria-hidden>
              <path
                d="M43 81V44L24 63 14 53 48 19l34 34-10 10-19-19v37z"
                fill="#FFFFFF"
                transform="rotate(45 48 50)"
              />
            </svg>
            <span className="exit-txt">
              Start a project
              <span className="exit-sub">
                Tell us what your business needs a website to do. We&apos;ll reply
                with a price before anything starts.
              </span>
            </span>
          </Link>
        </div>
      </section>

      <style>{css}</style>
    </div>
  )
}

const css = `
.home{font-size:18px;line-height:1.55}
.home .wrap{max-width:1320px;margin-inline:auto;padding-inline:40px;box-sizing:border-box}
.home .sec{padding-top:clamp(96px,10vw,140px);scroll-margin-top:24px}
.home .h2{text-wrap:wrap;margin:0;font-weight:900;font-size:clamp(34px,4.2vw,56px);line-height:1;letter-spacing:-.02em}
.sign-b{background:#1D4F91;border-radius:16px;box-shadow:inset 0 0 0 7px #1D4F91,inset 0 0 0 11px #FFFFFF;color:#FFFFFF}
.home .big{padding:44px 52px 40px}
.sign-top{display:flex;align-items:center;gap:20px;padding-bottom:22px;margin-bottom:8px;border-bottom:3px solid rgba(255,255,255,.9)}
.shield{display:inline-flex;align-items:center;padding:8px 14px 4px;background:#1D4F91;border-radius:6px;box-shadow:inset 0 0 0 3px #FFFFFF;font-weight:900;font-size:26px;line-height:1}
.dist{margin:0}
.dist div{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 24px;padding:14px 0 10px}
.dist dt{font-weight:800;font-size:clamp(26px,3.4vw,46px);line-height:1}
.dist dd{margin:0 0 0 auto;display:inline-flex;flex-wrap:wrap;align-items:baseline;justify-content:flex-end;gap:0 8px;font-weight:900;font-size:clamp(30px,4vw,56px);line-height:1;font-variant-numeric:tabular-nums;text-align:right}
.dist small{font-size:.42em;font-weight:700}
.dist .after{font-size:.38em;font-weight:700;white-space:nowrap}
.dist .split{border-top:3px dashed rgba(255,255,255,.55);margin-top:10px;padding-top:22px}
.detail{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:40px}
.pk{display:flex;flex-direction:column}
.pk h3{align-self:flex-start;margin:0 0 14px;display:inline-flex;padding:6px 12px 2px;background:#1D4F91;border-radius:5px;box-shadow:inset 0 0 0 2px #FFFFFF;font-weight:800;font-size:18px}
.pk ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;font-size:16px;line-height:1.45;color:#D5D9DE}
.pk li{padding-left:20px;position:relative}
.pk li::before{content:"";position:absolute;left:0;top:.5em;width:10px;height:4px;background:#FFB21A;border-radius:1px}
.pk .time{margin:14px 0 0;font-size:14px;color:#9AA1AA}
.pk-go{align-self:flex-start;margin-top:14px;font-weight:800;font-size:15px;color:#FFFFFF;text-decoration:none;border-bottom:2px solid rgba(255,178,26,.6);padding-top:2px;transition:color 150ms ease,border-color 150ms ease}
@media (hover:hover){.pk-go:hover{color:#FFB21A;border-color:#FFB21A}}
.home .terms{margin:32px 0 0;max-width:48em;font-size:14px;line-height:1.55;color:#9AA1AA}
.home .terms a{color:#D5D9DE;text-decoration:underline;text-underline-offset:3px}
@media (hover:hover){.home .terms a:hover{color:#FFB21A}}
.care{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:40px;align-items:center;margin-top:72px;padding:40px 48px}
.care h3{margin:0;font-weight:900;font-size:32px;line-height:1.05}
.care p{margin:12px 0 0;font-size:17px;color:#E6EBF2}
.care dl{margin:0}
.care dl div{display:flex;justify-content:space-between;gap:20px;padding:12px 0 8px;border-bottom:2px solid rgba(255,255,255,.35)}
.care dl div:last-child{border-bottom:0}
.care dt{font-weight:800}
.care dd{margin:0;color:#E6EBF2;text-align:right}
.route-sec{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.route{position:relative;margin:0;padding:6px 0 6px 92px;list-style:none;display:flex;flex-direction:column;gap:44px}
.route::before{content:"";position:absolute;left:30px;top:0;bottom:0;width:16px;background:#3B4048;border-radius:3px}
.route::after{content:"";position:absolute;left:37px;top:0;bottom:0;width:2px;background:repeating-linear-gradient(to bottom,#FFFFFF 0 14px,transparent 14px 30px)}
.route li{position:relative}
.jn{box-sizing:content-box;position:absolute;left:-92px;top:2px;z-index:1;display:inline-flex;align-items:center;justify-content:center;min-width:52px;padding:7px 8px 3px;background:#000000;color:#FFFFFF;border:3px solid #FFFFFF;border-radius:4px;font-weight:900;font-size:18px;line-height:1}
.route h3{margin:0;font-weight:800;font-size:24px;line-height:1.15}
.route p{margin:8px 0 0;font-size:17px;color:#C9CED4}
.exit{display:grid;grid-template-columns:auto minmax(0,1fr);gap:36px;align-items:center;padding:48px 56px 44px;text-decoration:none;transition:transform 200ms var(--ease-out),filter 150ms ease}
.exit:active{transform:scale(.985);transition-duration:90ms}
@media (hover:hover){.exit:hover{color:#FFFFFF;filter:brightness(1.1)}}
.exit-txt{font-weight:900;font-size:clamp(38px,5vw,72px);line-height:.98;letter-spacing:-.02em}
.exit-sub{display:block;margin-top:14px;font-weight:600;font-size:18px;line-height:1.45;color:#E6EBF2;letter-spacing:0}
.home .end{padding-bottom:clamp(96px,10vw,140px)}
@media (max-width:980px){
  .route-sec,.care{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .home .wrap{padding-inline:18px}
  .home .big{padding:28px 22px 24px}
  .sign-top{gap:14px;padding-bottom:16px}
  .shield{font-size:20px;padding:7px 10px 3px}
  .dist dd{width:100%;justify-content:flex-start;margin-left:0;text-align:left}
  .detail{grid-template-columns:minmax(0,1fr)}
  .exit{grid-template-columns:minmax(0,1fr);padding:36px 30px}
  .care{padding:32px 28px}
}
`
