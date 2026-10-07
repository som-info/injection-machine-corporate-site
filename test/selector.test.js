const assert = require("assert");
const fs = require("fs");
const path = require("path");

require(path.join(__dirname, "..", "js", "catalog.js"));
require(path.join(__dirname, "..", "js", "selector-core.js"));

const catalog = global.Enjekta.catalog;
const suggest = global.Enjekta.suggest;

function input(overrides) {
  return Object.assign({
    weight: "200",
    area: "400",
    runner: "15",
    material: "pp",
    application: "genel",
    safety: "15"
  }, overrides);
}

const general = suggest(catalog, input());
assert.strictEqual(general.ok, true);
assert.strictEqual(general.matched, true);
assert.strictEqual(general.modelId, "sf-160");
assert.ok(Math.abs(general.requiredTon - 147.2) < 0.001);

const precise = suggest(catalog, input({
  area: "200",
  weight: "80",
  runner: "10",
  material: "pc",
  application: "hassas"
}));
assert.strictEqual(precise.modelId, "ef-220");
assert.strictEqual(precise.alternateId, "sf-160");

const vertical = suggest(catalog, input({
  area: "80",
  weight: "30",
  material: "pe",
  application: "dikey"
}));
assert.strictEqual(vertical.modelId, "dk-40");

const large = suggest(catalog, input({
  area: "2000",
  weight: "1500",
  material: "abs",
  application: "buyuk"
}));
assert.strictEqual(large.modelId, "cp-1300");
assert.ok(Math.abs(large.requiredTon - 966) < 0.001);

const shotMiss = suggest(catalog, input({ area: "100", weight: "20000", runner: "0" }));
assert.strictEqual(shotMiss.matched, false);
assert.strictEqual(shotMiss.limit, "shot");

const clampMiss = suggest(catalog, input({
  area: "7000",
  weight: "10",
  runner: "0",
  material: "pc",
  application: "buyuk"
}));
assert.strictEqual(clampMiss.matched, false);
assert.strictEqual(clampMiss.limit, "clamp");

const invalid = suggest(catalog, input({ weight: "0", material: "" }));
assert.strictEqual(invalid.ok, false);
assert.ok(invalid.errors.some((error) => error.field === "weight"));
assert.ok(invalid.errors.some((error) => error.field === "material"));

const comma = suggest(catalog, input({ weight: "200,5", area: "400,5" }));
assert.strictEqual(comma.ok, true);
assert.ok(comma.requiredTon > 147);

const pages = {
  sf: "urun-servo-hidrolik.html",
  ef: "urun-tam-elektrikli.html",
  cp: "urun-iki-plakali.html",
  dk: "urun-dikey.html"
};
const htmlCache = {};
catalog.models.forEach((model) => {
  const file = pages[model.series];
  if (!htmlCache[file]) htmlCache[file] = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const needle = `data-model="${model.id}" data-ton="${model.ton}" data-shot="${model.shot}" data-kn="${model.ton * 10}"`;
  assert.ok(htmlCache[file].includes(needle), needle);
});

console.log("selector tests ok");
