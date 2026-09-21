#!/usr/bin/env node
/**
 * Cesto Technologies — static site builder
 * ----------------------------------------
 * Zero dependencies. Compiles src/ into plain .html files at the project root.
 *
 *   node build.js            build once
 *   node build.js --watch    rebuild on change
 *
 * You edit:   src/partials/header.html, src/partials/footer.html,
 *             src/layout.html, src/pages/*.html, src/data/*.json
 * You upload: the generated *.html files + assets/
 *
 * Never hand-edit the generated .html files at the root — they are overwritten.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');

const read = (p) => fs.readFileSync(p, 'utf8');
const readJSON = (p) => JSON.parse(read(p));

/* ---------------------------------------------------------------
   Icon set — single source of truth, shared by nav, cards, pages.
   Stroke-based 24x24 line icons.
   --------------------------------------------------------------- */
const ICONS = {
  seo: '<path d="M10.5 3.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z"/><path d="m20.5 20.5-5-5"/><path d="M7.8 12.8v-2.1m2.7 2.1V8.9m2.7 3.9v-2.9"/>',
  web: '<rect x="2.5" y="4" width="19" height="15.5" rx="2"/><path d="M2.5 8.5h19"/><path d="M5.6 6.3h.01M8 6.3h.01M10.4 6.3h.01"/><path d="M6 12.5h6.5M6 15.8h4"/><path d="m17.8 15.9 2.6-2.6-1.6-1.6-2.6 2.6-.4 2 2-.4Z"/>',
  sem: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/><path d="m14.6 9.4 5.2-5.2M17 4.2h2.8V7"/>',
  smm: '<path d="M6.8 10.9v8.2H4.4a1.1 1.1 0 0 1-1.1-1.1v-6a1.1 1.1 0 0 1 1.1-1.1h2.4Z"/><path d="m6.8 11.1 3.8-6.8a2 2 0 0 1 3 2l-1 3.7h5a2 2 0 0 1 2 2.4l-1.1 5a2 2 0 0 1-2 1.6H6.8"/>',
  software: '<path d="m8.4 7.8-4.2 4.2 4.2 4.2"/><path d="m15.6 7.8 4.2 4.2-4.2 4.2"/><path d="m13.6 5.2-3.2 13.6"/>',
  ecommerce: '<path d="M5.2 8.2h13.6l-1.1 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5.2 8.2Z"/><path d="M8.9 8.2a3.1 3.1 0 0 1 6.2 0"/><path d="M9.6 11.6v1.2a2.4 2.4 0 0 0 4.8 0v-1.2"/>',

  arrow: '<path d="M4.5 12h15m-6.2-6.2L19.5 12l-6.2 6.2"/>',
  check: '<path d="m5 12.6 4.4 4.4L19 7.4"/>',
  phone: '<path d="M21.5 16.9v2.8a2 2 0 0 1-2.2 2 19.4 19.4 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.4 19.4 0 0 1-3-8.6 2 2 0 0 1 2-2.2h2.8a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L7.6 9.8a15.8 15.8 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2.2Z"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6.5 9 6.3 9-6.3"/>',
  pin: '<path d="M12 21.2s7-5.6 7-11.1a7 7 0 1 0-14 0c0 5.5 7 11.1 7 11.1Z"/><circle cx="12" cy="10" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 1.9"/>',
  shield: '<path d="m12 2.8 8 3.2v6c0 4.4-3.2 8.2-8 9.2-4.8-1-8-4.8-8-9.2V6l8-3.2Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  chart: '<path d="M4 19.6h16"/><rect x="5" y="11.6" width="3.4" height="6"/><rect x="10.3" y="8" width="3.4" height="9.6"/><rect x="15.6" y="4.4" width="3.4" height="13.2"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.4 19.4a5.6 5.6 0 0 1 11.2 0"/><circle cx="17.2" cy="8.6" r="2.5"/><path d="M16.2 13.8a4.9 4.9 0 0 1 4.4 5"/>',
  bulb: '<path d="M9 17.4h6M10 20.4h4"/><path d="M12 3a6.2 6.2 0 0 1 3.7 11.2c-.6.4-.9 1-.9 1.7H9.2c0-.7-.3-1.3-.9-1.7A6.2 6.2 0 0 1 12 3Z"/>',
  handshake: '<path d="m2.6 12 3-3 4 3.5 3-2.5 3 2 5.8-5.5"/><path d="M2.6 12v3l6 4 4-2.5 4 2.5 4.8-4.5V9"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.4" y="13.4" width="4" height="6.2" rx="1.6"/><rect x="17.6" y="13.4" width="4" height="6.2" rx="1.6"/><path d="M19.6 19.6A2.6 2.6 0 0 1 17 22.2h-2"/>',
  rocket: '<path d="M5 19c-1-3.5.5-8 4-11.5S17.5 3 20.5 3.5c.5 3-.5 8-4 11.5S8.5 20 5 19Z"/><path d="M9.5 14.5 5 19"/><circle cx="14.2" cy="9.8" r="1.9"/>',
  layers: '<path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z"/><path d="m3.5 12 8.5 4.5 8.5-4.5"/><path d="m3.5 16.5 8.5 4.5 8.5-4.5"/>',
  target: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
  compass: '<circle cx="12" cy="12" r="8.6"/><path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6 4.6-1.8Z"/>',
  gauge: '<path d="M4.2 17.4a9 9 0 1 1 15.6 0"/><path d="m12 12.8 3.6-3.6"/><circle cx="12" cy="14" r="1.4"/>',
  refresh: '<path d="M20.5 11A8.5 8.5 0 0 0 6 6.4L3.8 8.6"/><path d="M3.5 13A8.5 8.5 0 0 0 18 17.6l2.2-2.2"/><path d="M3.5 4.6v4h4M20.5 19.4v-4h-4"/>',
  quote: '<path d="M9.5 6.5c-2.8 1.1-4.5 3.4-4.5 6.3V18h5.5v-5.5H7.2c0-2 .9-3.4 2.9-4.2l-.6-1.8Z"/><path d="M19 6.5c-2.8 1.1-4.5 3.4-4.5 6.3V18H20v-5.5h-3.3c0-2 .9-3.4 2.9-4.2L19 6.5Z"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.6 9.6h16.8M3.6 14.4h16.8"/><path d="M12 3.4c2.4 2.4 3.7 5.4 3.7 8.6s-1.3 6.2-3.7 8.6c-2.4-2.4-3.7-5.4-3.7-8.6S9.6 5.8 12 3.4Z"/>',
  code: '<path d="m8.4 7.8-4.2 4.2 4.2 4.2"/><path d="m15.6 7.8 4.2 4.2-4.2 4.2"/><path d="m13.6 5.2-3.2 13.6"/>',
  file: '<path d="M14 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2L14 3.2Z"/><path d="M13.8 3.4V8.4H18.8"/><path d="M8.6 13h6.8M8.6 16.4h4.6"/>',
  scale: '<path d="M12 3.6v16.8M7.4 6.2h9.2"/><path d="M4 20.4h16"/><path d="m7.4 6.2-3.2 7h6.4l-3.2-7Zm9.2 0-3.2 7h6.4l-3.2-7Z"/>',
  lock: '<rect x="4.4" y="10.4" width="15.2" height="10" rx="2"/><path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8"/><path d="M12 14.4v2.2"/>',
};

