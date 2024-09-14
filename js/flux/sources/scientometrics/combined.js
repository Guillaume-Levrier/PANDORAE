//========== scientoDisplay ==========
// Cumulative display from different sources + enriched

const scientoDisplay = () => {
  //datasetDisplay(divId, kind, altkind)
  const sources = ["scopus", "webofscience", "dimensions", "istex"];

  sources.forEach((s) => datasetDisplay(`sciento-list-${s}`, s, "sciento"));
};

export { scientoDisplay };
