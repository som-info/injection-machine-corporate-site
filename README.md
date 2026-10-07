# Enjekta Makine

Sample corporate website, in Turkish, for a plastic injection molding machine company. The brand, contact details, machine specifications, and material factors are fictional placeholders. Nothing here is a real certification, a real customer list, or a measured company statistic.

Prepared as a portfolio-grade static site. The invented brand is **Enjekta Makine** (legal-style name: Enjekta Makine Sanayi A.Ş.), based in Istanbul on a clearly placeholder address.

## Tech

- Static HTML, CSS, and vanilla JavaScript
- No build step and no framework
- Self-hosted Latin and Latin-extended fonts (Barlow Condensed, Source Sans 3)
- Deployable on GitHub Pages

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080/`.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Ana sayfa |
| `urunler.html` | Ürünler |
| `urun-servo-hidrolik.html` | SF serisi, servo-hidrolik |
| `urun-tam-elektrikli.html` | EF serisi, tam elektrikli |
| `urun-iki-plakali.html` | ÇP serisi, iki plakalı |
| `urun-dikey.html` | DK serisi, dikey |
| `hizmetler.html` | Hizmetler |
| `hakkimizda.html` | Hakkımızda |
| `sss.html` | Sık sorulan sorular |
| `secim.html` | Makine seçim yardımcısı |
| `iletisim.html` | Teklif ve iletişim |
| `404.html` | Sayfa bulunamadı |

Also: `sitemap.xml`, `robots.txt`, `favicon.svg`, `.nojekyll`.

## Features

- Responsive layout, skip link, keyboard menu, visible focus, and `prefers-reduced-motion`
- Turkish `lang="tr"`, unique titles and descriptions, Open Graph and Twitter cards
- Organization JSON-LD on the home page, filled from `js/config.js`
- Quote form with client-side validation, error summary, and a success state
- Machine selection helper (part weight, projected area, material, application)
- Spec tables per series. Narrow screens can scroll them horizontally

## Sample content

Treat every number on the site as sample catalog data:

- Clamping force, shot weight, screw diameter, tie-bar distance, opening stroke, mold height, and injection pressure
- Material factors in the selection helper (ton/cm²), the 10/15/20% safety options, and the 80% shot-capacity rule
- The tonnage span “40–1.800 ton” and the four series ranges
- Working hours

The site does not publish customer logos, production counts, market share, or certification marks. Specification tables say the values are examples and that the current data sheet governs an order.

Contact details are placeholders:

- Phone: `+90 (212) 000 00 00`
- Email: `info@enjekta.example` and `satis@enjekta.example` (the `.example` domain is reserved and does not deliver mail)
- Address: İkitelli OSB, Örnek Sanayi Caddesi No: 100, 34490 Başakşehir / İstanbul

The hero and SF-series photo is a studio visual of a graphite-and-white horizontal servo-hydraulic press (`assets/injection-machine.jpg`). It is not a photograph of a delivered Enjekta machine. The other series use schematic side views so one photo is not reused as three different machines.

## Change the brand in one place

Edit `js/config.js`. On load, the script rewrites every element with a `data-site` attribute (name, phone, email, address, hours, year) and sets `document.title` from `SITE.name` plus the `data-page-title` on `<body>`.

The same strings are repeated in the HTML as a fallback for browsers with JavaScript disabled. Update those fallbacks only if that case matters. Meta descriptions live in each HTML file. `robots.txt` and `sitemap.xml` use `https://example.com` until you set the real origin.

`SITE.siteUrl` (no trailing slash) turns on the canonical URL and absolute Open Graph image URL.

## Quote form hook

`SITE.quoteEndpoint` is empty by default. The form then validates in the browser and shows a success message, but it does not send data.

To go live, set for example:

```js
quoteEndpoint: "https://formspree.io/f/xxxxxxxx"
```

The form `POST`s `FormData` and treats any 2xx response as success. Field names: `name`, `company`, `email`, `phone`, `city`, `series`, `tonnage`, `message`, `consent`. A hidden honeypot field is named `company_website`. With JavaScript disabled, the form falls back to `mailto:info@enjekta.example`.

The selection helper can open the form with `seri`, `tonaj`, and `not` query parameters.

## Selection helper

```text
clamp (ton) = projected area (cm²) × material factor (ton/cm²) × safety
```

A sample model fits when its clamp covers that tonnage and the part plus runner stays within 80% of the sample polystyrene shot weight. Application choice steers the series (general, precision, vertical insert, large part) and falls back when that series has no fitting row. The page states that this is a preliminary estimate.

Check the logic with:

```bash
node test/selector.test.js
```

## GitHub Pages

1. Push the repository.
2. In Settings → Pages, publish the branch you want (root `/`).
3. `.nojekyll` is included so Pages serves the files as-is.
4. Set `SITE.siteUrl`, and replace `https://example.com` in `sitemap.xml` and `robots.txt`.
5. Relative links work for a project site (`https://<user>.github.io/<repo>/`) and for a user site. Custom 404 styling uses those same relative paths; a nested missing URL can break them because the browser resolves paths against the missing URL.

## Accessibility

- `lang="tr"` on the document
- Skip link, landmarks, labeled form controls, `aria-invalid`, and an error summary
- FAQ uses native `details` / `summary`
- Focus styles stay visible on light and dark surfaces
- Spec tables are in a keyboard-focusable scroll region

Palette: graphite `#1c2126`, white, light gray `#f3f5f7`, accent `#1e4f5c`.
