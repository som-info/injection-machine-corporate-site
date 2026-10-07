/**
 * Brand and contact details live in this file.
 *
 * Nodes with data-site="…" are rewritten when the page loads, so changing
 * a value here updates the header, footer, and contact blocks. Matching
 * text inside those nodes is only a fallback for browsers with JavaScript
 * disabled.
 *
 * Page <title> values are reset from SITE.name plus the body's
 * data-page-title attribute. Meta descriptions stay in each HTML file.
 *
 * quoteEndpoint
 *   Leave "" to keep the quote form local: it validates and shows a success
 *   message, but does not send anything. To go live, set a Formspree
 *   endpoint or your own URL, for example "https://formspree.io/f/xxxxxxxx".
 *   The form POSTs FormData and treats any 2xx response as success.
 *   Fields: name, company, email, phone, city, series, tonnage, message,
 *   consent. Honeypot field: company_website.
 *
 * siteUrl
 *   Production origin with no trailing slash, used for canonical and
 *   Open Graph absolute URLs. Example: "https://example.com".
 *   Also replace https://example.com in robots.txt and sitemap.xml.
 */
window.SITE = {
  name: "Enjekta Makine",
  legalName: "Enjekta Makine Sanayi A.Ş.",
  shortName: "Enjekta",
  tagline: "Plastik enjeksiyon makineleri",
  taglineShort: "Plastik enjeksiyon",
  phoneDisplay: "+90 (212) 000 00 00",
  phoneHref: "+902120000000",
  email: "info@enjekta.example",
  salesEmail: "satis@enjekta.example",
  addressLine1: "İkitelli OSB, Örnek Sanayi Caddesi No: 100",
  addressLine2: "34490 Başakşehir / İstanbul",
  addressShort: "İkitelli OSB, Başakşehir / İstanbul",
  hours: "Hafta içi 08:30–18:00",
  city: "İstanbul",
  country: "TR",
  siteUrl: "",
  quoteEndpoint: ""
};
