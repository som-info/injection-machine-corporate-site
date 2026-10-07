(function () {
  var form = document.getElementById("teklif-formu");
  if (!form || !window.SITE) return;
  form.noValidate = true;

  var summary = document.getElementById("form-summary");
  var success = document.getElementById("form-success");
  var successText = document.getElementById("form-success-text");
  var again = document.getElementById("form-again");
  var submit = form.querySelector("[type='submit']");

  var fields = [
    { id: "ad", name: "name", test: function (v) { return v.trim().length >= 3; }, message: "Ad soyad en az 3 karakter olmalı." },
    { id: "firma", name: "company", test: function (v) { return v.trim().length >= 2; }, message: "Firma adını yazın." },
    { id: "eposta", name: "email", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, message: "Geçerli bir e-posta yazın." },
    { id: "telefon", name: "phone", test: function (v) {
      var digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, message: "Telefonu alan koduyla birlikte yazın." },
    { id: "il", name: "city", test: function (v) { return v.trim().length >= 2; }, message: "İl bilgisini yazın." },
    { id: "mesaj", name: "message", test: function (v) { return v.trim().length >= 20; }, message: "Mesaj en az 20 karakter olmalı. Parça, malzeme veya tonaj yazabilirsiniz." }
  ];

  var params = new URLSearchParams(window.location.search);
  var series = document.getElementById("seri");
  var tonnage = document.getElementById("tonaj");
  var message = document.getElementById("mesaj");
  if (series && params.get("seri")) {
    var wanted = params.get("seri");
    Array.prototype.forEach.call(series.options, function (option) {
      if (option.value === wanted) series.value = wanted;
    });
  }
  if (tonnage && params.get("tonaj") && /^\d{1,4}([.,]\d+)?$/.test(params.get("tonaj"))) {
    tonnage.value = params.get("tonaj").replace(".", ",");
  }
  if (message && params.get("not") && !message.value.trim()) {
    message.value = params.get("not").slice(0, 800);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    var errors = [];

    fields.forEach(function (field) {
      var el = document.getElementById(field.id);
      if (!el || !field.test(el.value)) {
        errors.push({ id: field.id, message: field.message });
      }
    });

    var consent = document.getElementById("kvkk");
    if (!consent || !consent.checked) {
      errors.push({ id: "kvkk", message: "Devam etmek için iletişim iznini işaretleyin." });
    }

    if (tonnage && tonnage.value.trim()) {
      var ton = Number(tonnage.value.trim().replace(/\s/g, "").replace(",", "."));
      if (!isFinite(ton) || ton < 1 || ton > 5000) {
        errors.push({ id: "tonaj", message: "Tonaj 1 ile 5.000 arasında bir sayı olmalı ya da boş bırakılmalı." });
      }
    }

    var honeypot = form.querySelector("[name='company_website']");
    if (honeypot && honeypot.value.trim()) {
      showSuccess(true);
      return;
    }

    if (errors.length) {
      showErrors(errors);
      return;
    }

    var payload = new FormData(form);
    payload.set("consent", "yes");
    var endpoint = (window.SITE.quoteEndpoint || "").trim();
    if (!endpoint) {
      showSuccess(true);
      return;
    }

    if (submit) submit.disabled = true;
    fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("status");
      showSuccess(false);
    }).catch(function () {
      if (submit) submit.disabled = false;
      showBanner("Gönderim tamamlanamadı. Bir süre sonra yeniden deneyin veya " + window.SITE.email + " adresine yazın.");
    });
  });

  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      if (submit) submit.disabled = false;
      var first = document.getElementById("ad");
      if (first) first.focus();
    });
  }

  function clearErrors() {
    summary.hidden = true;
    summary.innerHTML = "";
    form.querySelectorAll("[aria-invalid='true']").forEach(function (el) {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".field-error").forEach(function (el) { el.remove(); });
  }

  function showErrors(errors) {
    var list = document.createElement("ul");
    errors.forEach(function (error) {
      var el = document.getElementById(error.id);
      var errorId = error.id + "-hata";
      if (el) {
        el.setAttribute("aria-invalid", "true");
        el.setAttribute("aria-describedby", errorId);
        var p = document.createElement("p");
        p.className = "field-error";
        p.id = errorId;
        p.textContent = error.message;
        if (el.type === "checkbox") el.parentElement.after(p);
        else el.after(p);
      }
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + error.id;
      link.textContent = error.message;
      item.appendChild(link);
      list.appendChild(item);
    });
    var title = document.createElement("strong");
    title.textContent = "Formda düzeltilmesi gereken alanlar var.";
    summary.appendChild(title);
    summary.appendChild(list);
    summary.hidden = false;
    summary.focus();
  }

  function showBanner(text) {
    summary.innerHTML = "";
    var p = document.createElement("p");
    p.textContent = text;
    summary.appendChild(p);
    summary.hidden = false;
    summary.focus();
  }

  function showSuccess(demo) {
    form.hidden = true;
    summary.hidden = true;
    success.hidden = false;
    successText.textContent = demo
      ? "Bilgiler tarayıcıda doğrulandı. Bu örnek sürümde kayıt bir sunucuya gönderilmedi. Canlıya alırken js/config.js içindeki quoteEndpoint alanına Formspree veya kendi API adresinizi yazın."
      : "Talebiniz iletildi. Dönüş için yazdığınız e-posta veya telefon kullanılacak.";
    success.focus();
  }
})();
