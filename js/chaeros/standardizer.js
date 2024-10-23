// ===== STANDARDIZER =====
//
// The PANDORAE v2 paradigm creates a clearer path for data. Once raw datasets are
// retrieved, they are left as such in the FLUX table. To some users, it is enough to be
// able to download them as JSON files.
//
// Other users want to be able to get this data closer to a baseline format and content.
// To make this possible, the standardizer creates copies of these datasets and converts
// those into Zotero-flavoured CSL-JSON datasets.
//
// The original raw datasets are left in FLUX. The converted copies are added to the STANDARD
// table.
//

import { istexConverter } from "./csljson-remappers/istex2csljson";

const standardizeDataset = (dataset) => {
  switch (dataset.source) {
    case "istex":
      istexConverter(dataset.data);
      break;

    default:
      break;
  }
};

export { standardizeDataset };