# Cesto Technologies — Website

A static, multi-page marketing site. No frameworks, no runtime dependencies, no build
tooling to install. The only requirement is Node (for the 200-line build script that
stitches the shared header and footer into each page).

---

## Quick start

```bash
node build.js
```

That regenerates every `.html` file in the project root. Open `index.html` in a browser,
or serve the folder:

```bash
python -m http.server 5178
```

While editing, keep a rebuild running:

```bash
node build.js --watch
```

---

## ⚠️ The one rule

**Never edit the `.html` files in the project root.** They are generated and will be
overwritten on the next build. Edit the sources in `src/` instead.

| To change…                        | Edit this                          |
| --------------------------------- | ---------------------------------- |
| Header, navigation, mega menu     | `src/partials/header.html`         |
| Footer and the pre-footer CTA     | `src/partials/footer.html`         |
| `<head>`, meta tags, script tags  | `src/layout.html`                  |
| Phone, email, hours, location     | `src/data/site.json`               |
| Service names, copy, FAQs, icons  | `src/data/services.json`           |
| Layout of every service page      | `src/templates/service.html`       |
| A specific page's content         | `src/pages/<page>.html`            |
| Colours, type, spacing, motion    | `assets/css/style.css`             |
| Behaviour (menus, sliders, forms) | `assets/js/main.js`                |

---

## Project structure

```
├─ build.js                  the build script (zero dependencies)
├─ package.json
├─ src/
│  ├─ layout.html            page shell — <head>, <body>, script tags
│  ├─ partials/
│  │  ├─ header.html         utility strip, logo, nav, mega menu, mobile drawer
│  │  └─ footer.html         CTA band, footer columns, legal bar
│  ├─ templates/
│  │  └─ service.html        one template → all six service pages
│  ├─ data/
│  │  ├─ site.json           contact details used across the site
│  │  └─ services.json       all six services: copy, features, process, FAQs
│  └─ pages/                 index, about, services, contact, legal, 404
├─ assets/
│  ├─ css/style.css          the whole design system
│  ├─ js/main.js             all interactivity
│  └─ img/favicon.svg
└─ *.html                    GENERATED — do not edit
```

---

## Pages

| Page                               | Source                              |
| ---------------------------------- | ----------------------------------- |
| `index.html`                       | `src/pages/index.html`              |
| `about.html`                       | `src/pages/about.html`              |
| `services.html`                    | `src/pages/services.html`           |
| `service-seo.html`                 | `src/data/services.json` + template |
| `service-web-development.html`     | ″                                   |
| `service-sem.html`                 | ″                                   |
| `service-smm.html`                 | ″                                   |
| `service-software-development.html`| ″                                   |
| `service-ecommerce.html`           | ″                                   |
| `contact.html`                     | `src/pages/contact.html`            |
| `privacy-policy.html`              | `src/pages/privacy-policy.html`     |
| `terms-conditions.html`            | `src/pages/terms-conditions.html`   |
| `404.html`                         | `src/pages/404.html`                |

### Adding a service

Add an object to `src/data/services.json` and rebuild. The new service automatically gets
its own page, a card on `services.html`, an entry in the header mega menu, a link in the
mobile drawer, and a link in the footer. Set `icon` to a key from the `ICONS` map at the
top of `build.js`.

### Adding a page

Drop a file into `src/pages/`. Start it with front matter:

```html
---
title: Page title — Cesto Technologies
description: Meta description, roughly 150 characters.
nav: about          # which nav item to highlight
bodyClass: page-x   # optional
---
<section class="section"> … </section>
```

---

## Design system

The palette is taken from the logo: a brushed chrome wordmark, the cyan bars in the "E",
and a near-black ground. **Cyan is an accent, not a wash** — it is used for rules, icons,
focus states and one gradient, and nothing else.

Key tokens live at the top of `assets/css/style.css`:

```css
--accent:      #2ed3ee   /* the cyan from the logo bars      */
--chrome-grad: …         /* the brushed-metal wordmark ramp  */
--ink-900:     #05080e   /* page ground                      */
--sp:          clamp(80px, 9.5vw, 138px)   /* section rhythm */
```

### Section separation

Every section opens with the same device — an index number, a label, and a hairline rule
— and sections alternate between the base ground and `.section--alt`. That pairing is what
keeps the page readable as distinct blocks rather than one long scroll.

```html
<section class="section section--alt">
  <div class="shell">
    <header class="sec-head">
      <div class="sec-head__top" data-anim="fade">
        <span class="sec-head__n">02</span>
        <span class="sec-head__label">What we do</span>
        <span class="sec-head__line"></span>
      </div>
      …
```

---

## Motion

Add `data-anim` to any element to animate it in on scroll:

| Value    | Effect                       |
| -------- | ---------------------------- |
| `up`     | rises into place             |
| `down`   | drops into place             |
| `left`   | slides in from the left      |
| `right`  | slides in from the right     |
| `zoom`   | scales up                    |
| `fade`   | opacity only                 |
| `clip`   | wipes in left→right          |
| `rise`   | rises and scales             |

- `data-delay="120"` delays an individual element by 120ms.
- `data-stagger="90"` on a **parent** gives each animated child an incrementing delay.
- `.reveal-lines` with nested `<span class="ln"><span>…</span></span>` does the masked
  line-by-line headline reveal.

Everything respects `prefers-reduced-motion`. Animations are also scoped to a `.js` class
set by an inline script in the head, so if JavaScript is blocked or fails the page renders
fully visible instead of blank. `main.js` adds a further backstop on `window.error`.

### The rotating services wheel

On the homepage, `.wheel__rotor` spins continuously while each `.wheel__in` counter-rotates
at the same duration, keeping every label upright. It pauses on hover and on keyboard focus.
Adjust the speed in one place — both keyframe durations must match:

```css
.wheel__rotor { animation: wheelSpin 48s linear infinite; }
.wheel__in    { animation: wheelSpinRev 48s linear infinite; }
```

Node positions are set per element with `style="--a:60deg"` (six nodes, 60° apart), and the
ring radius is the `--r` variable on `.wheel`.

---

## Before this goes live

1. **Contact details** — `src/data/site.json` still holds placeholders
   (`+1 (000) 000-0000`, `hello@cestotechnologies.com`). Update them once and they change
   everywhere.
2. **Social links** — the `href="#"` values in `src/partials/header.html` and
   `src/partials/footer.html` need real profile URLs.
3. **Forms have no backend.** The contact form and the footer subscribe field validate and
   show a success state, but nothing is sent. See the marked block in `assets/js/main.js`
   (`NO BACKEND CONNECTED YET`) and point it at your endpoint, Formspree, Netlify Forms or
   your CRM.
4. **Legal pages need review.** `privacy-policy.html` and `terms-conditions.html` are
   working templates, not legal advice. Have a qualified adviser review them and fill in the
   registered company name and number, trading address and governing jurisdiction. Both
   pages carry a visible note about this — remove it once they are finalised.
5. **Canonical URL** — set the real domain in `src/data/site.json` (`url`).
6. **Testimonials** are illustrative and attributed by role only. Replace them with real,
   approved quotes, or remove the section from `src/pages/index.html`.
7. **Analytics** — add your tag to `src/layout.html` so it lands on every page.

---

## Browser support

Modern evergreen browsers. Uses CSS Grid, custom properties, `clamp()`,
`IntersectionObserver` and `backdrop-filter`. All degrade gracefully — no layout depends on
`backdrop-filter`, and content is visible without JavaScript.
