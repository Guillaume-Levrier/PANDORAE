const gallicaSRU2JSON = (xml) => {
  const parser = new DOMParser();
  const parseDoc = (xml) => parser.parseFromString(xml, "application/xml");
  const docToJSON = (element) => {
    const object = {};

    for (let i = 0; i < element.children.length; ++i) {
      const child = element.children[i];
      const key = child.tagName;
      if (!object.hasOwnProperty(key)) {
        object[key] = [];
      }
      object[key].push(child.textContent);
    }

    for (const key in object) {
      object[key] = object[key].toString();
    }

    return object;
  };

  const convertElements = (elementCollection) => {
    const result = [];
    for (let i = 0; i < elementCollection.length; ++i) {
      result.push(docToJSON(elementCollection[i]));
    }

    return result;
  };

  const doc = parseDoc(xml);
  return convertElements(doc.getElementsByTagName("oai_dc:dc"));
};

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
