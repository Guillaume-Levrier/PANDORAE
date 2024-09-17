// ====== dimensions csl converter =====

import { pandodb } from "../../db";

const dimensionsCSLconverter = (dataset, source, normalize, email) => {
  const dimensionsToZoteroCSL = (item) => {
    const article = {
      itemType: "journalArticle",
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

    article.title = item.Title;
    article.abstractNote = item.Abstract;
    article.publicationTitle = item["Source title"];
    article.volume = item.Volume;
    article.date = item["Publication date"];

    if (item.hasOwnProperty("DOI")) {
      article.DOI = item.DOI;
    }

    const authors = item.Authors.split("; ");

    authors.forEach((auth) => {
      const names = auth.split(", ");
      const firstName = names[0];
      var lastName = "";
      for (let i = 1; i < names.length; ++i) {
        lastName += names[i];
      }
      article.creators.push({ creatorType: "author", firstName, lastName });
    });

    article.shortTitle = JSON.stringify(item);

    return article;
  };

  window.electron.send("console-logs", "Starting istexConverter on " + dataset); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
    // Open the database in which the scopus dataset is stored

    try {
      // If the file is valid, do the following:
      const articles = doc.content.entries; // Select the array filled with the targeted articles

      for (let i = 0; i < articles.length; i++) {
        const converted = dimensionsToZoteroCSL(articles[i]);

        window.electron.send(
          "chaeros-notification",
          `Converting ${i + 1}/${articles.length}`
        );

        convertedDataset.push(converted);
      }
    } catch (err) {
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset + "-converted";

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
            id,
            date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "dimensionsConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

export { dimensionsCSLconverter };
