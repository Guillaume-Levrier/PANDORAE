// ========= BnF Solr Remap ==========
// function to remap documents from BnF solr to Zotero compatible
// CSL - JSON format.

import { dataWriter } from "../chaeros-to-system";
import { createNewDocument, createNote } from "../zotero-fields";

const webArchiveRemap = (dataset) => {
  const cslData = [];

  dataset.data.forEach((d) => cslData.push(bnfRemap(d)));

  dataset.data = cslData;

  dataWriter("standard", dataset);

  window.electron.send("chaeros-notification", "Web archive converted to CSL");

  setTimeout(() => window.electron.send("win-destroy", true), 1000);
};

const bnfRemap = (doc) => {
  const convertedDocument = createNewDocument("webpage");

  const originalBnfFields = {
    title: "title",
    description: "abstractNote",
    content_type_norm: "websiteType",
    content_language: "language",
    host: "websiteTitle",
  };

  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      convertedDocument[originalBnfFields[key]] = doc[key];
    }
  }

  convertedDocument.URL =
    "http://archivesinternet.bnf.fr/" + doc.wayback_date + "/" + doc.url;

  convertedDocument.creators = [];

  convertedDocument.date = doc.crawl_date;

  delete convertedDocument.undefined;

  // Here, filter out all document links that contain "mailto"
  // The warc-indexers take all <a> elements, the mailto is potentially problematic
  // in terms of personal informations.

  const hyperlinks = [];

  if (doc.hasOwnProperty("links")) {
    doc.links.forEach((link) =>
      link.indexOf("mailto:") > -1 ? 0 : hyperlinks.push(link)
    );
  }

  const item = {
    id: doc.id,
    collections: doc.collections,
    links: hyperlinks,
    solrCollection: doc.solrCollection,
  };

  const note = createNote();
  note.note = JSON.stringify(item);

  convertedDocument.shortTitle = item.id;
  convertedDocument.note = note;

  return convertedDocument;
};

export { webArchiveRemap };