const icon = (name, cls) =>
  `<svg class="${cls || 'ico'}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* ---------------------------------------------------------------
   Data
   --------------------------------------------------------------- */
const site = readJSON(path.join(SRC, 'data/site.json'));
const services = readJSON(path.join(SRC, 'data/services.json'));

const layout = read(path.join(SRC, 'layout.html'));
const headerTpl = read(path.join(SRC, 'partials/header.html'));
const footerTpl = read(path.join(SRC, 'partials/footer.html'));
const serviceTpl = read(path.join(SRC, 'templates/service.html'));

/* ---------------------------------------------------------------
   Generated fragments
   --------------------------------------------------------------- */
const MEGA_CATEGORIES = [
  [
    {
      slug: 'seo', name: 'Search Engine Optimization',
      items: [
        { icon: 'pin', label: 'Local SEO', slug: 'local-seo' },
        { icon: 'compass', label: 'Google Map Optimization', slug: 'google-map-optimization' },
        { icon: 'file', label: 'Local Business Citation', slug: 'local-citation' },
        { icon: 'gauge', label: 'Landing Page Optimization', slug: 'landing-page-optimization' },
        { icon: 'seo', label: 'Technical SEO', slug: 'technical-seo' },
      ],
    },
  ],
  [
    {
      slug: 'sem', name: 'Search Engine Marketing',
      items: [
        { icon: 'target', label: 'Pay Per Click Advertising', slug: 'ppc' },
        { icon: 'sem', label: 'Google Ads', slug: 'google-ads' },
      ],
    },
    {
      slug: 'web-development', name: 'Web Design &amp; Development',
      items: [
        { icon: 'globe', label: 'Wordpress Development', slug: 'wordpress' },
        { icon: 'ecommerce', label: 'Shopify Development', slug: 'shopify' },
      ],
    },
  ],
  [
    { slug: 'social-media-marketing', name: 'Social Media Marketing', items: [{ icon: 'smm', label: 'Social Media Management', slug: 'smm' }] },
    { slug: 'crm-development', name: 'Marketing Automation', items: [{ icon: 'users', label: 'CRM Development' }] },
    { slug: 'app-development', name: 'Software Development', items: [{ icon: 'code', label: 'App Development' }] },
  ],
];

const megaHref = (slug) => (slug ? `service-${slug}.html` : 'services.html');

const megaItems = MEGA_CATEGORIES.map(
  (col) => `
                  <div class="mega__col">${col
                    .map(
                      (cat) => `
                    <div class="mega__cat">
                      <a class="mega__cat-title" href="${megaHref(cat.slug)}">${cat.name}</a>
                      <ul class="mega__cat-list">${cat.items
                        .map((item) => `
                        <li><a href="${megaHref(item.slug || cat.slug)}">${icon(item.icon)} ${item.label}</a></li>`)
                        .join('')}
                      </ul>
                    </div>`
                    )
                    .join('')}
                  </div>`
).join('\n');

const drawerServices = services
  .map((s) => `<li><a href="service-${s.slug}.html">${icon(s.icon)}<span>${s.name}</span></a></li>`)
  .join('\n            ');

const footerServices = services
  .map((s) => `<li><a href="service-${s.slug}.html">${s.name}</a></li>`)
  .join('\n          ');

/* ---------------------------------------------------------------
   Rendering
   --------------------------------------------------------------- */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(':');
    if (i === -1) return;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: raw.slice(m[0].length) };
}

/** Replace {{TOKEN}} and {{ACTIVE:key}} placeholders. */
function fill(tpl, vars, navKey) {
  return tpl
    .replace(/\{\{ACTIVE:([\w-]+)\}\}/g, (_, k) => (k === navKey ? 'is-active' : ''))
    .replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function renderPage(meta, body, outName) {
  const navKey = meta.nav || '';
  const base = {
    SITE_NAME: site.name,
    SITE_URL: site.url,
    PHONE: site.phone,
    PHONE_HREF: site.phoneHref,
    EMAIL: site.email,
    LOCATION: site.location,
    HOURS: site.hours,
    YEAR: String(new Date().getFullYear()),
    MEGA_ITEMS: megaItems,
    DRAWER_SERVICES: drawerServices,
    FOOTER_SERVICES: footerServices,
  };

  const header = fill(headerTpl, base, navKey);
  const footer = fill(footerTpl, base, navKey);

  const vars = Object.assign({}, base, {
    TITLE: meta.title || site.name,
    DESCRIPTION: meta.description || site.description,
    CANONICAL: site.url.replace(/\/$/, '') + '/' + outName,
    BODYCLASS: meta.bodyClass || '',
    HEADERCLASS: meta.headerClass || '',
    HEADER: header,
    FOOTER: footer,
    CONTENT: fill(body, base, navKey),
  });

  const html = fill(layout, vars, navKey);
  fs.writeFileSync(path.join(ROOT, outName), html, 'utf8');
  return outName;
}

function buildServicePages() {
  const out = [];
  services.forEach((s, i) => {
    const prev = services[(i - 1 + services.length) % services.length];
    const next = services[(i + 1) % services.length];

    const vars = {
      NAME: s.name,
      SHORT: s.short,
      SLUG: s.slug,
      TAGLINE: s.tagline,
      LEDE: s.lede,
      ICON: icon(s.icon, 'ico ico--xl'),
      INTRO: s.intro.map((p) => `<p>${p}</p>`).join('\n            '),
      METRIC_VALUE: s.metric.value,
      METRIC_LABEL: s.metric.label,

      FEATURES: s.features
        .map(
          (f, n) => `
          <article class="feature" data-anim="up" data-delay="${n * 70}">
            <span class="feature__n">${String(n + 1).padStart(2, '0')}</span>
            <h3 class="feature__t">${f.t}</h3>
            <p class="feature__d">${f.d}</p>
          </article>`
        )
        .join(''),

      PROCESS: s.process
        .map(
          (p, n) => `
          <li class="step" data-anim="left" data-delay="${n * 80}">
            <span class="step__n">${String(n + 1).padStart(2, '0')}</span>
            <div class="step__body">
              <h3>${p.t}</h3>
              <p>${p.d}</p>
            </div>
          </li>`
        )
        .join(''),

      DELIVERABLES: s.deliverables
        .map((d) => `<li>${icon('check', 'ico ico--sm')}<span>${d}</span></li>`)
        .join('\n            '),

      FAQ: s.faq
        .map(
          (f, n) => `
          <div class="acc__item" data-anim="up" data-delay="${n * 60}">
            <button class="acc__head" type="button" aria-expanded="false">
              <span>${f.q}</span>
              <span class="acc__sign" aria-hidden="true"></span>
            </button>
            <div class="acc__panel"><div class="acc__inner"><p>${f.a}</p></div></div>
          </div>`
        )
        .join(''),

      PREV_SLUG: prev.slug,
      PREV_NAME: prev.name,
      NEXT_SLUG: next.slug,
      NEXT_NAME: next.name,

      RELATED: services
        .filter((x) => x.slug !== s.slug)
        .slice(0, 3)
        .map(
          (x, n) => `
          <a class="rcard" href="service-${x.slug}.html" data-anim="up" data-delay="${n * 80}">
            <span class="rcard__icon">${icon(x.icon)}</span>
            <h3>${x.name}</h3>
            <p>${x.tagline}</p>
            <span class="rcard__go">Read more ${icon('arrow', 'ico ico--sm')}</span>
          </a>`
        )
        .join(''),
    };

    const body = fill(serviceTpl, vars, 'services');
    out.push(
      renderPage(
        {
          title: `${s.name} — ${site.name}`,
          description: s.lede.replace(/<[^>]+>/g, '').slice(0, 158),
          nav: 'services',
          bodyClass: 'page-service',
        },
        body,
        `service-${s.slug}.html`
      )
    );
  });
  return out;
}

function build() {
  const t0 = Date.now();
  const written = [];

  fs.readdirSync(path.join(SRC, 'pages'))
    .filter((f) => f.endsWith('.html'))
    .forEach((f) => {
      const { meta, body } = parseFrontMatter(read(path.join(SRC, 'pages', f)));
      written.push(renderPage(meta, body, f));
    });

  written.push(...buildServicePages());

  console.log(`✓ built ${written.length} pages in ${Date.now() - t0}ms`);
  written.sort().forEach((f) => console.log('  ' + f));
  return written;
}

build();

if (process.argv.includes('--watch')) {
  console.log('\n👀 watching src/ …');
  let timer = null;
  fs.watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (e) {
        console.error('✗ build failed:', e.message);
      }
    }, 120);
  });
}
