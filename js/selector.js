(function () {
  var form = document.getElementById("secim-formu");
  var catalog = window.Enjekta && window.Enjekta.catalog;
  var suggest = window.Enjekta && window.Enjekta.suggest;
  if (!form || !catalog || !suggest) return;

  var materialSelect = document.getElementById("malzeme");
  var factorBody = document.querySelector("#katsayi-tablosu tbody");
  var result = document.getElementById("secim-sonuc");

  catalog.materials.forEach(function (material) {
    var option = document.createElement("option");
    option.value = material.id;
    option.textContent = material.name;
    materialSelect.appendChild(option);
    if (factorBody) {
      var row = document.createElement("tr");
      var name = document.createElement("th");
      name.scope = "row";
      name.textContent = material.name;
      var factor = document.createElement("td");
      factor.textContent = formatFactor(material.factor);
      var note = document.createElement("td");
      note.textContent = material.note;
      row.appendChild(name);
      row.appendChild(factor);
      row.appendChild(note);
      factorBody.appendChild(row);
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFieldErrors();
    var data = {
      weight: document.getElementById("agirlik").value,
      area: document.getElementById("alan").value,
      runner: document.getElementById("yolluk").value,
      material: materialSelect.value,
      application: document.getElementById("uygulama").value,
      safety: selectedSafety()
    };
    var outcome = suggest(catalog, data);
    if (!outcome.ok) {
      showFieldErrors(outcome.errors);
      renderMessage("Hesap için işaretli alanları düzeltin.", outcome.errors.map(function (e) { return e.message; }));
      return;
    }
    renderOutcome(outcome);
  });

  function selectedSafety() {
    var picked = form.querySelector("input[name='safety']:checked");
    return picked ? picked.value : "";
  }

  function clearFieldErrors() {
    form.querySelectorAll("[aria-invalid='true']").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach(function (el) { el.remove(); });
  }

  function showFieldErrors(errors) {
    var ids = { weight: "agirlik", area: "alan", runner: "yolluk", material: "malzeme", application: "uygulama", safety: "emniyet-15" };
    errors.forEach(function (error) {
      var el = document.getElementById(ids[error.field]);
      if (!el) return;
      el.setAttribute("aria-invalid", "true");
      var p = document.createElement("p");
      p.className = "field-error";
      p.textContent = error.message;
      var anchor = error.field === "safety" ? document.getElementById("emniyet-alani") : el;
      anchor.after(p);
    });
  }

  function renderMessage(title, lines) {
    result.innerHTML = "";
    var kicker = document.createElement("p");
    kicker.className = "result-kicker";
    kicker.textContent = "Ön seçim";
    var heading = document.createElement("h2");
    heading.textContent = title;
    result.appendChild(kicker);
    result.appendChild(heading);
    if (lines && lines.length) {
      var list = document.createElement("ul");
      list.className = "result-list";
      lines.forEach(function (line) {
        var item = document.createElement("li");
        item.textContent = line;
        list.appendChild(item);
      });
      result.appendChild(list);
    }
  }

  function renderOutcome(outcome) {
    var material = find(catalog.materials, outcome.materialId);
    var model = outcome.matched ? find(catalog.models, outcome.modelId) : null;
    var series = model ? find(catalog.series, model.series) : null;
    result.innerHTML = "";
    var kicker = document.createElement("p");
    kicker.className = "result-kicker";
    kicker.textContent = "İhtiyaç duyulan kuvvet";
    var heading = document.createElement("h2");
    heading.textContent = outcome.matched ? "Öneri: " + model.name : "Uyan örnek yok";
    var ton = document.createElement("p");
    ton.className = "result-ton";
    ton.textContent = formatTon(outcome.requiredTon) + " ton";
    var sub = document.createElement("p");
    sub.textContent = formatInt(outcome.requiredKn) + " kN kapatma, yolluk dahil yaklaşık " + formatInt(Math.round(outcome.shotG)) + " g.";
    result.appendChild(kicker);
    result.appendChild(ton);
    result.appendChild(heading);
    result.appendChild(sub);

    var list = document.createElement("ul");
    list.className = "result-list";
    add(list, "Ham kuvvet " + formatTon(outcome.rawTon) + " ton. Formül: alan × " + formatFactor(material.factor) + " ton/cm² × " + formatFactor(outcome.safety) + " emniyet.");

    if (!outcome.matched) {
      if (outcome.limit === "clamp" || outcome.limit === "both") {
        add(list, "Hesaplanan kapatma, örnek katalogdaki en yüksek değer olan 1.800 tonun üzerinde. Bu araç burada durur; görüşmede ayrıca değerlendirilir.");
      }
      if (outcome.limit === "shot" || outcome.limit === "both") {
        add(list, "Gramaj, uyan kapatma kuvvetindeki örnek shot değerlerinin %80 sınırını aşıyor. Vida çapı teklifte ayrıca seçilmeli.");
      }
      add(list, "Bu sonuç bir makine önerisi değildir.");
    } else {
      add(list, series.name + " serisinden " + model.name + " örnek satırı bu kuvvet ve gramaja yetiyor (" + formatInt(model.ton) + " ton, " + formatInt(model.shot) + " g PS).");
      outcome.notes.forEach(function (note) {
        if (note === "tight-clamp") add(list, "Kapatma payı dar. Bir üst model de teklif notuna yazılabilir.");
        if (note === "low-shot-use") add(list, "Gramaj, anma shot değerine göre düşük. Modeli kapatma kuvveti büyütmüş olabilir; vida teklifte küçültülebilir.");
        if (note === "high-shot-use") add(list, "Gramaj, anma shot değerinin üst bölgesinde. Dolum payını proses denemesinde kontrol edin.");
        if (note === "preference-missed") add(list, "Tercih edilen seride uyan örnek model yok. Koşulu sağlayan en küçük model gösterildi.");
        if (note === "vertical-out-of-range") add(list, "Dikey seri bu kuvvete örnek modellerle yetişmiyor. Yatay seri önerildi.");
        if (note === "precision-out-of-range") add(list, "Tam elektrikli örnek aralık 350 tonda bitiyor. Daha yüksek kuvvette servo-hidrolik veya iki plakalı seri konuşulur.");
        if (note === "precision-material") add(list, "Malzeme hassas grupta. Uygulama genel seçildiği için servo-hidrolik öne alındı.");
        if (note === "glass-or-technical") add(list, "Teknik veya cam elyaflı malzemede vida ve kovan malzemesi teklifte ayrıca seçilir.");
      });
      if (outcome.alternateId) {
        var alt = find(catalog.models, outcome.alternateId);
        var altSeries = find(catalog.series, alt.series);
        add(list, "Alternatif örnek: " + altSeries.name + " / " + alt.name + " (" + formatInt(alt.ton) + " ton).");
      }
    }
    result.appendChild(list);

    if (outcome.matched) {
      var actions = document.createElement("p");
      actions.className = "hero-actions";
      var seriesLink = document.createElement("a");
      seriesLink.className = "btn btn-accent";
      seriesLink.href = series.page;
      seriesLink.textContent = series.name + " serisi";
      var quote = document.createElement("a");
      quote.className = "btn btn-dark";
      var note = "Seçim yardımcısı ön sonucu: " + model.name + ", yaklaşık " + formatTon(outcome.requiredTon) + " ton.";
      quote.href = "iletisim.html?seri=" + encodeURIComponent(model.series) + "&tonaj=" + encodeURIComponent(String(model.ton)) + "&not=" + encodeURIComponent(note);
      quote.textContent = "Teklife aktar";
      actions.appendChild(seriesLink);
      actions.appendChild(quote);
      result.appendChild(actions);
    }

    var caution = document.createElement("p");
    caution.className = "note";
    caution.style.marginTop = "16px";
    caution.textContent = "Ön seçimdir. Et kalınlığı, yolluk tipi ve soğutma teklif çalışmasında netleşir. Katsayılar ve makine satırları örnek değerlerdir.";
    result.appendChild(caution);
    result.focus();
  }

  function add(list, text) {
    var item = document.createElement("li");
    item.textContent = text;
    list.appendChild(item);
  }

  function find(list, id) {
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function formatTon(value) {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(value);
  }

  function formatInt(value) {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(value);
  }

  function formatFactor(value) {
    return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }
})();
