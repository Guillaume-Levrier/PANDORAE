const openAlextoCSLJSON = (d) => {
  const article = {
    itemType: "journalArticle",
    title: d.title,
    creators: [],
    abstractNote: "",
    publicationTitle: "",
    volume: d.biblio.volume,
    issue: d.biblio.issue,
    pages: d.biblio.first_page,
    date: d.publication_date,
    series: "",
    seriesTitle: "",
    seriesText: "",
    journalAbbreviation: "",
    language: d.language,
    DOI: d.doi,
    ISSN: "",
    shortTitle: "",
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

  if (d.hasOwnProperty("ISSN")) {
    article.ISSN = d.ISSN;
  }

  d.authorships.forEach((a) => {
    article.creators.push({
      creatorType: "author",
      firstName: "",
      lastName: a.raw_author_name,
    });
  });

  return article;
};
