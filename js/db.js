// =========== DATABASE ===========
//
// Since PANDORAE version 2, all database interactions happen here
// and are commanded by the Main process.
//
// The internal PAE database is structured around three tables:
// - flux, for the stable datasets harvested from various API/scraping/flatfile available sources.
// - standard, for the datasets converted to a PANDORAE (usually CSL-JSON based) format, which can be enriched.
// - type, for the stable datasets to be explored (most of the time retrieved from zotero).
//
// flux & type datasets are stable. They are here to be references as starting and ending points of your
// data retrieval, curation, and exploration journey with PANDORAE. The software lets you download them as
// flatfiles or remove them from the database, but not edit them.
//
// standard datasets are editable insofar as their standardized format enables enrichment and normalization.
//
// All operations on the database need to happen in this file for clarity reasons.
//
import Dexie from "dexie";

Dexie.debug = false;

let pandoraeDatabase = new Dexie("pandoraeDatabase");

//
// In the pandorae data format, the "source" refers
// to the last *external* location of data.
//
// If the dataset is in FLUX, this refers to the API source (like ISTEX) or a flat file.
//
// If the dataset is in standard, it can be either a FLUX source or
// Zotero, as imported datasets can be sent back to standard.
//
// If the dataset is in Type, its source is Zotero.
//

pandoraeDatabase.version(1).stores({
  flux: "id,source",
  standard: "id,source",
  system: "id,source",
  type: "id,source",
});

pandoraeDatabase.open();

// the add operation is a PUT operation, which enables replacing a dataset with the same ID.
const addDataset = (parameters) =>
  pandoraeDatabase[parameters.table].put(parameters.dataset);

const getDatasetById = (parameters) =>
  pandoraeDatabase[parameters.table].get(parameters.id);

const removeDataset = (parameters) =>
  pandoraeDatabase[parameters.table].delete(parameters.id);

const getDatasetList = (parameters) =>
  pandoraeDatabase[parameters.table].where("source").equals(parameters.value);

const databaseOperation = {
  addDataset,
  getDatasetById,
  removeDataset,
  getDatasetList,
};

const requestDatabase = (event, operation, parameters) =>
  (event.returnValue = databaseOperation[operation](parameters));

export { requestDatabase };
