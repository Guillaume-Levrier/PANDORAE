//
//
// Les séances sont laissées de côté ici
//
//
//

import { dataWriter } from "../chaeros-to-system";

const regardsCitoyensConverter = (dataset) => {
  const flattenedDataset = [];

  var seances;

  for (const doctype in dataset.data) {
    const docmap = dataset.data[doctype];
    const docArray = [...docmap.values()];

    switch (doctype) {
      case "texteloi":
      case "amendement":
      case "questionecrite":
      case "intervention":
      case "parlementaire":
        docArray.forEach((doc) => flattenedDataset.push(compilerDocument(doc)));
        break;

      case "seances":
        seances = docArray;
        break;

      default:
        break;
    }
  }

  const convertedDataset = [];

  flattenedDataset.forEach((doc) =>
    convertedDataset.push(regardDocRemapper(doc))
  );

  const converteddata = {
    id: dataset.id,
    date: dataset.date,
    source: "regards citoyens",
    name: dataset.name,
    data: convertedDataset,
  };

  dataWriter("standard", converteddata);
};

// Zotero-flavoured CSL JSON
//
const regardDocRemapper = (item) => {
  const convertedDocument = {
    itemType: "legislation",
    creators: [],
    pages: "",
    series: "",
    seriesTitle: "",
    seriesText: "",
    journalAbbreviation: "",
    language: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    tags: [],
    collections: [],
    relations: {},
  };

  convertedDocument.title = item.titre;
  convertedDocument.abstractNote = item.contenu;
  convertedDocument.date = item.date;

  convertedDocument.shortTitle = JSON.stringify(item);

  return convertedDocument;
};

// ==== on récupère chaque document par type (intervention / question / amendement/ etc)
// et on injecte toute ça dans array
//
//
const compilerDocument = (doc) => {
  const document = doc.content;
  document.document_id = doc.document_id;
  document.document_type = doc.document_type;
  document.document_url = doc.document_url;
  return document;
};

export { regardsCitoyensConverter };
