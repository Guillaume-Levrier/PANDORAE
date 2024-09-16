//========== scopusConverter ==========
//scopusConverter converts a scopus JSON dataset into a Zotero CSL-JSON dataset.

const scopusConverter = (dataset, source, normalize, email) => {
  // [dataset] is the file to be converted
  window.electron.send(
    "console-logs",
    "Starting scopusConverter on " + dataset
  ); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
    // Open the database in which the scopus dataset is stored
    try {
      // If the file is valid, do the following:
      let articles = doc.content.entries; // Select the array filled with the targeted articles

      for (var i = 0; i < articles.length; ++i) {
        // For each article of the array, change the name of the properties
        let pushedArticle = {
          itemType: "journalArticle",
          title: "",
          creators: [{ creatorType: "author", firstName: "", lastName: "" }],
          abstractNote: "",
          publicationTitle: "",
          volume: "",
          issue: "",
          pages: "",
          date: "",
          series: "",
          seriesTitle: "",
          seriesText: "",
          journalAbbreviation: "",
          language: "",
          DOI: "",
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

        // Then Fill the article with the relevant properties
        pushedArticle.itemType = "journalArticle";
        pushedArticle.title = articles[i]["dc:title"];
        pushedArticle.url = articles[i]["url"];
        pushedArticle.creators[0].lastName = articles[i]["dc:creator"];
        pushedArticle.date = articles[i]["prism:coverDate"];
        pushedArticle.DOI = articles[i]["prism:doi"];
        pushedArticle.publicationTitle = articles[i]["prism:publicationName"];

        let enrichment = {
          affiliations: articles[i].affiliation,
          OA: articles[i].openaccessFlag,
        };

        if (articles[i].hasOwnProperty("altmetricData")) {
          enrichment.altmetric = JSON.stringify(articles[i].altmetricData);
        }

        pushedArticle.shortTitle = JSON.stringify(enrichment);
        convertedDataset.push(pushedArticle); // Then push the article in the array of converted articles
      }
    } catch (err) {
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset;
      if (normalize) {
        const converted = {
          id: id,
          date: date,
          name: dataset,
          content: convertedDataset,
        };
        crossRefEnricher(converted, email);
      } else {
        pandodb.open();

        pandodb.csljson
          .add({
            id: id,
            date: date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "scopusConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

export { scopusConverter };
