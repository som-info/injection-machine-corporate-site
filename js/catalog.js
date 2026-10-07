/* Sample catalog used by the selection helper. Keep ton/shot in sync with the product tables. */
(function (root) {
  var Enjekta = root.Enjekta || (root.Enjekta = {});
  Enjekta.catalog = {
    materials: [
    { id: "pe", name: "PE (polietilen)", factor: 0.3, family: "genel", note: "Düşük viskozite, geniş proses." },
    { id: "pp", name: "PP (polipropilen)", factor: 0.32, family: "genel", note: "Ambalaj ve genel parçada sık görülür." },
    { id: "ps", name: "PS (polistiren)", factor: 0.35, family: "genel", note: "Akışkan, görece düşük kuvvet." },
    { id: "abs", name: "ABS", factor: 0.42, family: "hassas", note: "Yüzey beklentisi ayrıca konuşulur." },
    { id: "pvc", name: "PVC", factor: 0.4, family: "genel", note: "Vida ve sıcaklık penceresi ayrıca seçilir." },
    { id: "pom", name: "POM", factor: 0.48, family: "hassas", note: "Ölçü hassasiyeti isteyebilir." },
    { id: "pa", name: "PA (poliamid)", factor: 0.52, family: "teknik", note: "Kurutma ve vida seçimi kritiktir." },
    { id: "pmma", name: "PMMA (akrilik)", factor: 0.58, family: "hassas", note: "Şeffaf parçada yüzey önemlidir." },
    { id: "pc", name: "PC (polikarbonat)", factor: 0.62, family: "hassas", note: "Yüksek kuvvet ve sıcaklık." },
    { id: "pa-gf", name: "PA, cam elyaflı", factor: 0.7, family: "teknik", note: "Katsayı yükselir; vida aşınması ayrıca seçilir." }
    ],
    series: [
    { id: "sf", name: "Servo-hidrolik", page: "urun-servo-hidrolik.html" },
    { id: "ef", name: "Tam elektrikli", page: "urun-tam-elektrikli.html" },
    { id: "cp", name: "İki plakalı", page: "urun-iki-plakali.html" },
    { id: "dk", name: "Dikey", page: "urun-dikey.html" }
    ],
    models: [
    { id: "sf-90", series: "sf", name: "SF 90", ton: 90, shot: 170 },
    { id: "sf-160", series: "sf", name: "SF 160", ton: 160, shot: 340 },
    { id: "sf-250", series: "sf", name: "SF 250", ton: 250, shot: 580 },
    { id: "sf-380", series: "sf", name: "SF 380", ton: 380, shot: 1050 },
    { id: "sf-550", series: "sf", name: "SF 550", ton: 550, shot: 1750 },
    { id: "ef-80", series: "ef", name: "EF 80", ton: 80, shot: 130 },
    { id: "ef-130", series: "ef", name: "EF 130", ton: 130, shot: 250 },
    { id: "ef-220", series: "ef", name: "EF 220", ton: 220, shot: 460 },
    { id: "ef-350", series: "ef", name: "EF 350", ton: 350, shot: 820 },
    { id: "cp-650", series: "cp", name: "ÇP 650", ton: 650, shot: 2400 },
    { id: "cp-900", series: "cp", name: "ÇP 900", ton: 900, shot: 3600 },
    { id: "cp-1300", series: "cp", name: "ÇP 1300", ton: 1300, shot: 5600 },
    { id: "cp-1800", series: "cp", name: "ÇP 1800", ton: 1800, shot: 8200 },
    { id: "dk-40", series: "dk", name: "DK 40", ton: 40, shot: 75 },
    { id: "dk-80", series: "dk", name: "DK 80", ton: 80, shot: 150 },
    { id: "dk-150", series: "dk", name: "DK 150", ton: 150, shot: 300 },
    { id: "dk-250", series: "dk", name: "DK 250", ton: 250, shot: 520 }
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
