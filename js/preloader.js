var mergeFiles = require("merge-files");

const preloadMap = [
  {
    name: "js/preload-index.js",
    files: [
      "js/db.js",
      "js/locales.js",
      "js/pandorae.js",
      "js/types.js",
      "js/slider.js",
      "js/lib/OrbitControls.js",
      "themes/normal/normal.js",
      "themes/vega/vega.js",
      "themes/blood-dragon/blood-dragon.js",
    ],
  },
  {
    name: "js/preload-flux.js",
    files: ["js/db.js", "js/locales.js", "js/flux.js", "js/userdata.js"],
  },
  { name: "js/preload-chaeros.js", files: ["js/db.js", "js/chaeros.js"] },
];

preloadMap.forEach((plmap) => {
  mergeFiles(plmap.files, plmap.name).then((stat) => {
    if (stat) {
      console.log("✅ " + plmap.name + " rebuilt");
    }
  });
});
