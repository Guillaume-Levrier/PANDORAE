const dublinCore2csljson = (item) => {
  //article.creators.push({ creatorType: "author", firstName, lastName });

  const thisDoc = {
    itemType: "document",
    title: item["dc:title"],
    creators: [],
    extra: item["dc:subject"],
    abstractNote: item["dc:description"],
    publisher: item["dc:publisher"],
    date: item["dc:date"],
    libraryCatalog: item["dc:source"],
    language: item["dc:language"],
    rights: item["dc:rights"],
  };

  if (item["dc:creator"]) {
    thisDoc.creators.push({ creatorType: "author", name: item["dc:creator"] });
  }

  if (item["dc:contributor"]) {
    thisDoc.creators.push({
      creatorType: "contributor",
      name: item["dc:contributor"],
    });
  }

  const shortTitle = {
    type: item["dc:type"],
    format: item["dc:format"],
    identifier: item["dc:identifier"],
    relation: item["dc:relation"],
    coverage: item["dc:coverage"],
  };

  thisDoc.shortTitle = JSON.stringify(shortTitle);

  return thisDoc;
};
