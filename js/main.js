(function () {
  var SITE = window.SITE;
  if (!SITE) return;

  var text = {
    name: SITE.name,
    legal: SITE.legalName,
    short: SITE.shortName,
    tagline: SITE.tagline,
    "tagline-short": SITE.taglineShort,
    phone: SITE.phoneDisplay,
    email: SITE.email,
    "sales-email": SITE.salesEmail,
    address1: SITE.addressLine1,
    address2: SITE.addressLine2,
    "address-short": SITE.addressShort,
    hours: SITE.hours,
    city: SITE.city,
    year: String(new Date().getFullYear())
  };

  document.querySelectorAll("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site");
    if (!Object.prototype.hasOwnProperty.call(text, key)) return;
    el.textContent = text[key];
    var hrefMode = el.getAttribute("data-site-href");
    if (hrefMode === "tel") el.setAttribute("href", "tel:" + SITE.phoneHref);
    if (hrefMode === "mail") el.setAttribute("href", "mailto:" + SITE.email);
    if (hrefMode === "sales") el.setAttribute("href", "mailto:" + SITE.salesEmail);
  });

  var logo = document.querySelector(".logo");
  if (logo) logo.setAttribute("aria-label", SITE.name + ", ana sayfa");

  var pageTitle = document.body.getAttribute("data-page-title");
  if (pageTitle) {
    var full = SITE.name + " — " + pageTitle;
    document.title = full;
    setMeta("og:title", full, true);
    setMeta("twitter:title", full, false);
  }

  var description = document.querySelector('meta[name="description"]');
  if (description) {
    setMeta("og:description", description.getAttribute("content"), true);
    setMeta("twitter:description", description.getAttribute("content"), false);
  }
  setMeta("og:site_name", SITE.name, true);

  if (SITE.siteUrl) {
    var origin = SITE.siteUrl.replace(/\/$/, "");
    var path = window.location.pathname;
    var canonical = origin + path;
    var link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    setMeta("og:url", canonical, true);
    var image = document.querySelector('meta[property="og:image"]');
    if (image && image.getAttribute("content") && image.getAttribute("content").indexOf("http") !== 0) {
      var absolute = origin + "/" + image.getAttribute("content").replace(/^\//, "");
      image.setAttribute("content", absolute);
      setMeta("twitter:image", absolute, false);
    }
  }

  if (document.body.getAttribute("data-page") === "home") {
    var data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.legalName,
      email: SITE.email,
      telephone: SITE.phoneHref,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.addressLine1,
        addressLocality: SITE.city,
        addressCountry: SITE.country
      }
    };
    if (SITE.siteUrl) data.url = SITE.siteUrl.replace(/\/$/, "") + "/";
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(data);
    document.head.appendChild(ld);
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    function closeNav() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      var label = toggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = "Menü";
    }
    function openNav() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      var label = toggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = "Kapat";
    }
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeNav();
      else openNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
        toggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  function setMeta(name, value, property) {
    if (!value) return;
    var selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute("content", value);
  }
})();
