// ========= BnF Solr Remap ==========
// function to remap documents from BnF solr to Zotero compatible
// CSL - JSON format.

const bnfRemap = (doc, solrCollection) => {
  const remappedDocument = { itemType: "webpage" };

  const originalBnfFields = {
    title: "title",
    description: "abstractNote",
    content_type_norm: "websiteType",
    content_language: "language",
    host: "websiteTitle",
  };

  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      remappedDocument[originalBnfFields[key]] = doc[key];
    }
  }

  remappedDocument.URL =
    "http://archivesinternet.bnf.fr/" + doc.wayback_date + "/" + doc.url;

  remappedDocument.creators = [];

  if (doc.hasOwnProperty("author")) {
    if (typeof doc.author === "string") {
      remappedDocument.author = [{ lastName: doc.author }];
    } else {
      remappedDocument.author = [];
      doc.author.forEach((auth) => {
        remappedDocument.author.push({ lastName: auth });
      });
    }
  }

  remappedDocument.date = doc.crawl_date;

  delete remappedDocument.undefined;

  // Here, filter out all document links that contain "mailto"
  // The warc-indexers take all <a> elements, the mailto is potentially problematic
  // in terms of personal informations.

  const hyperlinks = [];

  if (doc.hasOwnProperty("links")) {
    doc.links.forEach((link) =>
      link.indexOf("mailto:") > -1 ? 0 : hyperlinks.push(link)
    );
  }

  remappedDocument.shortTitle = JSON.stringify({
    id: doc.id,
    collections: doc.collections,
    links: hyperlinks,
    solrCollection,
  });

  return remappedDocument;
};
