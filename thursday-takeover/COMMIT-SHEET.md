# COMMIT-SHEET — THURSDAY TAKE OVER event page (omanevents112.github.io/guestlist/thursday-takeover/)

Register: **build** (standalone event page). Method: auteur 1.3.1 (`auteur-web-direction`). Written before any markup.
Interim canonical event page while omanevents.live (Manus) cannot be edited. Must sit next to the guest-list page and look like the same house.

## 1. Peak / Signature
The flyer itself, hung like a lit poster: a single narrow chrome reflection crosses the poster once, left to right, when the page loads (and mirrored right to left in Arabic). The poster crosses the hero/lineup boundary (see §4). That poster-with-a-reflection is the one thing a visitor describes to a friend. No wordmark hero: the image carries the page.

## 2. Color
- Brand hue: **gold, oklch(0.78 0.13 88)** (`#d4b04a`-family, same hue family as the guest list's `#c9a227`). Tier: **restrained** (about 8% of the surface: hairlines, the date numeral, primary button, focus ring).
- Neutrals: black `oklch(0.12 0.004 285)` page, `oklch(0.17 0.004 285)` raised bands, silver `oklch(0.80 0.01 285)` text, chrome `oklch(0.62 0.01 285)` secondary text. Chrome is only a material: the poster reflection and the button highlight.
- Crimson is not a second brand colour. It appears only as one very low-chroma floor shadow behind the poster (`oklch(0.28 0.10 12 / .35)`), never on text or controls.
- Why not the reflexes: not lavender/blue-purple SaaS gradient (the flyer is blue/violet; the page deliberately does NOT echo it, so the flyer reads as the one lit object). Not cream. Gold is argued by the brief: the house palette (black/silver/chrome/crimson/gold) with gold chosen as the single committed hue.
- **Background lightness: mean L ≈ 0.14** (page 0.12, bands 0.17, the poster block lifts the viewport mean to roughly 0.18 at the top).
- **Why the page is dark (a reason, not "premium"):** the night itself starts at 11 PM and happens in a low-lit room; the flyer's neon artwork is emissive and only reads correctly on near-black; a lit page would turn the poster into a flat rectangle and break the Thursday-night promise. It is also the house floor set by Mohammed for omanevents.live.

## 3. Type
- Display: **Cormorant Garamond** 600/700 (soft high-contrast serif, already the guest-list voice, so both pages feel like one house). Not Inter, not Space Grotesk, not Playfair/Instrument Serif.
- Text and Arabic: **Tajawal** 400/500/700 (clean geometric grotesque with a real Arabic cut; Arabic headings use Tajawal 700 because Cormorant has no Arabic). Axis: high-contrast serif x neutral grotesque.
- Scale: h1 clamp(2.6rem, 9vw, 5.5rem) (under the 6rem ceiling, in prose flow); date numeral `19` is display-size on purpose (a single numeral, not a wordmark; it is the anchor of the facts). Body 1rem/1.6, 62ch max. Display letter-spacing no tighter than -0.01em.
- No mono service type anywhere. One kicker only (venue line above the title), no eyebrow above other sections.

## 4. Grid break
On desktop (>=900px) the poster column is offset: it starts above the title block and its bottom 9rem (about 144px) overlaps into the lineup band (negative margin), so the lineup text is set beside the poster tail rather than under it. On mobile the large gold `19` numeral overlaps the poster's top corner by ~28px. The grid is deliberately asymmetric (7/5 split, not 50/50).

## 5. Motion budget (3 scroll/entrance families, nothing else)
1. Poster reflection sweep: one chrome band, `transform: translateX` + opacity, 1.4s ease-out, once on load (no loop).
2. Hero text entrance: title, date, CTAs rise 12px with opacity, 60ms stagger, ease-out, 500ms.
3. Lineup rows: IntersectionObserver reveal, hairline draws with `scaleX`, row text fades in; 80ms stagger.
Only `transform` and `opacity` animate. Buttons: 140ms colour/opacity feedback. No scroll listeners, no WebGL, no autoplay media, no marquee.
`prefers-reduced-motion`: no sweep; the poster carries a static soft chrome edge-light instead; reveals become a 200ms opacity-only fade. JS-off: everything is visible by default (reveals only gate when `html.js` is set).

## 6. Reflex check
a) Generic AI for "nightlife event page": black + neon purple/pink gradient, "LIVE · DJ · 21+" tags, hero + three feature cards (Date / Venue / Tickets), glowing gradient CTA, countdown timer.
b) Generic AI avoiding (a): black + amber monospace labels, giant wordmark filling the viewport, 01/02/03 sections, scroll-instruction footer.
c) Ours: the real flyer as the lit object with one physical chrome reflection; a typographic lineup set as ruled rows with roles (decks / mic / live drums) instead of cards; facts as a plain definition list, with a big gold `19`; gold hairlines, chrome button highlight, no gradient text, no glow-as-depth, no counters. Copy is plain facts, nothing invented (no price, no capacity, no sponsors).

## 7. House tells broken (taste.md §2.5)
1. **Wordmark-as-hero (#6)**: the hero's peak is the photographic flyer and its reflection; the title is a normal-size serif line beside it.
2. **Mono service type (#2)** and **glow as depth (#7)**: zero monospace labels; depth comes from one directional edge-light, a hard floor shadow and the overlap, not from bloom.
Kept on purpose: near-black background (#1), because the event is at night and the brief sets the dark luxury floor (reason in §2).

## Anti-references (named)
- The generic "SaaS landing" pattern: hero + three identical feature cards + gradient CTA.
- Resident-Advisor-style flat black listing pages with amber mono labels.
- Ticketing-marketplace pages (countdown timers, "selling fast", price tiers). This page sells nothing and shows no price.
- Neon-gradient club templates with gradient text.

## Content rules (from Mohammed / Charge, enforced by grep before ship)
Rules supplied by Mohammed: no table bookings, no price, no age limit, no alcohol cues, no "free" wording. Entry line exactly: `Valid ID required. Entry subject to the venue's rules.` CTA: Join the guest list -> guest-list page (carry `?ref`), secondary WhatsApp +968 9777 3122.

## Gates (run before ship; results recorded in the commit message and report)
slopscan 0 fails · shoot at 390 and 1440 (all frames viewed) · motionqa · verify.md rubric (contrast, CLS, reduced motion).
