//
//
// Les séances sont laissées de côté ici
//
//
//

import { dataWriter } from "../chaeros-to-system";
import { createNewDocument, createNote } from "../zotero-fields";

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

  console.log(converteddata);

  dataWriter("standard", converteddata);
  console.log("done");
};

// Zotero-flavoured CSL JSON
//
const regardDocRemapper = (item) => {
  const convertedDocument = createNewDocument("statute");

  console.log(item);

  var titre = item.document_type;

  if (item.hasOwnProperty("titre")) {
    titre += " " + item.titre;
  }

  if (item.hasOwnProperty("aut")) {
    if (item.aut) {
      if (item.aut.hasOwnProperty("depute")) {
        titre += " " + item.aut.depute.nom;
      }
    }
  }

  if (item.hasOwnProperty("signataires")) {
    titre += " " + item.signataires;
  }

  convertedDocument.nameOfAct = titre;
  convertedDocument.dateEnacted = item.date;
  const note = createNote();
  note.note = JSON.stringify(item);

  convertedDocument.shortTitle = item.id;
  convertedDocument.note = note;

  console.log(convertedDocument);

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
