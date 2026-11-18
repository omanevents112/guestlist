// Generates /thursday-takeover/index.html (EN), /thursday-takeover/ar/index.html (AR) and the .ics files.
// Run: node tools/build-thursday-takeover.mjs   (from the repo root). No dependencies.
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "https://omanevents112.github.io/guestlist/thursday-takeover/";
const GUESTLIST = "https://omanevents112.github.io/guestlist/";
const WA = "https://wa.me/96897773122";
const IMG = "/guestlist/thursday-takeover/img/";
const OG = BASE + "img/og-1200x630.jpg";
const START_UTC = "20261119T190000Z"; // 11 PM Muscat (UTC+4)
const END_UTC = "20261119T230000Z";
const DESK = "+968 9777 3122";

const L = {
  en: {
    dir: "ltr", lang: "en", url: BASE, otherUrl: BASE + "ar/", ics: "thursday-takeover.ics",
    title: "THURSDAY TAKEOVER — Thu 19 Nov 2026 · Le Blue Muscat | Oman Events",
    desc: "THURSDAY TAKEOVER at Le Blue Muscat, Qurum Resort. Thursday 19 Nov 2026, 11 PM till late. SADO, POOYA & KRAZY on the decks, MC CHYDON on the mic, MARALNI on live drums. Join the guest list.",
    ogLocale: "en_US", ogAlt: "Flyer: THURSDAY TAKEOVER at Le Blue Muscat, Qurum Resort. 19 November 2026, 11 PM till late.",
    brand: "OMAN EVENTS", brandSub: "Live Entertainment",
    kicker: "Le Blue Muscat · Qurum Resort",
    dayName: "Thursday", monthYear: "November 2026", time: "11 PM till late",
    join: "Join the guest list", wa: "WhatsApp",
    posterAlt: "Flyer for THURSDAY TAKEOVER at Le Blue Muscat. 19 November 2026, 11 PM till late, Qurum Resort. SADO, POOYA and KRAZY, MC Chydon and Maralni on drums.",
    lineupH: "Lineup", tagline: "Good music. Better nights.",
    acts: [["SADO, POOYA & KRAZY", "On the decks"], ["MC CHYDON", "On the mic"], ["MARALNI", "On live drums"]],
    detailsH: "The details",
    facts: [["When", "Thursday 19 Nov 2026, 11 PM till late"], ["Where", "Le Blue Muscat, Qurum Resort"], ["Entry", "Valid ID required. Entry subject to the venue's rules."], ["Enquiries", "WhatsApp {DESK}"]],
    finalH: "Get on the guest list.", finalP: "Add your name online, or message us on WhatsApp.",
    calLead: "Add to calendar", calGoogle: "Google Calendar", calIcs: "Apple / Outlook (.ics)",
    footer: "Questions: WhatsApp {DESK}", langLabel: "Language", toggleOther: "عربي", toggleOtherLang: "ar", toggleSelf: "EN",
    calTitle: "THURSDAY TAKEOVER \u2014 Oman Events", calLoc: "Le Blue Muscat, Qurum Resort, Muscat",
    calDesc: "Lineup: SADO, POOYA & KRAZY (decks), MC CHYDON (mic), MARALNI (live drums)\nGuest list: " + GUESTLIST,
    gl: GUESTLIST
  },
  ar: {
    dir: "rtl", lang: "ar", url: BASE + "ar/", otherUrl: BASE, ics: "../thursday-takeover-ar.ics",
    title: "THURSDAY TAKEOVER — الخميس 19 نوفمبر 2026 · Le Blue Muscat | عمان إيفنتس",
    desc: "THURSDAY TAKEOVER في Le Blue Muscat، منتجع القرم. الخميس 19 نوفمبر 2026، من ١١ مساءً حتى وقت متأخر. SADO وPOOYA وKRAZY على الديكس، وMC CHYDON على المايك، وMARALNI على الدرامز لايف. سجّل اسمك على قائمة الضيوف.",
    ogLocale: "ar_AR", ogAlt: "فلاير THURSDAY TAKEOVER في Le Blue Muscat، منتجع القرم. 19 نوفمبر 2026، من ١١ مساءً حتى وقت متأخر.",
    brand: "OMAN EVENTS", brandSub: "Live Entertainment",
    kicker: "Le Blue Muscat · منتجع القرم",
    dayName: "الخميس", monthYear: "نوفمبر 2026", time: "من ١١ مساءً حتى وقت متأخر",
    join: "انضم إلى قائمة الضيوف", wa: "واتساب",
    posterAlt: "فلاير THURSDAY TAKEOVER في Le Blue Muscat. 19 نوفمبر 2026، من ١١ مساءً حتى وقت متأخر، منتجع القرم. SADO وPOOYA وKRAZY وMC Chydon وMaralni على الدرامز.",
    lineupH: "اللاين أب", tagline: "موسيقى جيدة. ليالٍ أفضل.",
    acts: [["SADO, POOYA & KRAZY", "على الديكس"], ["MC CHYDON", "على المايك"], ["MARALNI", "على الدرامز لايف"]],
    detailsH: "التفاصيل",
    facts: [["متى", "الخميس 19 نوفمبر 2026، من ١١ مساءً حتى وقت متأخر"], ["أين", "Le Blue Muscat، منتجع القرم"], ["الدخول", "إثبات هوية ساري مطلوب. الدخول يخضع لشروط المكان."], ["للاستفسار", "واتساب {DESK}"]],
    finalH: "سجّل اسمك على قائمة الضيوف.", finalP: "سجّل اسمك أونلاين، أو راسلنا على واتساب.",
    calLead: "أضف إلى التقويم", calGoogle: "تقويم Google", calIcs: "Apple / Outlook (.ics)",
    footer: "للاستفسار: واتساب {DESK}", langLabel: "اللغة", toggleOther: "EN", toggleOtherLang: "en", toggleSelf: "عربي",
    calTitle: "THURSDAY TAKEOVER \u2014 عمان إيفنتس", calLoc: "Le Blue Muscat، منتجع القرم، مسقط",
    calDesc: "اللاين أب: SADO، POOYA & KRAZY (ديكس)، MC CHYDON (مايك)، MARALNI (درامز لايف)\nقائمة الضيوف: " + GUESTLIST,
    gl: GUESTLIST
  }
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const desk = (s) => esc(s).replace("{DESK}", `<bdi dir="ltr">${DESK}</bdi>`);

const CSS = `
:root{
  --bg:oklch(0.12 0.004 285);
  --band:oklch(0.17 0.004 285);
  --line:oklch(0.80 0.01 285 / 0.2);
  --text:oklch(0.96 0.004 285);
  --silver:oklch(0.80 0.01 285);
  --chrome:oklch(0.70 0.01 285);
  --gold:oklch(0.78 0.13 88);
  --gold-ink:oklch(0.16 0.02 88);
  --crimson-floor:oklch(0.28 0.10 12 / 0.35);
  --serif:"Cormorant Garamond","Times New Roman",serif;
  --sans:Tajawal,"Segoe UI",system-ui,sans-serif;
  --d:1;
}
html[dir="rtl"]{--d:-1}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg);color:var(--text);scroll-behavior:auto}
body{font-family:var(--sans);font-size:1rem;line-height:1.6;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;
  background:radial-gradient(900px 420px at 80% -8%,oklch(0.30 0.05 88 / 0.35),transparent 70%),var(--bg)}
a{color:inherit}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.wrap{width:min(72rem,calc(100% - 2.5rem));margin:0 auto}
header.top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 0 .5rem}
.brand{display:flex;align-items:center;gap:.75rem;text-decoration:none;min-height:44px}
.brand svg{width:42px;height:42px;flex:none}
.brand-name{display:block;font-family:var(--serif);font-weight:600;letter-spacing:.18em;font-size:.85rem;color:var(--gold)}
.brand-sub{display:block;font-size:.7rem;letter-spacing:.16em;color:var(--silver)}
.lang{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px;gap:2px}
.lang a{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0 .8rem;border-radius:999px;font-size:.8rem;letter-spacing:.06em;text-decoration:none;color:var(--chrome);transition:background-color 140ms ease-out,color 140ms ease-out}
.lang a[aria-current="true"]{background:var(--silver);color:var(--bg);font-weight:700}
.lang a:hover:not([aria-current="true"]){color:var(--text)}

.hero{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem;padding:1.75rem 0 2.5rem}
.kicker{color:var(--silver);font-size:.95rem;letter-spacing:.04em}
h1{font-family:var(--serif);font-weight:700;text-transform:uppercase;line-height:.92;letter-spacing:.01em;font-size:clamp(2.7rem,12.5vw,5.5rem);margin:.6rem 0 1.4rem}
h1 span{display:block}
h1 .gold{color:var(--gold)}
html[dir="rtl"] h1{direction:ltr;text-align:right}
.when{display:flex;align-items:center;gap:1rem;margin-bottom:1.6rem;position:relative;z-index:3}
.day{font-family:var(--serif);font-weight:600;font-size:clamp(4.5rem,20vw,6rem);line-height:.85;color:var(--gold);padding-inline-end:1rem;border-inline-end:1px solid var(--line)}
.when-text{display:flex;flex-direction:column;gap:.1rem;font-size:1.15rem;color:var(--text)}
.when-text .time{color:var(--silver);font-size:1.05rem}
.cta{display:flex;flex-wrap:wrap;gap:.75rem}
@media (max-width:560px){.hero .cta .btn,.final .cta:first-of-type .btn{flex:1 1 100%}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 1.5rem;border-radius:999px;font-weight:700;font-size:1rem;text-decoration:none;border:1px solid var(--line);color:var(--text);transition:background-color 140ms ease-out,color 140ms ease-out,border-color 140ms ease-out,opacity 140ms ease-out}
.btn:hover{border-color:var(--silver);background:oklch(1 0 0 / 0.06)}
.btn.primary{background:var(--gold);color:var(--gold-ink);border-color:var(--gold);box-shadow:inset 0 1px 0 oklch(1 0 0 / 0.45)}
.btn.primary:hover{background:oklch(0.84 0.12 88);border-color:oklch(0.84 0.12 88)}
.btn.small{min-height:48px;font-weight:500;font-size:.95rem}

.poster{position:relative;margin:-1.1rem 0 0;z-index:1;justify-self:center;width:min(100%,26rem);border:1px solid oklch(0.78 0.13 88 / 0.4);border-radius:6px;overflow:hidden;background:var(--band);
  box-shadow:0 40px 60px -30px oklch(0 0 0 / 0.9),0 60px 90px -40px var(--crimson-floor)}
.poster img{display:block;width:100%;height:auto;aspect-ratio:1086/1448}
.poster::after{content:"";position:absolute;inset:-10% auto -10% 0;width:30%;pointer-events:none;
  background:linear-gradient(100deg,transparent,oklch(1 0 0 / 0.26) 50%,transparent);
  transform:translateX(calc(var(--d) * -160%)) skewX(-16deg);opacity:0;animation:sweep 1400ms ease-out 700ms both}
@keyframes sweep{0%{opacity:0;transform:translateX(calc(var(--d) * -160%)) skewX(-16deg)}15%{opacity:1}100%{opacity:0;transform:translateX(calc(var(--d) * 460%)) skewX(-16deg)}}

.hero-copy>*{animation:rise 500ms ease-out both}
.hero-copy>:nth-child(2){animation-delay:60ms}.hero-copy>:nth-child(3){animation-delay:120ms}.hero-copy>:nth-child(4){animation-delay:180ms}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

section.band{padding:3rem 0;border-top:1px solid var(--line)}
h2{font-family:var(--serif);font-weight:600;font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.1;margin-bottom:1.5rem;color:var(--text)}
html[lang="ar"] h2,html[lang="ar"] .brand-name{font-family:var(--sans);font-weight:700}
.tag{color:var(--silver);margin-top:1.5rem;font-family:var(--serif);font-style:italic;font-size:1.3rem}
html[lang="ar"] .tag{font-family:var(--sans);font-style:normal;font-size:1.1rem}

.lineup ul{list-style:none}
.lineup li{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:1.15rem 0}
.lineup li::before{content:"";position:absolute;inset:0 0 auto 0;height:1px;background:var(--gold);opacity:.55;transform-origin:var(--origin,left)}
html[dir="rtl"] .lineup li::before{--origin:right}
.lineup li:last-child{border-bottom:1px solid var(--line)}
.act{font-family:var(--serif);font-weight:700;font-size:clamp(1.7rem,6.4vw,3rem);line-height:1.05}
.role{color:var(--silver);font-size:1rem;text-align:end}

.wide{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem}
dl{display:grid;grid-template-columns:minmax(0,1fr);gap:0}
.fact{padding:1rem 0;border-top:1px solid var(--line)}
.fact:first-child{border-top:0;padding-top:0}
dt{color:var(--chrome);font-size:.95rem;margin-bottom:.15rem}
dd{font-size:1.2rem;max-width:62ch}
.final{background:var(--band)}
.final p{color:var(--silver);max-width:46ch;margin-bottom:1.5rem}
.cal{margin-top:2rem}
.cal-lead{color:var(--chrome);font-size:.95rem;margin-bottom:.6rem}
footer{padding:2rem 0 3rem;color:var(--chrome);font-size:.95rem;border-top:1px solid var(--line)}

html.js .rv li,html.js .rv.item{opacity:0}
html.js .rv li::before{transform:scaleX(0)}
html.js .rv.in li{opacity:1;transition:opacity 420ms ease-out calc(var(--i) * 80ms + 150ms)}
html.js .rv.in li::before{transform:scaleX(1);transition:transform 600ms ease-out calc(var(--i) * 80ms)}
html.js .rv.item.in{opacity:1;transition:opacity 420ms ease-out}

@media (min-width:900px){
  .hero{grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:3rem;align-items:start;padding:3rem 0 0}
  .hero-copy{padding-top:2rem}
  .poster{margin:0 0 -9rem;justify-self:end;width:100%}
  .lineup .in-grid,.wide{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:3rem}
  .lineup .in-grid>div{grid-column:1}
  section.band.lineup{padding-top:4rem}
  .wide{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
  dl{grid-template-columns:minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){
  .hero-copy>*{animation:none}
  .poster::after{animation:none;opacity:.55;inset:0;width:100%;background:linear-gradient(100deg,oklch(1 0 0 / 0.10),transparent 28%);transform:none}
  html.js .rv.in li,html.js .rv.in li::before,html.js .rv.item.in{transition-duration:200ms;transition-delay:0ms}
  html.js .rv li::before{transform:none}
}
`;

function page(k) {
  const c = L[k];
  const actsHtml = c.acts.map(([n, r], i) => `<li style="--i:${i}"><span class="act"><bdi dir="ltr">${esc(n)}</bdi></span><span class="role">${esc(r)}</span></li>`).join("\n          ");
  const factsHtml = c.facts.map(([t, v]) => `<div class="fact"><dt>${esc(t)}</dt><dd>${desk(v)}</dd></div>`).join("\n          ");
  const gcal = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(c.calTitle) + "&dates=" + START_UTC + "/" + END_UTC + "&details=" + encodeURIComponent(c.calDesc) + "&location=" + encodeURIComponent(c.calLoc);
  const selfLang = `<a href="${c.url}" hreflang="${c.lang}" lang="${c.lang}" aria-current="true">${c.toggleSelf}</a>`;
  const otherLang = `<a href="${c.otherUrl}" hreflang="${c.toggleOtherLang}" lang="${c.toggleOtherLang}" data-keep="1">${c.toggleOther}</a>`;
  const toggle = k === "en" ? selfLang + otherLang : otherLang + selfLang;
  const ld = {
    "@context": "https://schema.org", "@type": "Event",
    name: "THURSDAY TAKEOVER",
    description: L.en.desc,
    startDate: "2026-11-19T23:00+04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: c.lang,
    location: { "@type": "Place", name: "Le Blue Muscat", address: { "@type": "PostalAddress", streetAddress: "Qurum Resort", addressLocality: "Muscat", addressCountry: "OM" } },
    image: [OG, BASE + "img/flyer-1086.webp"],
    performer: ["SADO", "POOYA", "KRAZY", "MC CHYDON", "MARALNI"].map((n) => ({ "@type": "Person", name: n })),
    organizer: { "@type": "Organization", name: "Oman Events", url: "https://omanevents.live" },
    url: c.url
  };
  return `<!DOCTYPE html>
<html lang="${c.lang}" dir="${c.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b0b0c">
<meta name="color-scheme" content="dark">
<meta name="format-detection" content="telephone=no">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.desc)}">
<link rel="canonical" href="${c.url}">
<link rel="alternate" hreflang="en" href="${BASE}">
<link rel="alternate" hreflang="ar" href="${BASE}ar/">
<link rel="alternate" hreflang="x-default" href="${BASE}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Oman Events">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.desc)}">
<meta property="og:url" content="${c.url}">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="og:locale:alternate" content="${k === "en" ? "ar_AR" : "en_US"}">
<meta property="og:image" content="${OG}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.title)}">
<meta name="twitter:description" content="${esc(c.desc)}">
<meta name="twitter:image" content="${OG}">
<meta name="twitter:image:alt" content="${esc(c.ogAlt)}">
<link rel="preload" as="image" href="${IMG}flyer-1086.avif" type="image/avif" imagesrcset="${IMG}flyer-640.avif 640w, ${IMG}flyer-1086.avif 1086w" imagesizes="(min-width:900px) 480px, 90vw">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Tajawal:wght@400;500;700&display=swap">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect fill='%23000' width='32' height='32'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='Georgia' font-size='14' fill='%23C9A227'%3EOE%3C/text%3E%3C/svg%3E">
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
<script>document.documentElement.className+=" js"</script>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <a class="brand" href="${c.gl}" aria-label="Oman Events">
      <svg viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="20" fill="#000" stroke="#C9A227" stroke-width="1.2"/><text x="21" y="25.5" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="14" font-weight="700" fill="#C9A227">OE</text></svg>
      <span><span class="brand-name">${c.brand}</span><span class="brand-sub">${c.brandSub}</span></span>
    </a>
    <nav class="lang" aria-label="${c.langLabel}">${toggle}</nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">${esc(c.kicker)}</p>
        <h1><span>THURSDAY</span> <span class="gold">TAKEOVER</span></h1>
        <div class="when">
          <span class="day" aria-hidden="true">19</span>
          <p class="when-text"><span>${esc(c.dayName)} 19 ${esc(c.monthYear)}</span><span class="time">${esc(c.time)}</span></p>
        </div>
        <div class="cta">
          <a class="btn primary" data-gl href="${c.gl}">${esc(c.join)}</a>
          <a class="btn" href="${WA}" rel="noopener"><span>${esc(c.wa)} <bdi dir="ltr">${DESK}</bdi></span></a>
        </div>
      </div>
      <figure class="poster">
        <picture>
          <source type="image/avif" srcset="${IMG}flyer-640.avif 640w, ${IMG}flyer-1086.avif 1086w" sizes="(min-width:900px) 480px, 90vw">
          <source type="image/webp" srcset="${IMG}flyer-640.webp 640w, ${IMG}flyer-1086.webp 1086w" sizes="(min-width:900px) 480px, 90vw">
          <img src="${IMG}flyer-1086.webp" width="1086" height="1448" alt="${esc(c.posterAlt)}" fetchpriority="high" decoding="async">
        </picture>
      </figure>
    </section>

    <section class="band lineup" aria-labelledby="h-lineup">
      <div class="in-grid"><div>
        <h2 id="h-lineup">${esc(c.lineupH)}</h2>
        <ul class="rv">
          ${actsHtml}
        </ul>
        <p class="tag">${esc(c.tagline)}</p>
      </div></div>
    </section>

    <section class="band" aria-labelledby="h-details">
      <div class="wide">
        <h2 id="h-details">${esc(c.detailsH)}</h2>
        <dl class="rv item">
          ${factsHtml}
        </dl>
      </div>
    </section>

    <section class="band final" aria-labelledby="h-final">
      <h2 id="h-final">${esc(c.finalH)}</h2>
      <p>${esc(c.finalP)}</p>
      <div class="cta">
        <a class="btn primary" data-gl href="${c.gl}">${esc(c.join)}</a>
        <a class="btn" href="${WA}" rel="noopener"><span>${esc(c.wa)} <bdi dir="ltr">${DESK}</bdi></span></a>
      </div>
      <div class="cal">
        <p class="cal-lead">${esc(c.calLead)}</p>
        <div class="cta">
          <a class="btn small" href="${esc(gcal)}" target="_blank" rel="noopener">${esc(c.calGoogle)}</a>
          <a class="btn small" href="${c.ics}" download="thursday-takeover.ics">${esc(c.calIcs)}</a>
        </div>
      </div>
    </section>
  </main>

  <footer>${desk(c.footer)}</footer>
</div>
<script>
(function(){
  var KEY="oe_guestlist_lang";
  try{localStorage.setItem(KEY,"${c.lang}")}catch(e){}
  var q=new URLSearchParams(location.search), ref=q.get("ref");
  if(ref){
    ref=ref.trim().slice(0,40);
    document.querySelectorAll("a[data-gl]").forEach(function(a){a.href=a.href.split("?")[0]+"?ref="+encodeURIComponent(ref)});
  }
  if(location.search){
    document.querySelectorAll("a[data-keep]").forEach(function(a){a.href=a.href.split("?")[0]+location.search});
  }
  document.querySelectorAll("a[data-keep]").forEach(function(a){
    a.addEventListener("click",function(){try{localStorage.setItem(KEY,a.getAttribute("hreflang"))}catch(e){}});
  });
  var els=document.querySelectorAll(".rv");
  if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in")});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:0.15});
  els.forEach(function(e){io.observe(e)});
})();
</script>
</body>
</html>
`;
}

function ics(k) {
  const c = L[k];
  const esc2 = (v) => v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const fold = (line) => { const out = []; let cur = "", n = 0; for (const ch of line) { const b = Buffer.byteLength(ch); if (n + b > 70) { out.push(cur); cur = " " + ch; n = 1 + b; } else { cur += ch; n += b; } } out.push(cur); return out.join("\r\n"); };
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//OmanEvents//Thursday Takeover//" + k.toUpperCase(), "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", "UID:thursday-takeover-20261119-" + k + "@omanevents112.github.io", "DTSTAMP:20261118T100000Z",
    "DTSTART:" + START_UTC, "DTEND:" + END_UTC,
    "SUMMARY:" + esc2(c.calTitle), "LOCATION:" + esc2(c.calLoc), "DESCRIPTION:" + esc2(c.calDesc), "URL:" + c.url,
    "END:VEVENT", "END:VCALENDAR"
  ].map(fold).join("\r\n") + "\r\n";
}

mkdirSync("thursday-takeover/ar", { recursive: true });
writeFileSync("thursday-takeover/index.html", page("en"));
writeFileSync("thursday-takeover/ar/index.html", page("ar"));
writeFileSync("thursday-takeover/thursday-takeover.ics", ics("en"));
writeFileSync("thursday-takeover/thursday-takeover-ar.ics", ics("ar"));
console.log("built");
