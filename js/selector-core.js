/**
 * Rule-of-thumb clamp-force suggestion.
 * Clamp (ton) = projected area (cm²) × material factor (ton/cm²) × safety.
 * A model fits when its sample clamp covers that tonnage and the part
 * (plus runner) stays within 80% of the sample PS shot weight.
 * Factors and machine rows are sample catalog data, not a press standard.
 */
(function (root) {
  var Enjekta = root.Enjekta || (root.Enjekta = {});

  function num(value) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return NaN;
    var text = value.trim().replace(/\s/g, "").replace(",", ".");
    if (!text) return NaN;
    return Number(text);
  }

  function preferredSeries(application, requiredTon) {
    if (application === "dikey") {
      if (requiredTon <= 260) return "dk";
      return requiredTon > 550 ? "cp" : "sf";
    }
    if (application === "buyuk" || requiredTon > 550) return "cp";
    if (application === "hassas" && requiredTon <= 360) return "ef";
    return "sf";
  }

  function suggest(catalog, input) {
    var errors = [];
    var weight = num(input.weight);
    var area = num(input.area);
    var runner = num(input.runner);
    var safetyPct = num(input.safety);
    var material = null;
    var i;

    if (!isFinite(weight) || weight <= 0) {
      errors.push({ field: "weight", message: "Parça ağırlığı sıfırdan büyük olmalı." });
    } else if (weight > 30000) {
      errors.push({ field: "weight", message: "30.000 g üzerindeki gramaj bu ön seçimin dışında." });
    }

    if (!isFinite(area) || area <= 0) {
      errors.push({ field: "area", message: "İzdüşüm alanı sıfırdan büyük olmalı." });
    } else if (area > 80000) {
      errors.push({ field: "area", message: "80.000 cm² üzerindeki alan bu ön seçimin dışında." });
    }

    if (!isFinite(runner) || runner < 0 || runner > 80) {
      errors.push({ field: "runner", message: "Yolluk payı 0 ile 80 arasında olmalı." });
    }

    if (safetyPct !== 10 && safetyPct !== 15 && safetyPct !== 20) {
      errors.push({ field: "safety", message: "Emniyet payı olarak %10, %15 veya %20 seçin." });
    }

    for (i = 0; i < catalog.materials.length; i += 1) {
      if (catalog.materials[i].id === input.material) material = catalog.materials[i];
    }
    if (!material) {
      errors.push({ field: "material", message: "Malzeme seçin." });
    }

    if (["genel", "hassas", "dikey", "buyuk"].indexOf(input.application) === -1) {
      errors.push({ field: "application", message: "Uygulama tipi seçin." });
    }

    if (errors.length) return { ok: false, errors: errors };

    var safety = 1 + safetyPct / 100;
    var rawTon = area * material.factor;
    var requiredTon = rawTon * safety;
    var requiredKn = Math.round(requiredTon * 10);
    var shotG = weight * (1 + runner / 100);
    var minShot = shotG / 0.8;
    var preferred = preferredSeries(input.application, requiredTon);
    var fitting = [];

    for (i = 0; i < catalog.models.length; i += 1) {
      var model = catalog.models[i];
      if (model.ton + 1e-9 >= requiredTon && model.shot + 1e-9 >= minShot) {
        fitting.push(model);
      }
    }

    var base = {
      ok: true,
      rawTon: rawTon,
      requiredTon: requiredTon,
      requiredKn: requiredKn,
      shotG: shotG,
      minShot: minShot,
      safety: safety,
      safetyPct: safetyPct,
      materialId: material.id,
      preferredSeries: preferred,
      application: input.application
    };

    if (!fitting.length) {
      var clampOk = false;
      var shotOk = false;
      for (i = 0; i < catalog.models.length; i += 1) {
        if (catalog.models[i].ton + 1e-9 >= requiredTon) clampOk = true;
        if (catalog.models[i].shot + 1e-9 >= minShot) shotOk = true;
      }
      var limit = !clampOk && !shotOk ? "both" : !clampOk ? "clamp" : "shot";
      return Object.assign(base, { matched: false, limit: limit });
    }

    fitting.sort(function (a, b) {
      var as = a.ton + (a.series === preferred ? 0 : 100000);
      var bs = b.ton + (b.series === preferred ? 0 : 100000);
      if (as !== bs) return as - bs;
      return a.shot - b.shot;
    });

    var chosen = fitting[0];
    var alternateOrder = {
      ef: ["sf", "cp", "dk"],
      sf: ["ef", "cp", "dk"],
      cp: ["sf", "ef", "dk"],
      dk: ["sf", "ef", "cp"]
    };
    var alternate = null;
    var order = alternateOrder[chosen.series] || [];
    for (i = 0; i < order.length; i += 1) {
      var candidate = null;
      var j;
      for (j = 0; j < fitting.length; j += 1) {
        if (fitting[j].series !== order[i]) continue;
        if (!candidate || fitting[j].ton < candidate.ton) candidate = fitting[j];
      }
      if (candidate) {
        alternate = candidate;
        break;
      }
    }

    var notes = [];
    if (chosen.series !== preferred) notes.push("preference-missed");
    if (input.application === "dikey" && preferred !== "dk") notes.push("vertical-out-of-range");
    if (input.application === "hassas" && preferred !== "ef") notes.push("precision-out-of-range");
    if (material.family === "hassas" && input.application === "genel" && chosen.series !== "ef") {
      notes.push("precision-material");
    }
    if (material.family === "teknik") notes.push("glass-or-technical");
    if ((chosen.ton - requiredTon) / chosen.ton < 0.08) notes.push("tight-clamp");
    if (shotG < chosen.shot * 0.25) notes.push("low-shot-use");
    if (shotG > chosen.shot * 0.7) notes.push("high-shot-use");

    return Object.assign(base, {
      matched: true,
      modelId: chosen.id,
      alternateId: alternate ? alternate.id : null,
      notes: notes
    });
  }

  Enjekta.suggest = suggest;
})(typeof window !== "undefined" ? window : globalThis);
